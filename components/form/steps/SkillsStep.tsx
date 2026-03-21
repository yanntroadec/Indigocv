'use client'

import { useState, type KeyboardEvent } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'

function LevelDots({ level, onChange }: { level: number; onChange: (l: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(level === i ? i - 1 : i)}
          className="w-2.5 h-2.5 rounded-full transition-colors focus:outline-none"
          style={{ backgroundColor: i <= level ? '#4f46e5' : '#e0e7ff' }}
          aria-label={`${i}/5`}
          title={`${i}/5`}
        />
      ))}
    </div>
  )
}

export default function SkillsStep() {
  const { cv, setSkills } = useCVStore()
  const t = useTranslations('form.skills')
  const skills = cv.skills
    .map((s: string | { name: string; level: number }) => (typeof s === 'string' ? { name: s, level: 3 } : s))
    .filter((s): s is { name: string; level: number } =>
      typeof s === 'object' && s !== null && typeof s.name === 'string' && typeof s.level === 'number'
    )
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !skills.find((s) => s.name === trimmed)) {
      setSkills([...skills, { name: trimmed, level: 3 }])
    }
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  const remove = (name: string) => setSkills(skills.filter((s) => s.name !== name))
  const setLevel = (name: string, level: number) =>
    setSkills(skills.map((s) => (s.name === name ? { ...s, level } : s)))

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
        <p className="text-xs text-gray-400 mt-1">{t('hint')}</p>
      </div>

      {skills.length > 0 && (
        <div className="space-y-2">
          {skills.map((skill, i) => (
            <div key={skill.name || i} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-800 flex-1">{skill.name}</span>
              <div className="flex items-center gap-3">
                <LevelDots level={skill.level} onChange={(l) => setLevel(skill.name, l)} />
                <button
                  type="button"
                  onClick={() => remove(skill.name)}
                  className="text-gray-300 hover:text-red-400 transition text-base leading-none ml-1"
                  aria-label={t('removeAriaLabel', { skill: skill.name })}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400">{t('levelHint')}</p>
        </div>
      )}

      {skills.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">{t('empty')}</p>
      )}
    </div>
  )
}
