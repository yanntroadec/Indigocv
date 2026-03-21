'use client'

import Link from 'next/link'
import { useState } from 'react'

const GRADIENT_DEFAULT =
  'linear-gradient(105deg, #c97a7a 0%, #c4924a 17%, #b5a030 33%, #4a9e70 50%, #3a7eaf 67%, #7a72c4 83%, #c97a7a 100%)'

const GRADIENT_HOVER =
  'linear-gradient(105deg, #7a72c4 0%, #c97a7a 17%, #c4924a 33%, #b5a030 50%, #4a9e70 67%, #3a7eaf 83%, #7a72c4 100%)'

export default function RainbowButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-block',
        borderRadius: '0.75rem',
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        textDecoration: 'none',
        background: hovered ? GRADIENT_HOVER : GRADIENT_DEFAULT,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'background 0.6s ease, transform 0.15s ease',
      }}
    >
      {children}
    </Link>
  )
}
