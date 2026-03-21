'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData } from '@/types/cv'

type Language = CVData['languages'][number]

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']

function emptyLang(): Language {
  return { id: crypto.randomUUID(), name: '', level: '' }
}

export default function LanguagesStep() {
  const { cv, setLanguages } = useCVStore()
  const t = useTranslations('form.languages')
  const languages = cv.languages

  const add = () => setLanguages([...languages, emptyLang()])
  const remove = (id: string) => setLanguages(languages.filter((l) => l.id !== id))
  const update = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  return (
    <div className="space-y-4">
      {languages.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">{t('empty')}</p>
      )}

      {languages.map((lang) => (
        <div key={lang.id} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label')}</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={lang.name}
              onChange={(e) => update(lang.id, 'name', e.target.value)}
              placeholder={t('labelPlaceholder')}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('level')}</label>
            <input
              type="text"
              list={`levels-${lang.id}`}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              value={lang.level}
              onChange={(e) => update(lang.id, 'level', e.target.value)}
              placeholder={t('levelPlaceholder')}
            />
            <datalist id={`levels-${lang.id}`}>
              {LEVELS.map((level) => <option key={level} value={level} />)}
            </datalist>
          </div>

          <button type="button" onClick={() => remove(lang.id)} className="pb-2 text-sm text-red-500 hover:text-red-700 transition whitespace-nowrap">
            {t('remove')}
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium"
      >
        {t('add')}
      </button>
    </div>
  )
}
