'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CVData } from '@/types/cv'

const defaultCV: CVData = {
  template: {
    layout: 'single',
    accentColor: '#5b7fa6',
    font: 'Helvetica',
    maxPages: 1,
    density: 'normal',
    hiddenSections: [],
  },
  photo: null,
  personal: {
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', postalCode: '', country: '',
    jobTitle: '', summary: '', linkedin: '', github: '', portfolio: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  interests: [],
}

interface CVStore {
  cv: CVData
  step: number
  setTemplate: (template: CVData['template']) => void
  setPhoto: (photo: string | null) => void
  setPersonal: (personal: CVData['personal']) => void
  setExperiences: (experiences: CVData['experiences']) => void
  setEducation: (education: CVData['education']) => void
  setSkills: (skills: CVData['skills']) => void
  setLanguages: (languages: CVData['languages']) => void
  setProjects: (projects: CVData['projects']) => void
  setCertifications: (certifications: CVData['certifications']) => void
  setInterests: (interests: CVData['interests']) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: defaultCV,
      step: 0,
      setTemplate: (template) => set((s) => ({ cv: { ...s.cv, template } })),
      setPhoto: (photo) => set((s) => ({ cv: { ...s.cv, photo } })),
      setPersonal: (personal) => set((s) => ({ cv: { ...s.cv, personal } })),
      setExperiences: (experiences) => set((s) => ({ cv: { ...s.cv, experiences } })),
      setEducation: (education) => set((s) => ({ cv: { ...s.cv, education } })),
      setSkills: (skills) => set((s) => ({ cv: { ...s.cv, skills } })),
      setLanguages: (languages) => set((s) => ({ cv: { ...s.cv, languages } })),
      setProjects: (projects) => set((s) => ({ cv: { ...s.cv, projects } })),
      setCertifications: (certifications) => set((s) => ({ cv: { ...s.cv, certifications } })),
      setInterests: (interests) => set((s) => ({ cv: { ...s.cv, interests } })),
      setStep: (step) => set({ step }),
      reset: () => set({ cv: defaultCV, step: 0 }),
    }),
    {
      name: 'indigocv-store',
      storage: createJSONStorage(() => sessionStorage),
      merge: (persisted, current) => {
        const persistedStore = persisted as Partial<CVStore>
        const persistedCV = (persistedStore.cv ?? {}) as Partial<CVData>

        // Migrate languages: add id if missing (old sessionStorage format)
        const languages = (persistedCV.languages ?? []).map((lang: any) =>
          lang.id ? lang : { ...lang, id: crypto.randomUUID() }
        )

        // Migrate skills: convert old string[] format to { name, level }[]
        const skills = (persistedCV.skills ?? []).map((s: any) =>
          typeof s === 'string' ? { name: s, level: 3 } : s
        ).filter((s: any) => typeof s === 'object' && s !== null && typeof s.name === 'string')

        return {
          ...current,
          ...persistedStore,
          cv: {
            ...current.cv,
            ...persistedCV,
            template: {
              ...current.cv.template,
              ...(persistedCV.template ?? {}),
            },
            personal: {
              ...current.cv.personal,
              ...(persistedCV.personal ?? {}),
            },
            languages,
            skills,
          },
        }
      },
    }
  )
)
