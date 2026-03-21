'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCVStore } from '@/store/cvStore'
import { STEPS } from '@/components/form/FormWizard'


function StepIndicator() {
  const { step, setStep } = useCVStore()

  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          <button
            type="button"
            onClick={() => setStep(i)}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
              style={{
                background: i < step ? '#f0a0b8' : i === step ? '#e11d78' : 'rgba(255,255,255,0.7)',
                color: i < step || i === step ? '#fff' : '#9ca3af',
                border: i < step || i === step ? 'none' : '1px solid #e5e7eb',
                boxShadow: i === step ? '0 0 0 3px rgba(225,29,120,0.2)' : 'none',
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            {/* Label only for active step — others invisible but keep layout stable */}
            <span
              className="text-[10px] font-medium leading-none transition-all whitespace-nowrap"
              style={{ color: i === step ? '#e11d78' : 'transparent' }}
            >
              {s.short}
            </span>
          </button>

          {i < STEPS.length - 1 && (
            <div
              className="h-px w-6 mb-4 mx-0.5 transition-all"
              style={{ background: i < step ? '#f0a0b8' : '#e5e7eb' }}
            />
          )}
        </div>
      ))}
    </div>
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
          indigo cv
        </span>
      </Link>

      {/* Center — step indicator on /create only */}
      <div className="absolute left-1/2 -translate-x-1/2">
        {pathname === '/create' && <StepIndicator />}
      </div>

      {/* Right — contextual action */}
      {pathname === '/create' ? (
        <Link
          href="/preview"
          className="indigo-btn rounded-xl px-4 py-2 text-sm font-semibold transition"
        >
          Prévisualiser →
        </Link>
      ) : <div />}
    </header>
  )
}
