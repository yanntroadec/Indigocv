'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CVData, CVRecord } from '@/types/cv'
import { createClient } from '@/lib/supabase/client'

const defaultCV: CVData = {
  template: {
    layout: 'single',
    accentColor: '#5b7fa6',
    dividerColor: '#E2E8F0',
    font: 'Helvetica',
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
  currentCvId: string | null
  currentCvName: string | null
  isSaving: boolean
  lastSavedAt: Date | null
  saveError: string | null
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
  setCvName: (name: string) => void
  reset: () => void
  loadCV: (record: CVRecord) => void
  saveCVToSupabase: (name?: string) => Promise<void>
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cv: defaultCV,
      step: 0,
      currentCvId: null,
      currentCvName: null,
      isSaving: false,
      lastSavedAt: null,
      saveError: null,
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
      setCvName: (name) => set({ currentCvName: name }),
      reset: () => set({ cv: defaultCV, step: 0, currentCvId: null, currentCvName: null, isSaving: false, lastSavedAt: null, saveError: null }),

      loadCV: (record: CVRecord) => {
        set({ cv: record.data, currentCvId: record.id, currentCvName: record.name, step: 0, saveError: null })
      },

      saveCVToSupabase: async (name?: string) => {
        set({ isSaving: true, saveError: null })

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          set({ isSaving: false, saveError: 'Non connecté' })
          return
        }

        const state = get()
        let cvData = { ...state.cv }

        // Upload photo to Storage if it's still a base64 string
        if (cvData.photo && cvData.photo.startsWith('data:')) {
          try {
            const base64 = cvData.photo.split(',')[1]
            const mimeMatch = cvData.photo.match(/data:([^;]+);/)
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
            const ext = mime.split('/')[1] ?? 'jpg'

            const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
            const blob = new Blob([bytes], { type: mime })

            // Generate a stable filename: use existing cvId or a temp uuid
            const fileId = state.currentCvId ?? crypto.randomUUID()
            const filePath = `${user.id}/${fileId}.${ext}`

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('cv-photos')
              .upload(filePath, blob, { upsert: true, contentType: mime })

            if (!uploadError && uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('cv-photos')
                .getPublicUrl(filePath)
              cvData = { ...cvData, photo: publicUrl }
            }
          } catch {
            // If photo upload fails, continue without photo rather than blocking save
            cvData = { ...cvData, photo: null }
          }
        }

        const cvName = name ?? state.currentCvName ?? 'CV'

        let error: { message: string } | null = null

        if (state.currentCvId) {
          // Update existing CV
          const { error: updateError } = await supabase
            .from('cvs')
            .update({ data: cvData, name: cvName })
            .eq('id', state.currentCvId)
            .eq('user_id', user.id)

          error = updateError
        } else {
          // Insert new CV
          const { data: inserted, error: insertError } = await supabase
            .from('cvs')
            .insert({ user_id: user.id, name: cvName, data: cvData })
            .select('id')
            .single()

          error = insertError
          if (!insertError && inserted) {
            set({ currentCvId: inserted.id, currentCvName: cvName })
          }
        }

        if (error) {
          set({ isSaving: false, saveError: error.message })
        } else {
          // Update local store with the photo URL if it changed
          if (cvData.photo !== state.cv.photo) {
            set((s) => ({ cv: { ...s.cv, photo: cvData.photo } }))
          }
          set({ isSaving: false, lastSavedAt: new Date() })
        }
      },
    }),
    {
      name: 'indigocv-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        cv: state.cv,
        step: state.step,
        currentCvId: state.currentCvId,
        currentCvName: state.currentCvName,
      }),
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
