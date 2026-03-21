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
      router.push('/create')
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

  function handleNewCV() {
    useCVStore.getState().reset()
    router.push('/create')
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleNewCV}
        className="w-full bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-white/90 transition p-5 text-center group"
      >
        <span className="text-2xl">+</span>
        <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 mt-1 transition">
          {t('newCV')}
        </p>
      </button>

      {cvs.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">{t('empty')}</p>
      ) : (
        cvs.map((cv) => (
          <CVCard
            key={cv.id}
            id={cv.id}
            name={cv.name}
            updatedAt={cv.updated_at}
            personal={cv.personal}
            onOpen={() => handleOpen(cv.id)}
            onDelete={() => handleDelete(cv.id)}
            onRename={(newName) => handleRename(cv.id, newName)}
          />
        ))
      )}
    </div>
  )
}
