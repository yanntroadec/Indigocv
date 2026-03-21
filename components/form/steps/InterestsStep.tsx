'use client'

import { useState, type KeyboardEvent } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'

export default function InterestsStep() {
  const { cv, setInterests } = useCVStore()
  const t = useTranslations('form.interests')
  const interests = cv.interests
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed])
    }
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  const remove = (v: string) => setInterests(interests.filter((i) => i !== v))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('label')}</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('placeholder')}
          />
          <button type="button" onClick={add} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
            {t('addButton')}
          </button>
        </div>
      </div>
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span key={interest} className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700 border border-purple-200">
              {interest}
              <button type="button" onClick={() => remove(interest)} className="text-purple-400 hover:text-purple-700 leading-none" aria-label={t('removeAriaLabel', { interest })}>×</button>
            </span>
          ))}
        </div>
      )}
      {interests.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">{t('empty')}</p>
      )}
    </div>
  )
}
