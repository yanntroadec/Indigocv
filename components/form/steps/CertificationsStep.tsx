'use client'

import { useCVStore } from '@/store/cvStore'
import type { CVData } from '@/types/cv'

type Cert = CVData['certifications'][number]

const emptyCertification = (): Cert => ({ id: crypto.randomUUID(), name: '', issuer: '', year: '' })

export default function CertificationsStep() {
  const { cv, setCertifications } = useCVStore()
  const certifications = cv.certifications

  const update = (id: string, field: keyof Omit<Cert, 'id'>, value: string) =>
    setCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const add = () => setCertifications([...certifications, emptyCertification()])
  const remove = (id: string) => setCertifications(certifications.filter((c) => c.id !== id))

  return (
    <div className="space-y-4">
      {certifications.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">Aucune certification ajoutée pour l&apos;instant.</p>
      )}
      {certifications.map((cert, idx) => (
        <div key={cert.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Certification {idx + 1}</p>
            <button type="button" onClick={() => remove(cert.id)} className="text-xs text-red-400 hover:text-red-600 transition">Supprimer</button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Intitulé</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={cert.name} onChange={(e) => update(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Organisme</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={cert.issuer} onChange={(e) => update(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Année</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={cert.year} onChange={(e) => update(cert.id, 'year', e.target.value)} placeholder="2023" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition">
        + Ajouter une certification
      </button>
    </div>
  )
}
