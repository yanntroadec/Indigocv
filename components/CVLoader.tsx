'use client'

import { useEffect, useRef } from 'react'
import { useCVStore } from '@/store/cvStore'
import type { CVRecord } from '@/types/cv'

export default function CVLoader({ initialRecord }: { initialRecord: CVRecord | null }) {
  const loadCV = useCVStore((s) => s.loadCV)
  const loadedId = useRef<string | null>(null)

  useEffect(() => {
    if (initialRecord && initialRecord.id !== loadedId.current) {
      try {
        loadCV(initialRecord)
        loadedId.current = initialRecord.id
      } catch (err) {
        console.error('Failed to load CV:', err)
      }
    }
  }, [initialRecord, loadCV])

  return null
}
