import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getMagicLinkEmail } from '@/lib/email-templates/magic-link'
import crypto from 'crypto'

// ---------------------------------------------------------------------------
// Webhook signature verification (Supabase Standard Webhooks format)
// Secret format: "v1,whsec_<base64_key>"
// Signature header format: "v1,<base64_signature>"
// ---------------------------------------------------------------------------
function verifySignature(payload: string, signatureHeader: string, secret: string): boolean {
  // Extract the base64 key from "v1,whsec_<base64>"
  const secretBase64 = secret.replace(/^v1,whsec_/, '')
  const key = Buffer.from(secretBase64, 'base64')

  // Extract signature from "v1,<base64_signature>"
  const parts = signatureHeader.split(',')
  if (parts.length < 2) return false
  const signatureBase64 = parts.slice(1).join(',')

  const expected = crypto.createHmac('sha256', key).update(payload).digest('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureBase64))
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// POST handler — Supabase Send Email Hook
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('SUPABASE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Read raw body for signature verification
  const rawBody = await request.text()

  // Verify webhook signature (Standard Webhooks)
  const msgId = request.headers.get('webhook-id')
  const msgTimestamp = request.headers.get('webhook-timestamp')
  const msgSignature = request.headers.get('webhook-signature')
  if (!msgId || !msgTimestamp || !msgSignature) {
    return NextResponse.json({ error: 'Missing webhook headers' }, { status: 401 })
  }

  // Standard Webhooks signs: "${msg_id}.${timestamp}.${body}"
  const signedPayload = `${msgId}.${msgTimestamp}.${rawBody}`
  if (!verifySignature(signedPayload, msgSignature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: {
    user: { email: string }
    email_data: {
      token_hash: string
      redirect_to: string
      email_action_type: string
      token: string
    }
  }

  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { user, email_data } = body

  if (!user?.email || !email_data?.token_hash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Extract locale from redirect_to query param
  let locale = 'en'
  try {
    const redirectUrl = new URL(email_data.redirect_to)
    locale = redirectUrl.searchParams.get('locale') || 'en'
  } catch {
    // redirect_to might not be a valid URL, default to 'en'
  }

  // Build the verification URL that Supabase expects users to click
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const type = email_data.email_action_type === 'signup' ? 'signup' : 'magiclink'
  const actionUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`

  // Get locale-specific email content
  const { subject, html } = getMagicLinkEmail(locale, actionUrl)

  // Send via Resend
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: 'IndigoCV <noreply@indigocv.com>',
      to: user.email,
      subject,
      html,
    })

    if (emailError) {
      console.error('Resend email error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (err) {
    console.error('Resend send failed:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
