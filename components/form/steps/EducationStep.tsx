'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData } from '@/types/cv'
import { YEARS } from '@/lib/constants'

type Education = CVData['education'][number]

function emptyEdu(): Education {
  return { id: crypto.randomUUID(), school: '', degree: '', field: '', year: '' }
}

export default function EducationStep() {
  const { cv, setEducation } = useCVStore()
  const t = useTranslations('form.education')
  const education = cv.education

  const add = () => setEducation([...education, emptyEdu()])
  const remove = (id: string) => setEducation(education.filter((e) => e.id !== id))
  const update = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  return (
    <div className="space-y-6">
      {education.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">{t('empty')}</p>
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-600">{t('itemLabel', { index: index + 1 })}</span>
            <button type="button" onClick={() => remove(edu.id)} className="text-xs text-red-500 hover:text-red-700 transition">
              {t('remove')}
            </button>
          </div>

          <Field label={t('school')} value={edu.school} onChange={(v) => update(edu.id, 'school', v)} placeholder={t('schoolPlaceholder')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t('degree')} value={edu.degree} onChange={(v) => update(edu.id, 'degree', v)} placeholder={t('degreePlaceholder')} />
            <Field label={t('field')} value={edu.field} onChange={(v) => update(edu.id, 'field', v)} placeholder={t('fieldPlaceholder')} />
          </div>

          <YearSelector label={t('year')} value={edu.year} onChange={(v) => update(edu.id, 'year', v)} />
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

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function YearSelector({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  const t = useTranslations('form.education')

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10"
        style={{ color: value ? '#111827' : '#9ca3af' }}
      >
        <option value="">{t('yearSelectPlaceholder')}</option>
        {YEARS.map((year) => (
          <option key={year} value={year.toString()}>{year}</option>
        ))}
      </select>
    </div>
  )
}
