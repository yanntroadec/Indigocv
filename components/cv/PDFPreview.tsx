'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useCVStore } from '@/store/cvStore'
import CVDocument from './CVDocument'
import type { CVData, SectionKey } from '@/types/cv'

type Template = CVData['template']

// PDFViewer and PDFDownloadLink use browser-only APIs; load them client-side only
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
  { ssr: false, loading: () => <div className="flex-1 bg-gray-100 flex items-center justify-center text-sm text-gray-400">Chargement du document…</div> }
)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => <div className="magenta-btn block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold opacity-50">Chargement…</div> }
)

const COLOR_PALETTES: { label: string; colors: { label: string; value: string }[] }[] = [
  {
    label: 'Doux',
    colors: [
      { label: 'Ardoise',     value: '#5c6b7a' },
      { label: 'Acier',       value: '#5b7fa6' },
      { label: 'Sauge',       value: '#7a9e7e' },
      { label: 'Sarcelle',    value: '#4e8c8c' },
      { label: 'Rose poudré', value: '#b76e79' },
      { label: 'Corail doux', value: '#c4756a' },
      { label: 'Lavande',     value: '#9d8cb3' },
      { label: 'Taupe',       value: '#8b7355' },
    ],
  },
  {
    label: 'Profond',
    colors: [
      { label: 'Saphir',     value: '#1e4d8c' },
      { label: 'Émeraude',   value: '#1a6b4a' },
      { label: 'Bordeaux',   value: '#722f37' },
      { label: 'Prune',      value: '#5c2d6e' },
      { label: 'Pétrole',    value: '#1a5276' },
      { label: 'Brique',     value: '#8b3a2a' },
      { label: 'Forêt',      value: '#2d5a27' },
      { label: 'Anthracite', value: '#2c3e50' },
    ],
  },
  {
    label: 'Terre',
    colors: [
      { label: 'Terracotta', value: '#c4622d' },
      { label: 'Ocre',       value: '#c8923a' },
      { label: 'Sable doré', value: '#b5956a' },
      { label: 'Cannelle',   value: '#8b5e3c' },
      { label: 'Moutarde',   value: '#b5952a' },
      { label: 'Rouille',    value: '#9c4b2a' },
      { label: 'Bronze',     value: '#8c6d2f' },
      { label: 'Fauve',      value: '#c07850' },
    ],
  },
  {
    label: 'Nordique',
    colors: [
      { label: 'Glacier',       value: '#6b9eb2' },
      { label: 'Brume',         value: '#7a9aaa' },
      { label: 'Azur',          value: '#4a84b0' },
      { label: 'Eucalyptus',    value: '#6a9e82' },
      { label: 'Ardoise bleue', value: '#6a88a0' },
      { label: 'Écume',         value: '#5a9090' },
      { label: 'Bruyère',       value: '#7a6fa0' },
      { label: 'Givre',         value: '#6a8c88' },
    ],
  },
]

const FONTS: { label: string; value: Template['font']; family: string }[] = [
  { label: 'Helvetica',        value: 'Helvetica',        family: 'Arial, sans-serif' },
  { label: 'Times',            value: 'Times-Roman',      family: 'Georgia, serif' },
  { label: 'Roboto',           value: 'Roboto',           family: 'Roboto, Arial, sans-serif' },
  { label: 'Lato',             value: 'Lato',             family: 'Lato, Arial, sans-serif' },
  { label: 'Montserrat',       value: 'Montserrat',       family: 'Montserrat, Arial, sans-serif' },
  { label: 'Raleway',          value: 'Raleway',          family: 'Raleway, Arial, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display', family: '"Playfair Display", Georgia, serif' },
  { label: 'Merriweather',     value: 'Merriweather',     family: 'Merriweather, Georgia, serif' },
]

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'summary',        label: 'Profil' },
  { key: 'experiences',    label: 'Expériences' },
  { key: 'projects',       label: 'Projets' },
  { key: 'education',      label: 'Formation' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'skills',         label: 'Compétences' },
  { key: 'languages',      label: 'Langues' },
  { key: 'interests',      label: "Centres d'intérêt" },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{children}</p>
}

