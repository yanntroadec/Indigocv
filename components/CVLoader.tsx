'use client'

import { useEffect } from 'react'
import { useCVStore } from '@/store/cvStore'
import type { CVRecord } from '@/types/cv'

export default function CVLoader({ initialRecord }: { initialRecord: CVRecord | null }) {
  const loadCV = useCVStore((s) => s.loadCV)

  useEffect(() => {
    if (initialRecord) {
      loadCV(initialRecord)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecord?.id])

  return null
}
