'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CVData, CVRecord, ProfileData, ProfileRecord } from '@/types/cv'
import { createClient } from '@/lib/supabase/client'

let saveTimer: ReturnType<typeof setTimeout> | null = null

const STORE_VERSION = 2

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
    city: '', country: '',
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
  storeVersion: number
  currentCvId: string | null
  currentCvName: string | null
  currentProfileId: string | null
  currentProfileName: string | null
  isSaving: boolean
  isSavingProfile: boolean
  lastSavedAt: Date | null
  lastProfileSavedAt: Date | null
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
  loadProfile: (record: ProfileRecord) => void
  getProfileData: () => ProfileData
  saveCVToSupabase: (name?: string) => Promise<void>
  saveProfileToSupabase: (name?: string) => Promise<void>
  debouncedSave: (name?: string) => void
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cv: defaultCV,
      step: 0,
      storeVersion: STORE_VERSION,
      currentCvId: null,
      currentCvName: null,
      currentProfileId: null,
      currentProfileName: null,
      isSaving: false,
      isSavingProfile: false,
      lastSavedAt: null,
      lastProfileSavedAt: null,
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
      reset: () => set({
        cv: defaultCV, step: 0,
        currentCvId: null, currentCvName: null,
        currentProfileId: null, currentProfileName: null,
        isSaving: false, isSavingProfile: false,
        lastSavedAt: null, lastProfileSavedAt: null, saveError: null,
      }),

      loadCV: (record: CVRecord) => {
        set({
          cv: record.data,
          currentCvId: null,
          currentCvName: record.name,
          currentProfileId: record.profile_id ?? null,
          currentProfileName: null,
          step: 0,
          saveError: null,
        })
      },

      loadProfile: (record: ProfileRecord) => {
        set((s) => ({
          cv: {
            ...s.cv,
            photo: record.data.photo,
            personal: record.data.personal,
            experiences: record.data.experiences,
            education: record.data.education,
            skills: record.data.skills,
            languages: record.data.languages,
            projects: record.data.projects,
            certifications: record.data.certifications,
            interests: record.data.interests,
          },
          currentProfileId: record.id,
          currentProfileName: record.name,
        }))
      },

      getProfileData: () => {
        const { template: _, ...profileData } = get().cv
        return profileData
      },

      saveProfileToSupabase: async (name?: string) => {
        set({ isSavingProfile: true, saveError: null })

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          set({ isSavingProfile: false, saveError: 'Not authenticated' })
          return
        }

        const state = get()
        const { template: _, ...profileFields } = state.cv
        let profileData: ProfileData = { ...profileFields }

        // Upload photo to Storage if it's still a base64 string
        if (profileData.photo && profileData.photo.startsWith('data:')) {
          try {
            const base64 = profileData.photo.split(',')[1]
            const mimeMatch = profileData.photo.match(/data:([^;]+);/)
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
            const ext = mime.split('/')[1] ?? 'jpg'

            const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
            const blob = new Blob([bytes], { type: mime })

            const fileId = state.currentProfileId ?? crypto.randomUUID()
            const filePath = `${user.id}/profile-${fileId}.${ext}`

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('cv-photos')
              .upload(filePath, blob, { upsert: true, contentType: mime })

            if (!uploadError && uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('cv-photos')
                .getPublicUrl(filePath)
              profileData = { ...profileData, photo: publicUrl }
            }
          } catch (err) {
            console.error('Photo upload failed:', err)
            set({ isSavingProfile: false, saveError: 'Photo upload failed' })
            return
          }
        }

        const profileName = name ?? state.currentProfileName ?? 'Profil'

        let error: { message: string } | null = null

        if (state.currentProfileId) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ data: profileData, name: profileName })
            .eq('id', state.currentProfileId)
            .eq('user_id', user.id)

          error = updateError
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from('profiles')
            .insert({ user_id: user.id, name: profileName, data: profileData })
            .select('id')
            .single()

          error = insertError
          if (!insertError && inserted) {
            set({ currentProfileId: inserted.id, currentProfileName: profileName })
          }
        }

        if (error) {
          set({ isSavingProfile: false, saveError: error.message })
        } else {
          if (profileData.photo !== state.cv.photo) {
            set((s) => ({ cv: { ...s.cv, photo: profileData.photo } }))
          }
          set({ isSavingProfile: false, lastProfileSavedAt: new Date() })
        }
      },

      saveCVToSupabase: async (name?: string) => {
        set({ isSaving: true, saveError: null })

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          set({ isSaving: false, saveError: 'Not authenticated' })
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
          } catch (err) {
            // If photo upload fails, keep existing photo and report error
            console.error('Photo upload failed:', err)
            set({ isSaving: false, saveError: 'Photo upload failed' })
            return
          }
        }

        const cvName = name ?? state.currentCvName ?? 'CV'

        let error: { message: string } | null = null

        if (state.currentCvId) {
          // Update existing CV
          const { error: updateError } = await supabase
            .from('cvs')
            .update({ data: cvData, name: cvName, profile_id: state.currentProfileId })
            .eq('id', state.currentCvId)
            .eq('user_id', user.id)

          error = updateError
        } else {
          // Insert new CV
          const { data: inserted, error: insertError } = await supabase
            .from('cvs')
            .insert({ user_id: user.id, name: cvName, data: cvData, profile_id: state.currentProfileId })
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
      debouncedSave: (name?: string) => {
        if (saveTimer) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          get().saveCVToSupabase(name)
        }, 1000)
      },
    }),
    {
      name: 'indigocv-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        cv: state.cv,
        step: state.step,
        storeVersion: state.storeVersion,
        currentCvId: state.currentCvId,
        currentCvName: state.currentCvName,
        currentProfileId: state.currentProfileId,
        currentProfileName: state.currentProfileName,
      }),
      merge: (persisted, current) => {
        const persistedStore = persisted as Partial<CVStore>
        const persistedCV = (persistedStore.cv ?? {}) as Partial<CVData>

        // Reset step if store version changed (e.g. TemplateStep removed)
        const step = (persistedStore.storeVersion ?? 1) < STORE_VERSION ? 0 : (persistedStore.step ?? 0)

        // Migrate languages: add id if missing (old sessionStorage format)
        const languages = (persistedCV.languages ?? []).map((lang: CVData['languages'][number] & { id?: string }) =>
          lang.id ? lang : { ...lang, id: crypto.randomUUID() }
        )

        // Migrate skills: convert old string[] format to { name, level }[]
        const skills = (persistedCV.skills ?? []).map((s: string | { name: string; level: number }) =>
          typeof s === 'string' ? { name: s, level: 3 } : s
        ).filter((s): s is { name: string; level: number } => typeof s === 'object' && s !== null && typeof s.name === 'string')

        return {
          ...current,
          ...persistedStore,
          step,
          storeVersion: STORE_VERSION,
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
