'use client'

import { useCVStore } from '@/store/cvStore'
import type { CVData } from '@/types/cv'

type Project = CVData['projects'][number]

const emptyProject = (): Project => ({ id: crypto.randomUUID(), name: '', description: '', url: '', year: '' })

export default function ProjectsStep() {
  const { cv, setProjects } = useCVStore()
  const projects = cv.projects

  const update = (id: string, field: keyof Omit<Project, 'id'>, value: string) =>
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

  const add = () => setProjects([...projects, emptyProject()])
  const remove = (id: string) => setProjects(projects.filter((p) => p.id !== id))

  return (
    <div className="space-y-4">
      {projects.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">Aucun projet ajouté pour l&apos;instant.</p>
      )}
      {projects.map((proj, idx) => (
        <div key={proj.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Projet {idx + 1}</p>
            <button type="button" onClick={() => remove(proj.id)} className="text-xs text-red-400 hover:text-red-600 transition">Supprimer</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom du projet</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={proj.name} onChange={(e) => update(proj.id, 'name', e.target.value)} placeholder="Portfolio personnel" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Année</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={proj.year} onChange={(e) => update(proj.id, 'year', e.target.value)} placeholder="2024" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Lien (optionnel)</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" value={proj.url} onChange={(e) => update(proj.id, 'url', e.target.value)} placeholder="github.com/user/projet" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" rows={2} value={proj.description} onChange={(e) => update(proj.id, 'description', e.target.value)} placeholder="Brève description du projet..." />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition">
        + Ajouter un projet
      </button>
    </div>
  )
}
