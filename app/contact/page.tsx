'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (honeypot) {
      setSubmitted(true)
      return
    }

    setLoading(true)
    setError(null)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `
          repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 28px,
            rgba(255, 255, 255, 0.18) 28px,
            rgba(255, 255, 255, 0.18) 30px
          ),
          linear-gradient(
            105deg,
            #ffd6d6 0%,
            #ffddb8 16%,
            #faf7c0 32%,
            #c9efd4 48%,
            #c0e8f7 64%,
            #cdd3f5 80%,
            #e8cef5 100%
          )
        `,
      }}
    >
      <div className="w-full max-w-sm">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link href="/" className="text-base font-bold tracking-tight" style={{ color: '#4f46e5' }}>
              IndigoCV
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 mt-3">Nous contacter</h1>
            <p className="text-sm text-gray-500 mt-1">
              Une question, une suggestion ou un bug à signaler ? Envoyez-nous un message.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✉️</div>
              <p className="text-sm font-medium text-gray-800">Message envoyé !</p>
              <p className="text-xs text-gray-500">
                Merci pour votre message. Nous vous répondrons dès que possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prénom et nom"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition resize-none"
                />
              </div>

              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px' }}
              />

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="indigo-btn w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Envoi en cours…' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link href="/" className="hover:underline">← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </main>
  )
}
