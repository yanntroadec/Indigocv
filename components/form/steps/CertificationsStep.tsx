'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData } from '@/types/cv'
import { YEARS } from '@/lib/constants'

type Cert = CVData['certifications'][number]

const emptyCertification = (): Cert => ({ id: crypto.randomUUID(), name: '', issuer: '', year: '' })

export default function CertificationsStep() {
  const { cv, setCertifications } = useCVStore()
  const t = useTranslations('form.certifications')
  const certifications = cv.certifications

  const update = (id: string, field: keyof Omit<Cert, 'id'>, value: string) =>
    setCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  const add = () => setCertifications([...certifications, emptyCertification()])
  const remove = (id: string) => setCertifications(certifications.filter((c) => c.id !== id))

  return (
    <div className="space-y-4">
      {certifications.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">{t('empty')}</p>
      )}
      {certifications.map((cert, idx) => (
        <div key={cert.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">{t('itemLabel', { index: idx + 1 })}</p>
            <button type="button" onClick={() => remove(cert.id)} className="text-xs text-red-400 hover:text-red-600 transition">{t('remove')}</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10" value={cert.name} onChange={(e) => update(cert.id, 'name', e.target.value)} placeholder={t('namePlaceholder')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('issuer')}</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-10" value={cert.issuer} onChange={(e) => update(cert.id, 'issuer', e.target.value)} placeholder={t('issuerPlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('year')}</label>
              <select value={cert.year} onChange={(e) => update(cert.id, 'year', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-10" style={{ color: cert.year ? '#111827' : '#9ca3af' }}>
                <option value="">{t('yearSelectPlaceholder')}</option>
                {YEARS.map((year) => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium">
        {t('add')}
      </button>
    </div>
  )
}
