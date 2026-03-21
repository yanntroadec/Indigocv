'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useUser } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { STEPS } from '@/components/form/FormWizard'


function StepIndicator() {
  const { step, setStep } = useCVStore()

  return (
    <>
      {/* Mobile — text only */}
      <div className="flex sm:hidden items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: '#e11d78' }}>{STEPS[step].short}</span>
        <span className="text-xs text-gray-400">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Desktop — full step circles */}
      <div className="hidden sm:flex items-center">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(i)}
              title={s.short}
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

function UserMenu() {
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
        Se connecter
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
              Accueil
            </Link>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); useCVStore.getState().reset(); router.push('/create') }}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Nouveau CV
          </button>
          {pathname !== '/' && (
            <button
              type="button"
              onClick={() => { setOpen(false); useCVStore.getState().saveCVToSupabase() }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Sauvegarder
            </button>
          )}
          <div className="border-t border-gray-100" />
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Mon dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

function NewCVButton({ className = '' }: { className?: string }) {
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
      className={`magenta-btn rounded-xl px-4 py-2 text-sm font-semibold transition ${className}`}
    >
      Nouveau CV
    </button>
  )
}

export default function Header() {
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

      {/* Right — desktop: full actions | mobile: user menu only */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3">
          {pathname === '/create' && (
            <>
              <NewCVButton />
              <Link
                href="/preview"
                className="indigo-btn rounded-xl px-4 py-2 text-sm font-semibold transition"
              >
                Prévisualiser →
              </Link>
            </>
          )}
        </div>
        <UserMenu />
      </div>
    </header>
  )
}
