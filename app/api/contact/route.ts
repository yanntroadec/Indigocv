import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Insert into database
  const supabase = await createClient()
  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })

  if (dbError) {
    console.error('Contact form DB error:', dbError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Send email notification via Resend (non-blocking — don't fail the request if email fails)
  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { error: emailError } = await resend.emails.send({
        from: 'IndigoCV <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL,
        subject: `[IndigoCV] Message de ${name}`,
        replyTo: email,
        text: `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`,
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
