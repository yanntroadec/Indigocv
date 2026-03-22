'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import ProfileCard from './ProfileCard'
import type { ProfileRecord } from '@/types/cv'

interface ProfileSummary {
  id: string
  name: string
  updated_at: string
  personal?: { firstName?: string; lastName?: string; jobTitle?: string } | null
}

export default function ProfileList({ initialProfiles }: { initialProfiles: ProfileSummary[] }) {
  const t = useTranslations('dashboard')
  const [profiles, setProfiles] = useState<ProfileSummary[]>(initialProfiles)
  const router = useRouter()
  const supabase = createClient()

  async function handleEdit(id: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      const store = useCVStore.getState()
      store.reset()
      store.loadProfile(data as ProfileRecord)
      router.push('/create')
    }
  }

  async function handleUseForCV(id: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      const store = useCVStore.getState()
      store.reset()
      store.loadProfile(data as ProfileRecord)
      router.push('/preview')
    }
  }

  async function handleDelete(id: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) setProfiles(initialProfiles)
  }

  async function handleRename(id: string, newName: string) {
    setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, name: newName } : p))
    const { error } = await supabase.from('profiles').update({ name: newName }).eq('id', id)
    if (error) setProfiles(initialProfiles)
  }

  function handleNewProfile() {
    useCVStore.getState().reset()
    router.push('/create')
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleNewProfile}
        className="w-full bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-white/90 transition p-5 text-center group"
      >
        <span className="text-2xl">+</span>
        <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 mt-1 transition">
          {t('newProfile')}
        </p>
      </button>

      {profiles.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">{t('emptyProfiles')}</p>
      ) : (
        profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            updatedAt={profile.updated_at}
            personal={profile.personal}
            onEdit={() => handleEdit(profile.id)}
            onUseForCV={() => handleUseForCV(profile.id)}
            onDelete={() => handleDelete(profile.id)}
            onRename={(newName) => handleRename(profile.id, newName)}
          />
        ))
      )}
    </div>
  )
}
