'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useUser } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { STEPS } from '@/components/form/FormWizard'


function StepIndicator() {
  const t = useTranslations('form')
  const { step, setStep } = useCVStore()

  return (
    <>
      {/* Mobile — text only */}
      <div className="flex sm:hidden items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: '#e11d78' }}>
          {t(`steps.${STEPS[step].key}.short`)}
        </span>
        <span className="text-xs text-gray-400">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Desktop — full step circles */}
      <div className="hidden sm:flex items-center">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(i)}
              title={t(`steps.${s.key}.short`)}
              className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all"
              style={{
                background: i < step ? '#f0a0b8' : i === step ? '#e11d78' : 'rgba(255,255,255,0.7)',
                color: i < step || i === step ? '#fff' : '#9ca3af',
                border: i < step || i === step ? 'none' : '1px solid #e5e7eb',
                boxShadow: i === step ? '0 0 0 3px rgba(225,29,120,0.2)' : 'none',
              }}
            >
              {i < step ? '✓' : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="h-px w-5 mx-0.5 transition-all"
                style={{ background: i < step ? '#f0a0b8' : '#e5e7eb' }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'fr' : 'en' })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
      {locale.toUpperCase()}
    </button>
  )
}

function UserMenu() {
  const t = useTranslations('header')
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
      >
        {t('login')}
      </Link>
    )
  }

  const initial = user.email?.[0]?.toUpperCase() ?? '?'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition hover:opacity-80"
        style={{ background: '#4f46e5' }}
        title={user.email}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
          <p className="px-3 py-2 text-xs text-gray-400 truncate border-b border-gray-100">{user.email}</p>
          {pathname !== '/' && (
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              {t('home')}
            </Link>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); useCVStore.getState().reset(); router.push('/create') }}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            {t('newCV')}
          </button>
          {pathname !== '/' && (
            <button
              type="button"
              onClick={() => { setOpen(false); useCVStore.getState().saveCVToSupabase() }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              {t('save')}
            </button>
          )}
          <div className="border-t border-gray-100" />
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            {t('dashboard')}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  )
}

function NewCVButton() {
  const t = useTranslations('header')
  const reset = useCVStore((s) => s.reset)
  const router = useRouter()

  function handleNewCV() {
    reset()
    router.push('/create')
  }

  return (
    <button
      type="button"
      onClick={handleNewCV}
      className="magenta-btn rounded-xl px-4 py-2 text-sm font-semibold transition"
    >
      {t('newCV')}
    </button>
  )
}

export default function Header() {
  const t = useTranslations('header')
  const pathname = usePathname()

  if (pathname === '/preview') return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/50 backdrop-blur-md border-b border-white/60 shadow-sm">
      {/* Left — logo */}
      <Link href="/">
        <span className="text-base font-bold tracking-tight" style={{ color: '#4f46e5' }}>
          IndigoCV
        </span>
      </Link>

      {/* Center — step indicator on /create only (desktop) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
        {pathname === '/create' && <StepIndicator />}
      </div>

      {/* Right — locale switcher + desktop actions + user menu */}
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <div className="hidden sm:flex items-center gap-3">
          {pathname === '/create' && (
            <>
              <NewCVButton />
              <Link
                href="/preview"
                className="indigo-btn rounded-xl px-4 py-2 text-sm font-semibold transition"
              >
                {t('preview')}
              </Link>
            </>
          )}
        </div>
        <UserMenu />
      </div>
    </header>
  )
}
