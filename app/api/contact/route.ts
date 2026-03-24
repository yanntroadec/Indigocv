import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per serverless instance)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000  // 1 minute
const RATE_LIMIT_MAX = 3             // max 3 requests per IP per window

const ipHits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of ipHits) {
    if (now > entry.resetAt) ipHits.delete(ip)
  }
}, 5 * 60_000)

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_MAX = 200
const MESSAGE_MAX = 5000

function validateFields(name: unknown, email: unknown, message: unknown): string | null {
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return 'Invalid field types'
  }
  if (!name.trim() || !email.trim() || !message.trim()) {
    return 'Missing fields'
  }
  if (name.length > NAME_MAX) return `Name too long (max ${NAME_MAX})`
  if (message.length > MESSAGE_MAX) return `Message too long (max ${MESSAGE_MAX})`
  if (!EMAIL_RE.test(email)) return 'Invalid email format'
  return null
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, message } = body
  const validationError = validateFields(name, email, message)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  // Trim inputs
  const safeName = (name as string).trim().slice(0, NAME_MAX)
  const safeEmail = (email as string).trim()
  const safeMessage = (message as string).trim().slice(0, MESSAGE_MAX)

  // Insert via service_role (bypasses RLS — no public INSERT policy needed)
  const supabase = createAdminClient()
  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert({ name: safeName, email: safeEmail, message: safeMessage })

  if (dbError) {
    console.error('Contact form DB error:', dbError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Send email notification via Resend
  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { error: emailError } = await resend.emails.send({
        from: 'IndigoCV <noreply@indigocv.com>',
        to: process.env.CONTACT_EMAIL,
        subject: `[IndigoCV] Message de ${safeName}`,
        replyTo: safeEmail,
        text: `Nom : ${safeName}\nEmail : ${safeEmail}\n\nMessage :\n${safeMessage}`,
      })
      if (emailError) {
        console.error('Resend email error:', emailError)
      }
    } catch (err) {
      console.error('Resend send failed:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