function FontPicker({ value, onChange }: { value: Template['font']; onChange: (f: Template['font']) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = FONTS.find((f) => f.value === value) ?? FONTS[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl border-2 border-gray-200 px-3 py-2.5 bg-white hover:border-gray-300 transition"
      >
        <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: current.family }}>
          {current.label}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
          {FONTS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => { onChange(f.value); setOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition hover:bg-gray-50 ${
                value === f.value ? 'bg-indigo-50' : ''
              }`}
            >
              <span className="text-sm font-medium text-gray-800" style={{ fontFamily: f.family }}>
                {f.label}
              </span>
              {value === f.value && (
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PDFPreview() {
  const { cv, setTemplate } = useCVStore()
  const template = cv.template
  const update = (patch: Partial<Template>) => setTemplate({ ...template, ...patch })

  const toggleSection = (key: SectionKey) => {
    const isHidden = template.hiddenSections.includes(key)
    update({
      hiddenSections: isHidden
        ? template.hiddenSections.filter((k) => k !== key)
        : [...template.hiddenSections, key],
    })
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* PDF Viewer — left */}
      <div className="flex-1 bg-gray-100 h-full min-h-[60vh] lg:min-h-0">
        <PDFViewer width="100%" height="100%" className="border-0">
          <CVDocument cv={cv} />
        </PDFViewer>
      </div>

      {/* Side panel — right */}
      <aside className="w-full lg:w-72 bg-white/70 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/80 flex flex-col h-full">

        {/* Fixed top — identity + download */}
        <div className="flex-none p-5 border-b border-gray-100 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 leading-tight">
              {cv.personal.firstName || 'Votre'} {cv.personal.lastName || 'CV'}
            </h2>
            {cv.personal.jobTitle && (
              <p className="text-xs text-indigo-600 mt-0.5">{cv.personal.jobTitle}</p>
            )}
          </div>

          <PDFDownloadLink
            document={<CVDocument cv={cv} />}
            fileName="mon-cv.pdf"
            className="magenta-btn block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition"
          >
            {({ loading }) => loading ? 'Génération en cours...' : 'Télécharger le PDF'}
          </PDFDownloadLink>
        </div>

        {/* Scrollable customisation area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Layout */}
          <div>
            <SectionLabel>Mise en page</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'single',  label: 'Une colonne',  badge: 'ATS' },
                { value: 'sidebar', label: 'Deux colonnes', badge: 'Design' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ layout: opt.value })}
                  className={`rounded-xl border-2 py-2 px-2 text-left transition ${
                    template.layout === opt.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-700">{opt.label}</p>
                  <p className="text-[10px] text-gray-400">{opt.badge}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <SectionLabel>Couleur d'accentuation</SectionLabel>
            <div className="space-y-2">
              {COLOR_PALETTES.map((palette) => (
                <div key={palette.label}>
                  <p className="text-[10px] text-gray-400 mb-1">{palette.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {palette.colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => update({ accentColor: c.value })}
                        title={c.label}
                        className="w-6 h-6 rounded-full transition-all"
                        style={{
                          backgroundColor: c.value,
                          outline: template.accentColor === c.value ? `3px solid ${c.value}` : '3px solid transparent',
                          outlineOffset: '2px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <SectionLabel>Police</SectionLabel>
            <FontPicker value={template.font} onChange={(font) => update({ font })} />
          </div>

          {/* Density */}
          <div>
            <SectionLabel>Densité du contenu</SectionLabel>
            <div className="flex gap-2">
              {([
                { value: 'compact', label: 'Compact' },
                { value: 'normal',  label: 'Normal' },
                { value: 'airy',    label: 'Aéré' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ density: opt.value })}
                  className={`flex-1 rounded-lg border-2 py-1.5 text-xs font-medium transition ${
                    template.density === opt.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <SectionLabel>Sections visibles</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {SECTIONS.map((sec) => {
                const isHidden = template.hiddenSections.includes(sec.key)
                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => toggleSection(sec.key)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                      isHidden
                        ? 'border-gray-200 text-gray-400 bg-white'
                        : 'border-indigo-300 text-indigo-600 bg-indigo-50'
                    }`}
                  >
                    {isHidden ? '○' : '●'} {sec.label}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Fixed bottom — navigation */}
        <div className="flex-none p-5 border-t border-gray-100 space-y-2">
          <Link
            href="/create"
            className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Modifier mon CV
          </Link>
          <Link
            href="/"
            className="indigo-btn block w-full rounded-xl px-4 py-2.5 text-center text-sm font-medium transition"
          >
            Revenir à l'accueil
          </Link>
        </div>

      </aside>
    </div>
  )
}
