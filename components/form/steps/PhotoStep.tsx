'use client'

import { useRef, useState } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function PhotoStep() {
  const { cv, setPhoto } = useCVStore()
  const t = useTranslations('form.photo')
  const photo = cv.photo
  const layout = cv.template.layout
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError(t('errorType'))
      return
    }
    if (file.size > MAX_SIZE) {
      setError(t('errorSize'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') setPhoto(result)
    }
    reader.readAsDataURL(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  if (layout === 'single') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <div>
          <p className="font-semibold text-gray-700">{t('atsWarning')}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">{t('atsDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {photo ? (
        <div className="relative">
          <img src={photo} alt={t('altText')} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
          <button
            type="button"
            onClick={() => setPhoto(null)}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition shadow"
            aria-label={t('removeAria')}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-3xl">
          👤
        </div>
      )}

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
      >
        <p className="text-sm font-medium text-gray-600">{t('dropzone')}</p>
        <p className="text-xs text-gray-400 mt-1">{t('dropzoneHint')}</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
      </div>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      {photo && !error && <p className="text-xs text-gray-400">{t('caption')}</p>}
    </div>
  )
}
