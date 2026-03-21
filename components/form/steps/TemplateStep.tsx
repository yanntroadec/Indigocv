'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData, SectionKey } from '@/types/cv'

type Template = CVData['template']

const COLOR_PALETTES: { key: 'soft' | 'deep' | 'earth' | 'nordic'; colors: { label: string; value: string }[] }[] = [
  {
    key: 'soft',
    colors: [
      { label: 'Slate',        value: '#5c6b7a' },
      { label: 'Steel',        value: '#5b7fa6' },
      { label: 'Sage',         value: '#7a9e7e' },
      { label: 'Teal',         value: '#4e8c8c' },
      { label: 'Dusty Rose',   value: '#b76e79' },
      { label: 'Soft Coral',   value: '#c4756a' },
      { label: 'Lavender',     value: '#9d8cb3' },
      { label: 'Taupe',        value: '#8b7355' },
    ],
  },
  {
    key: 'deep',
    colors: [
      { label: 'Sapphire',     value: '#1e4d8c' },
      { label: 'Emerald',      value: '#1a6b4a' },
      { label: 'Bordeaux',     value: '#722f37' },
      { label: 'Plum',         value: '#5c2d6e' },
      { label: 'Petrol',       value: '#1a5276' },
      { label: 'Brick',        value: '#8b3a2a' },
      { label: 'Forest',       value: '#2d5a27' },
      { label: 'Anthracite',   value: '#2c3e50' },
    ],
  },
  {
    key: 'earth',
    colors: [
      { label: 'Terracotta',   value: '#c4622d' },
      { label: 'Ochre',        value: '#c8923a' },
      { label: 'Golden Sand',  value: '#b5956a' },
      { label: 'Cinnamon',     value: '#8b5e3c' },
      { label: 'Mustard',      value: '#b5952a' },
      { label: 'Rust',         value: '#9c4b2a' },
      { label: 'Bronze',       value: '#8c6d2f' },
      { label: 'Fawn',         value: '#c07850' },
    ],
  },
  {
    key: 'nordic',
    colors: [
      { label: 'Glacier',      value: '#6b9eb2' },
      { label: 'Mist',         value: '#7a9aaa' },
      { label: 'Azure',        value: '#4a84b0' },
      { label: 'Eucalyptus',   value: '#6a9e82' },
      { label: 'Slate Blue',   value: '#6a88a0' },
      { label: 'Sea Foam',     value: '#5a9090' },
      { label: 'Heather',      value: '#7a6fa0' },
      { label: 'Frost',        value: '#6a8c88' },
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

const SECTION_KEYS: SectionKey[] = ['summary', 'experiences', 'projects', 'education', 'certifications', 'skills', 'languages', 'interests']

export default function TemplateStep() {
  const { cv, setTemplate } = useCVStore()
  const t = useTranslations('form.template')
  const template = cv.template

  const update = (patch: Partial<Template>) => setTemplate({ ...template, ...patch })

  return (
    <div className="space-y-7">

      {/* Layout */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">{t('layout')}</p>
        <div className="grid grid-cols-2 gap-3">
          <LayoutCard
            selected={template.layout === 'single'}
            onClick={() => update({ layout: 'single' })}
            label={t('singleColumn')}
            badge={t('atsFriendly')}
            preview={<SinglePreview color={template.accentColor} />}
          />
          <LayoutCard
            selected={template.layout === 'sidebar'}
            onClick={() => update({ layout: 'sidebar' })}
            label={t('twoColumns')}
            badge={t('modernDesign')}
            preview={<SidebarPreview color={template.accentColor} />}
          />
        </div>
      </div>

      {/* Accent color */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">{t('accentColor')}</p>
        <div className="space-y-3">
          {COLOR_PALETTES.map((palette) => (
            <div key={palette.key}>
              <p className="text-xs text-gray-400 mb-1.5">{t(`palettes.${palette.key}`)}</p>
              <div className="flex flex-wrap gap-2">
                {palette.colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update({ accentColor: c.value })}
                    title={c.label}
                    className="w-7 h-7 rounded-full transition-all"
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
        <p className="text-sm font-semibold text-gray-700 mb-3">{t('font')}</p>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => update({ font: f.value })}
              className={`rounded-xl border-2 px-3 py-2.5 text-left transition ${
                template.font === f.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-bold text-gray-800" style={{ fontFamily: f.family }}>{f.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{t(`fonts.${f.value}`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">{t('density')}</p>
        <div className="flex gap-3">
          {(['compact', 'normal', 'airy'] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => update({ density: val })}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition ${
                template.density === val
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t(val)}
            </button>
          ))}
        </div>
      </div>

      {/* Section visibility */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">{t('visibleSections')}</p>
        <p className="text-xs text-gray-400 mb-3">{t('sectionsHint')}</p>
        <div className="flex flex-wrap gap-2">
          {SECTION_KEYS.map((key) => {
            const isHidden = template.hiddenSections.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  const next = isHidden
                    ? template.hiddenSections.filter((k) => k !== key)
                    : [...template.hiddenSections, key]
                  update({ hiddenSections: next })
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                  isHidden ? 'border-gray-200 text-gray-400 bg-white' : 'border-indigo-300 text-indigo-600 bg-indigo-50'
                }`}
              >
                {isHidden ? '○' : '●'} {t(`sections.${key}`)}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

function LayoutCard({ selected, onClick, label, badge, preview }: {
  selected: boolean; onClick: () => void; label: string; badge: string; preview: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-3 text-left transition w-full ${
        selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="mb-2 rounded-lg overflow-hidden bg-white border border-gray-100 aspect-[3/4]">
        {preview}
      </div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      <p className="text-[10px] text-gray-400">{badge}</p>
    </button>
  )
}

function SinglePreview({ color }: { color: string }) {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1">
      <div className="h-2 w-3/4 rounded" style={{ backgroundColor: color, opacity: 0.8 }} />
      <div className="h-1 w-1/2 rounded bg-gray-200" />
      <div className="h-px w-full rounded mt-1" style={{ backgroundColor: color, opacity: 0.4 }} />
      {[0.7, 0.5, 0.6, 0.4, 0.55].map((w, i) => (
        <div key={i} className="h-1 rounded bg-gray-100" style={{ width: `${w * 100}%` }} />
      ))}
      <div className="h-px w-full rounded mt-1" style={{ backgroundColor: color, opacity: 0.4 }} />
      {[0.8, 0.5, 0.65].map((w, i) => (
        <div key={i} className="h-1 rounded bg-gray-100" style={{ width: `${w * 100}%` }} />
      ))}
    </div>
  )
}

function SidebarPreview({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex">
      <div className="w-2/5 h-full p-1.5 flex flex-col gap-1" style={{ backgroundColor: color }}>
        <div className="h-1.5 w-3/4 rounded bg-white/60" />
        <div className="h-1 w-1/2 rounded bg-white/40" />
        <div className="mt-1 h-px w-full bg-white/30" />
        {[0.8, 0.6, 0.7, 0.5].map((w, i) => (
          <div key={i} className="h-1 rounded bg-white/30" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-1">
        {[0.9, 0.6, 0.7, 0.5, 0.8, 0.4, 0.65].map((w, i) => (
          <div key={i} className="h-1 rounded bg-gray-100" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  )
}
