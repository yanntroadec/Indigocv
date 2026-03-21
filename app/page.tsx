import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'IndigoCV — Créez votre CV en quelques minutes',
  description:
    'Générez un CV propre et professionnel, téléchargeable en PDF, directement dans votre navigateur.',
}

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-10"
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
      <div className="max-w-lg text-center flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl drop-shadow-sm">
          Créez votre CV{' '}
          <span style={{ color: '#e11d78' }}>
            propre et professionnel
          </span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mt-4">
          Remplissez un formulaire simple, prévisualisez votre CV en temps réel
          et téléchargez-le en PDF en un clic.
        </p>

        <p className="text-sm text-gray-400 mt-1 mb-3">Gratuit · Téléchargement immédiat</p>
        <Link
          href="/create"
          className="magenta-btn rounded-xl px-6 py-3 text-base font-medium"
        >
          Créer mon CV →
        </Link>
        <p className="text-xs text-gray-400 mt-3">
          Compatible ATS · Format A4 · Police professionnelle
        </p>
      </div>
    </main>
  )
}
