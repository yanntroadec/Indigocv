'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import CVCard from './CVCard'
import type { CVRecord } from '@/types/cv'

interface CVSummary {
  id: string
  name: string
  updated_at: string
  personal?: { firstName?: string; lastName?: string; jobTitle?: string } | null
  profileName?: string | null
}

export default function CVList({ initialCvs }: { initialCvs: CVSummary[] }) {
  const t = useTranslations('dashboard')
  const [cvs, setCvs] = useState<CVSummary[]>(initialCvs)
  const router = useRouter()
  const supabase = createClient()

  async function handleOpen(id: string) {
    const { data } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      useCVStore.getState().loadCV(data as CVRecord)
      router.push('/preview')
    }
  }

  async function handleDelete(id: string) {
    setCvs((prev) => prev.filter((cv) => cv.id !== id))
    const { error } = await supabase.from('cvs').delete().eq('id', id)
    if (error) setCvs(initialCvs)
  }

  async function handleRename(id: string, newName: string) {
    setCvs((prev) => prev.map((cv) => cv.id === id ? { ...cv, name: newName } : cv))
    const { error } = await supabase.from('cvs').update({ name: newName }).eq('id', id)
    if (error) {
      setCvs(initialCvs)
    } else if (useCVStore.getState().currentCvId === id) {
      useCVStore.getState().setCvName(newName)
    }
  }

  return (
    <div className="space-y-4">
      {cvs.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">{t('empty')}</p>
      ) : (
        cvs.map((cv) => (
          <CVCard
            key={cv.id}
            name={cv.name}
            updatedAt={cv.updated_at}
            personal={cv.personal}
            profileName={cv.profileName}
            onOpen={() => handleOpen(cv.id)}
            onDelete={() => handleDelete(cv.id)}
            onRename={(newName) => handleRename(cv.id, newName)}
          />
        ))
      )}
    </div>
  )
}
