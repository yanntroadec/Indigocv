'use client'

import { useCVStore } from '@/store/cvStore'
import type { CVData } from '@/types/cv'

type Template = CVData['template']

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
      { label: 'Saphir',      value: '#1e4d8c' },
      { label: 'Émeraude',    value: '#1a6b4a' },
      { label: 'Bordeaux',    value: '#722f37' },
      { label: 'Prune',       value: '#5c2d6e' },
      { label: 'Pétrole',     value: '#1a5276' },
      { label: 'Brique',      value: '#8b3a2a' },
      { label: 'Forêt',       value: '#2d5a27' },
      { label: 'Anthracite',  value: '#2c3e50' },
    ],
  },
  {
    label: 'Terre',
    colors: [
      { label: 'Terracotta',  value: '#c4622d' },
      { label: 'Ocre',        value: '#c8923a' },
      { label: 'Sable doré',  value: '#b5956a' },
      { label: 'Cannelle',    value: '#8b5e3c' },
      { label: 'Moutarde',    value: '#b5952a' },
      { label: 'Rouille',     value: '#9c4b2a' },
      { label: 'Bronze',      value: '#8c6d2f' },
      { label: 'Fauve',       value: '#c07850' },
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

const FONTS: { label: string; value: Template['font']; description: string; family: string }[] = [
  { label: 'Helvetica',        value: 'Helvetica',        description: 'Moderne et épuré',      family: 'Arial, sans-serif' },
  { label: 'Times',            value: 'Times-Roman',      description: 'Classique et formel',   family: 'Georgia, serif' },
  { label: 'Roboto',           value: 'Roboto',           description: 'Lisible et neutre',     family: 'Roboto, Arial, sans-serif' },
  { label: 'Lato',             value: 'Lato',             description: 'Doux et humaniste',     family: 'Lato, Arial, sans-serif' },
  { label: 'Montserrat',       value: 'Montserrat',       description: 'Géométrique et actuel', family: 'Montserrat, Arial, sans-serif' },
  { label: 'Raleway',          value: 'Raleway',          description: 'Élégant et aérien',     family: 'Raleway, Arial, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display', description: 'Littéraire et raffiné', family: '"Playfair Display", Georgia, serif' },
  { label: 'Merriweather',     value: 'Merriweather',     description: 'Chaleureux et sérieux', family: 'Merriweather, Georgia, serif' },
]

export default function TemplateStep() {
  const { cv, setTemplate } = useCVStore()
  const template = cv.template

  const update = (patch: Partial<Template>) => setTemplate({ ...template, ...patch })

  return (
    <div className="space-y-7">

      {/* Layout */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Mise en page</p>
        <div className="grid grid-cols-2 gap-3">
          <LayoutCard
            selected={template.layout === 'single'}
            onClick={() => update({ layout: 'single' })}
            label="Une colonne"
            badge="ATS-friendly"
            preview={<SinglePreview color={template.accentColor} />}
          />
          <LayoutCard
            selected={template.layout === 'sidebar'}
            onClick={() => update({ layout: 'sidebar' })}
            label="Deux colonnes"
            badge="Design moderne"
            preview={<SidebarPreview color={template.accentColor} />}
          />
        </div>
      </div>

      {/* Accent color — grouped palettes */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Couleur d'accentuation</p>
        <div className="space-y-3">
          {COLOR_PALETTES.map((palette) => (
            <div key={palette.label}>
              <p className="text-xs text-gray-400 mb-1.5">{palette.label}</p>
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
        <p className="text-sm font-semibold text-gray-700 mb-3">Police</p>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => update({ font: f.value })}
              className={`rounded-xl border-2 px-3 py-2.5 text-left transition ${
                template.font === f.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-bold text-gray-800" style={{ fontFamily: f.family }}>{f.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{f.description}</p>
            </button>
          ))}
        </div>
      </div>


      {/* Max pages */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Nombre de pages maximum</p>
        <div className="flex gap-3">
          {([1, 2] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ maxPages: n })}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition ${
                template.maxPages === n
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {n} page{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Densité du contenu</p>
        <div className="flex gap-3">
          {([
            { value: 'compact', label: 'Compact' },
            { value: 'normal',  label: 'Normal' },
            { value: 'airy',    label: 'Aéré' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ density: opt.value })}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition ${
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

      {/* Section visibility */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">Sections visibles</p>
        <p className="text-xs text-gray-400 mb-3">Désactivez les sections que vous ne souhaitez pas afficher.</p>
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'summary',        label: 'Profil' },
            { key: 'experiences',   label: 'Expériences' },
            { key: 'projects',      label: 'Projets' },
            { key: 'education',     label: 'Formation' },
            { key: 'certifications',label: 'Certifications' },
            { key: 'skills',        label: 'Compétences' },
            { key: 'languages',     label: 'Langues' },
            { key: 'interests',     label: 'Centres d\'intérêt' },
          ] as const).map((sec) => {
            const isHidden = template.hiddenSections.includes(sec.key)
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => {
                  const next = isHidden
                    ? template.hiddenSections.filter((k) => k !== sec.key)
                    : [...template.hiddenSections, sec.key]
                  update({ hiddenSections: next })
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
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
