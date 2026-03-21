'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HomeButton() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-white/90 transition"
    >
      ← Accueil
    </Link>
  )
}
