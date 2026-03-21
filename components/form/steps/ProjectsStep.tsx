'use client'

import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import type { CVData } from '@/types/cv'
import { YEARS } from '@/lib/constants'

type Project = CVData['projects'][number]

const emptyProject = (): Project => ({ id: crypto.randomUUID(), name: '', description: '', url: '', year: '' })

export default function ProjectsStep() {
  const { cv, setProjects } = useCVStore()
  const t = useTranslations('form.projects')
  const projects = cv.projects

  const update = (id: string, field: keyof Omit<Project, 'id'>, value: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }
  const add = () => setProjects([...projects, emptyProject()])
  const remove = (id: string) => setProjects(projects.filter((p) => p.id !== id))

  return (
    <div className="space-y-4">
      {projects.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">{t('empty')}</p>
      )}
      {projects.map((proj, idx) => (
        <div key={proj.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">{t('itemLabel', { index: idx + 1 })}</p>
            <button type="button" onClick={() => remove(proj.id)} className="text-xs text-red-500 hover:text-red-700 transition">{t('remove')}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10" value={proj.name} onChange={(e) => update(proj.id, 'name', e.target.value)} placeholder={t('namePlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('year')}</label>
              <select value={proj.year} onChange={(e) => update(proj.id, 'year', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-10" style={{ color: proj.year ? '#111827' : '#9ca3af' }}>
                <option value="">{t('yearSelectPlaceholder')}</option>
                {YEARS.map((year) => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('url')}</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-10" value={proj.url} onChange={(e) => update(proj.id, 'url', e.target.value)} placeholder={t('urlPlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none" rows={2} value={proj.description} onChange={(e) => update(proj.id, 'description', e.target.value)} placeholder={t('descriptionPlaceholder')} />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium">
        {t('add')}
      </button>
    </div>
  )
}
