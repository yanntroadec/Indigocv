'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData } from '@/types/cv'
import PhoneField from '@/components/form/PhoneField'

export default function PersonalStep() {
  const { cv, setPersonal } = useCVStore()
  const t = useTranslations('form.personal')
  const personal = cv.personal

  const update = (field: keyof CVData['personal'], value: string) => {
    // Capitalize first letter for firstName and lastName
    if ((field === 'firstName' || field === 'lastName') && value) {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }
    setPersonal({ ...personal, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('firstName')} value={personal.firstName} onChange={(v) => update('firstName', v)} placeholder={t('firstNamePlaceholder')} />
        <Field label={t('lastName')} value={personal.lastName} onChange={(v) => update('lastName', v)} placeholder={t('lastNamePlaceholder')} />
      </div>
      <Field label={t('jobTitle')} value={personal.jobTitle} onChange={(v) => update('jobTitle', v)} placeholder={t('jobTitlePlaceholder')} />
      <Field label={t('email')} type="email" value={personal.email} onChange={(v) => update('email', v)} placeholder={t('emailPlaceholder')} invalidMessage={t('invalidEmail')} />
      <PhoneField label={t('phone')} value={personal.phone} onChange={(v) => update('phone', v)} placeholder={t('phonePlaceholder')} invalidMessage={t('invalidPhone')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('city')} value={personal.city} onChange={(v) => update('city', v)} placeholder={t('cityPlaceholder')} />
        <Field label={t('country')} value={personal.country} onChange={(v) => update('country', v)} placeholder={t('countryPlaceholder')} />
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">{t('onlinePresence')}</p>
      <Field label={t('linkedin')} value={personal.linkedin} onChange={(v) => update('linkedin', v)} placeholder={t('linkedinPlaceholder')} />
      <Field label={t('github')} value={personal.github} onChange={(v) => update('github', v)} placeholder={t('githubPlaceholder')} />
      <Field label={t('portfolio')} value={personal.portfolio} onChange={(v) => update('portfolio', v)} placeholder={t('portfolioPlaceholder')} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('summary')}</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          rows={4}
          value={personal.summary}
          onChange={(e) => update('summary', e.target.value)}
          placeholder={t('summaryPlaceholder')}
        />
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', invalidMessage,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; invalidMessage?: string
}) {
  const isInvalid = type === 'email' && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10 ${
          isInvalid ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {isInvalid && invalidMessage && <p className="text-xs text-red-500 mt-1">{invalidMessage}</p>}
    </div>
  )
}
