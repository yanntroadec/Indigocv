'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations, useLocale } from 'next-intl'
import type { CVData } from '@/types/cv'
import { LANGUAGE_LEVELS } from '@/lib/constants'

type Language = CVData['languages'][number]

function emptyLang(): Language {
  return { id: crypto.randomUUID(), name: '', level: '' }
}

export default function LanguagesStep() {
  const { cv, setLanguages } = useCVStore()
  const t = useTranslations('form.languages')
  const locale = useLocale()
  const languages = cv.languages
  const levelOptions = LANGUAGE_LEVELS[locale as keyof typeof LANGUAGE_LEVELS] || LANGUAGE_LEVELS.en

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
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10"
                value={lang.name}
                onChange={(e) => update(lang.id, 'name', e.target.value)}
                placeholder={t('labelPlaceholder')}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('level')}</label>
              <select
                value={lang.level}
                onChange={(e) => update(lang.id, 'level', e.target.value)}
                className="w-full appearance-none border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10"
                style={{ borderRadius: '0.5rem', color: lang.level ? '#111827' : '#9ca3af', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
              >
                <option value="">{t('levelPlaceholder')}</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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
