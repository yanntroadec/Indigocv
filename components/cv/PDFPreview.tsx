'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import CVDocument from './CVDocument'
import type { CVData, SectionKey, ProfileRecord } from '@/types/cv'
import { COLOR_PALETTES, FONTS, SECTION_KEYS, DIVIDER_COLORS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

type Template = CVData['template']

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
  { ssr: false, loading: () => <div className="flex-1 bg-gray-100 flex items-center justify-center text-sm text-gray-400">…</div> }
)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => <div className="magenta-btn block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold opacity-50">…</div> }
)

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
        aria-label={current.label}
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
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition hover:bg-gray-50 ${value === f.value ? 'bg-indigo-50' : ''}`}
            >
              <span className="text-sm font-medium text-gray-800" style={{ fontFamily: f.family }}>{f.label}</span>
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

interface PDFPreviewProps {
  isAuthenticated?: boolean
  profiles?: { id: string; name: string }[]
}

export default function PDFPreview({ isAuthenticated = false, profiles = [] }: PDFPreviewProps) {
  const { cv, currentCvName, currentProfileId, setTemplate, isSaving, lastSavedAt, saveError, saveCVToSupabase, loadProfile, reset } = useCVStore()
  const locale = useLocale()
  const t = useTranslations('preview')
  const tHeader = useTranslations('header')
  const tTemplate = useTranslations('form.template')
  const tCv = useTranslations('cv')
  const router = useRouter()
  const template = cv.template
  const update = (patch: Partial<Template>) => setTemplate({ ...template, ...patch })
  const [loadingProfile, setLoadingProfile] = useState(false)

  const handleProfileChange = useCallback(async (profileId: string) => {
    if (!profileId) return
    setLoadingProfile(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('id, name, data, created_at, updated_at')
        .eq('id', profileId)
        .single()

      if (data) {
        loadProfile(data as ProfileRecord)
      }
    } finally {
      setLoadingProfile(false)
    }
  }, [loadProfile])

  const sectionTitles = {
    profile: tCv('profile'),
    experience: tCv('experience'),
    projects: tCv('projects'),
    education: tCv('education'),
    certifications: tCv('certifications'),
    skills: tCv('skills'),
    languages: tCv('languages'),
    interests: tCv('interests'),
    contact: tCv('contact'),
    present: tCv('present'),
  }

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
          <CVDocument cv={cv} sectionTitles={sectionTitles} />
        </PDFViewer>
      </div>

      {/* Side panel — right */}
      <aside className="w-full lg:w-72 bg-white/70 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/80 flex flex-col h-full">

        {/* Fixed top — identity + download + save */}
        <div className="flex-none p-5 border-b border-gray-100 space-y-3">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">
            {currentCvName ?? t('yourCV')}
          </h2>

          <PDFDownloadLink
            document={<CVDocument cv={cv} sectionTitles={sectionTitles} />}
            fileName="cv.pdf"
            className="magenta-btn block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition"
          >
            {({ loading }) => loading ? '…' : t('download')}
          </PDFDownloadLink>

          {isAuthenticated && (
            <div>
              <button
                type="button"
                onClick={() => saveCVToSupabase()}
                disabled={isSaving}
                className="indigo-btn block w-full rounded-xl px-4 py-2 text-center text-sm font-semibold transition disabled:opacity-50"
              >
                {isSaving ? t('saving') : t('save')}
              </button>
              {lastSavedAt && !saveError && (
                <p className="text-[10px] text-gray-400 text-center mt-1">
                  {t('saved')} {lastSavedAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              {saveError && (
                <p className="text-[10px] text-red-500 text-center mt-1">{saveError}</p>
              )}
            </div>
          )}
        </div>

        {/* Scrollable customisation area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Profile selector — authenticated users with saved profiles */}
          {isAuthenticated && profiles.length > 0 && (
            <div>
              <SectionLabel>{t('selectProfile')}</SectionLabel>
              <select
                value={currentProfileId ?? ''}
                onChange={(e) => handleProfileChange(e.target.value)}
                disabled={loadingProfile}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 bg-white text-sm text-gray-800 hover:border-gray-300 transition disabled:opacity-50"
              >
                <option value="">{t('customProfile')}</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Layout */}
          <div>
            <SectionLabel>{tTemplate('layout')}</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'single',  labelKey: 'singleColumn',  badgeKey: 'atsFriendly' },
                { value: 'sidebar', labelKey: 'twoColumns', badgeKey: 'modernDesign' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ layout: opt.value })}
                  className={`rounded-xl border-2 py-2 px-2 text-left transition ${
                    template.layout === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-700">{tTemplate(opt.labelKey)}</p>
                  <p className="text-[10px] text-gray-400">{tTemplate(opt.badgeKey)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <SectionLabel>{tTemplate('accentColor')}</SectionLabel>
            <div className="space-y-2">
              {COLOR_PALETTES.map((palette) => (
                <div key={palette.key}>
                  <p className="text-[10px] text-gray-400 mb-1">{tTemplate(`palettes.${palette.key}`)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {palette.colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => update({ accentColor: c.value })}
                        aria-label={c.label}
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

          {/* Divider color */}
          <div>
            <SectionLabel>{tTemplate('dividerColor')}</SectionLabel>
            <div className="grid grid-cols-4 gap-2">
              {DIVIDER_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update({ dividerColor: c.value })}
                  aria-label={c.label}
                  title={c.label}
                  className="h-8 rounded-lg border-2 transition-all relative flex items-center justify-center"
                  style={{
                    backgroundColor: c.value,
                    borderColor: template.dividerColor === c.value ? '#6366f1' : '#e5e7eb',
                  }}
                >
                  {template.dividerColor === c.value && (
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <SectionLabel>{tTemplate('font')}</SectionLabel>
            <FontPicker value={template.font} onChange={(font) => update({ font })} />
          </div>

          {/* Density */}
          <div>
            <SectionLabel>{tTemplate('density')}</SectionLabel>
            <div className="flex gap-2">
              {(['compact', 'normal', 'airy'] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update({ density: val })}
                  className={`flex-1 rounded-lg border-2 py-1.5 text-xs font-medium transition ${
                    template.density === val
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {tTemplate(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <SectionLabel>{tTemplate('visibleSections')}</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {SECTION_KEYS.map((key) => {
                const isHidden = template.hiddenSections.includes(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSection(key)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                      isHidden ? 'border-gray-200 text-gray-400 bg-white' : 'border-indigo-300 text-indigo-600 bg-indigo-50'
                    }`}
                  >
                    {isHidden ? '○' : '●'} {tTemplate(`sections.${key}`)}
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
            {t('backToEdit')}
          </Link>
          <Link
            href="/"
            className="indigo-btn block w-full rounded-xl px-4 py-2.5 text-center text-sm font-medium transition"
          >
            {tHeader('home')}
          </Link>
        </div>

      </aside>
    </div>
  )
}
