import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

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
      <LandingContent />
    </main>
  )
}

function LandingContent() {
  const t = useTranslations('landing')

  return (
    <div className="max-w-lg text-center flex flex-col items-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl drop-shadow-sm">
        {t('title')}{' '}
        <span style={{ color: '#e11d78' }}>{t('titleHighlight')}</span>
      </h1>

      <p className="text-lg text-gray-600 leading-relaxed mt-4">{t('description')}</p>

      <p className="text-sm text-gray-400 mt-1 mb-3">{t('tagline')}</p>
      <Link href="/create" className="magenta-btn rounded-xl px-6 py-3 text-base font-medium">
        {t('cta')}
      </Link>
      <p className="text-xs text-gray-400 mt-3">{t('footer')}</p>
    </div>
  )
}
