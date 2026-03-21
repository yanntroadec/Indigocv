'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
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
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-8">
          <div className="text-center mb-6">
            <Link href="/" className="text-base font-bold tracking-tight" style={{ color: '#4f46e5' }}>
              indigo cv
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 mt-3">Se connecter</h1>
            <p className="text-sm text-gray-500 mt-1">
              Reçois un lien magique par email pour accéder à ton espace.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">📬</div>
              <p className="text-sm font-medium text-gray-800">Vérifie ta boîte mail !</p>
              <p className="text-xs text-gray-500">
                Un lien de connexion a été envoyé à <strong>{email}</strong>.
                Clique dessus pour accéder à ton espace.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail('') }}
                className="text-xs text-indigo-600 hover:underline mt-2"
              >
                Utiliser une autre adresse
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="indigo-btn w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Envoi en cours…' : 'Recevoir un lien de connexion'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link href="/" className="hover:underline">← Retour à l'accueil</Link>
        </p>
      </div>
    </main>
  )
}
