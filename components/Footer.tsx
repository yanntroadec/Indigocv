'use client'

import { usePathname, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const pathname = usePathname()
  const t = useTranslations('footer')

  if (pathname === '/preview') return null

  return (
    <footer style={{
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.8)',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    }}>
      <Link href="/faq" className="hover:text-indigo-600 transition" style={{ fontSize: '11px', color: '#9ca3af' }}>
        {t('faq')}
      </Link>
      <span style={{ fontSize: '11px', color: '#d1d5db' }}>·</span>
      <Link href="/contact" className="hover:text-indigo-600 transition" style={{ fontSize: '11px', color: '#9ca3af' }}>
        {t('contact')}
      </Link>
      <span style={{ fontSize: '11px', color: '#d1d5db' }}>·</span>
      <p style={{ fontSize: '11px', color: '#9ca3af' }}>
        {t('copyright', { year: new Date().getFullYear() })}
      </p>
    </footer>
  )
}
