'use client'

import { useCVStore } from '@/store/cvStore'
import type { CVData } from '@/types/cv'

type Language = CVData['languages'][number]

const LEVELS = [
  'Notions',
  'Intermédiaire',
  'Courant',
  'Bilingue',
  'Langue maternelle',
]

function emptyLang(): Language {
  return { id: crypto.randomUUID(), name: '', level: 'Courant' }
}

export default function LanguagesStep() {
  const { cv, setLanguages } = useCVStore()
  const languages = cv.languages

  const add = () => setLanguages([...languages, emptyLang()])
  const remove = (id: string) =>
    setLanguages(languages.filter((l) => l.id !== id))
  const update = (id: string, field: keyof Language, value: string) => {
    setLanguages(
      languages.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  return (
    <div className="space-y-4">
      {languages.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucune langue ajoutée. Cliquez sur le bouton ci-dessous pour en ajouter une.
        </p>
      )}

      {languages.map((lang) => (
        <div key={lang.id} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={lang.name}
              onChange={(e) => update(lang.id, 'name', e.target.value)}
              placeholder="Français, Anglais..."
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              value={lang.level}
              onChange={(e) => update(lang.id, 'level', e.target.value)}
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => remove(lang.id)}
            className="pb-2 text-sm text-red-500 hover:text-red-700 transition whitespace-nowrap"
          >
            Supprimer
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium"
      >
        + Ajouter une langue
      </button>
    </div>
  )
}
