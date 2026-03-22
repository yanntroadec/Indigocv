'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

const COUNTRIES = [
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France', length: [9] },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States', length: [10] },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', length: [10] },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany', length: [10, 11] },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain', length: [9] },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy', length: [9, 10] },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal', length: [9] },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgium', length: [8, 9] },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland', length: [9] },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands', length: [9] },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada', length: [10] },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', length: [9] },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil', length: [10, 11] },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico', length: [10] },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan', length: [10, 11] },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea', length: [10, 11] },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China', length: [11] },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India', length: [10] },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Morocco', length: [9] },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algeria', length: [9] },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisia', length: [8] },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal', length: [9] },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: 'Ivory Coast', length: [10] },
  { code: 'CM', dial: '+237', flag: '🇨🇲', name: 'Cameroon', length: [9] },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland', length: [9] },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Romania', length: [9, 10] },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden', length: [9, 10] },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Norway', length: [8] },
  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Denmark', length: [8] },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finland', length: [9, 10] },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Ireland', length: [9] },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria', length: [10, 11] },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxembourg', length: [8, 9] },
  { code: 'GR', dial: '+30', flag: '🇬🇷', name: 'Greece', length: [10] },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey', length: [10] },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Russia', length: [10] },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE', length: [9] },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', length: [9] },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel', length: [9] },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina', length: [10] },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile', length: [9] },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia', length: [10] },
] as const

type Country = (typeof COUNTRIES)[number]

function parsePhone(fullPhone: string): { country: Country; local: string } {
  // Try to match a country dial code from the stored value
  if (fullPhone) {
    // Sort by dial code length desc to match longest first (e.g. +352 before +3)
    const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length)
    for (const c of sorted) {
      if (fullPhone.startsWith(c.dial)) {
        return { country: c, local: fullPhone.slice(c.dial.length).replace(/\s/g, '') }
      }
    }
  }
  return { country: COUNTRIES[0], local: fullPhone.replace(/^\+?\d{1,3}\s?/, '') }
}

interface PhoneFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  invalidMessage?: string
}

export default function PhoneField({ label, value, onChange, placeholder, invalidMessage }: PhoneFieldProps) {
  const parsed = useMemo(() => parsePhone(value), [value])
  const [selectedCountry, setSelectedCountry] = useState<Country>(parsed.country)
  const [localNumber, setLocalNumber] = useState(parsed.local)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // Sync from external value only on first mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      const p = parsePhone(value)
      setSelectedCountry(p.country)
      setLocalNumber(p.local)
    }
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
  }, [open])

  const digits = localNumber.replace(/\D/g, '')
  const validLengths = selectedCountry.length as readonly number[]
  const isValid = digits.length === 0 || validLengths.includes(digits.length)
  const isTooLong = digits.length > Math.max(...validLengths)

  function handleLocalChange(raw: string) {
    // Only allow digits and spaces
    const cleaned = raw.replace(/[^\d\s]/g, '')
    setLocalNumber(cleaned)
    const d = cleaned.replace(/\D/g, '')
    if (d.length > 0) {
      onChange(`${selectedCountry.dial}${d}`)
    } else {
      onChange('')
    }
  }

  function handleCountrySelect(country: Country) {
    setSelectedCountry(country)
    setOpen(false)
    setSearch('')
    const d = localNumber.replace(/\D/g, '')
    if (d.length > 0) {
      onChange(`${country.dial}${d}`)
    }
  }

  const filteredCountries = search
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-0" ref={ref}>
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 h-10 px-2.5 rounded-l-xl border border-r-0 border-gray-300 hover:bg-gray-50 transition text-sm"
          >
            <span>{selectedCountry.flag}</span>
            <span className="text-gray-600 text-xs font-medium">{selectedCountry.dial}</span>
            <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute z-50 mt-1 w-64 max-h-60 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                      selectedCountry.code === c.code ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="text-gray-800 font-medium flex-1">{c.name}</span>
                    <span className="text-gray-400 text-xs">{c.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          className={`flex-1 rounded-r-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10 ${
            digits.length > 0 && (!isValid || isTooLong) ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'
          }`}
          value={localNumber}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {digits.length > 0 && !isValid && invalidMessage && (
        <p className="text-xs text-red-500 mt-1">{invalidMessage}</p>
      )}
    </div>
  )
}
