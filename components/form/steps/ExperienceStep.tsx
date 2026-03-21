'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations, useLocale } from 'next-intl'
import type { CVData } from '@/types/cv'
import { YEARS, MONTHS } from '@/lib/constants'

type Experience = CVData['experiences'][number]

function emptyExp(): Experience {
  return { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' }
}

export default function ExperienceStep() {
  const { cv, setExperiences } = useCVStore()
  const t = useTranslations('form.experience')
  const experiences = cv.experiences

  const add = () => setExperiences([...experiences, emptyExp()])
  const remove = (id: string) => setExperiences(experiences.filter((e) => e.id !== id))
  const update = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  return (
    <div className="space-y-6">
      {experiences.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">{t('empty')}</p>
      )}

      {experiences.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-600">{t('itemLabel', { index: index + 1 })}</span>
            <button type="button" onClick={() => remove(exp.id)} className="text-xs text-red-500 hover:text-red-700 transition">
              {t('remove')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t('role')} value={exp.role} onChange={(v) => update(exp.id, 'role', v)} placeholder={t('rolePlaceholder')} />
            <Field label={t('company')} value={exp.company} onChange={(v) => update(exp.id, 'company', v)} placeholder={t('companyPlaceholder')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DateSelector label={t('startDate')} value={exp.startDate} onChange={(v) => update(exp.id, 'startDate', v)} />
            <div>
              <DateSelector label={t('endDate')} value={exp.endDate} onChange={(v) => update(exp.id, 'endDate', v)} disabled={exp.current} />
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input type="checkbox" checked={exp.current} onChange={(e) => update(exp.id, 'current', e.target.checked)} className="rounded" />
                <span className="text-xs text-gray-600">{t('current')}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              rows={3}
              value={exp.description}
              onChange={(e) => update(exp.id, 'description', e.target.value)}
              placeholder={t('descriptionPlaceholder')}
            />
          </div>
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

function Field({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

function DateSelector({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations('form.experience')
  const months = MONTHS[locale as keyof typeof MONTHS] || MONTHS.en

  // Parse "Month Year" format — value is either "", "Year", or "Month Year"
  const allMonths = Object.values(MONTHS).flat()
  const parts = value.split(' ')
  const firstIsMonth = allMonths.includes(parts[0])
  const selectedMonth = firstIsMonth ? parts[0] : ''
  const selectedYear = firstIsMonth ? (parts[1] || '') : (parts[0] || '')

  const handleMonthChange = (month: string) => {
    onChange(month ? `${month} ${selectedYear}` : selectedYear)
  }

  const handleYearChange = (year: string) => {
    onChange(selectedMonth ? `${selectedMonth} ${year}` : year)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 h-10"
          style={{ color: selectedMonth ? '#111827' : '#9ca3af', borderRadius: '0.5rem' }}
        >
          <option value="">{t('monthPlaceholder')}</option>
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 h-10"
          style={{ color: selectedYear ? '#111827' : '#9ca3af', borderRadius: '0.5rem' }}
        >
          <option value="">{t('yearPlaceholder')}</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
