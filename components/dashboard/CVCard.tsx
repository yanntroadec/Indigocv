'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface CVCardProps {
  name: string
  updatedAt: string
  personal?: { firstName?: string; lastName?: string; jobTitle?: string } | null
  onOpen: () => void
  onDelete: () => void
  onRename: (newName: string) => void
}

export default function CVCard({ name, updatedAt, personal, onOpen, onDelete, onRename }: CVCardProps) {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) onRename(trimmed)
    setEditing(false)
  }

  const displayName = personal?.firstName || personal?.lastName
    ? `${personal.firstName ?? ''} ${personal.lastName ?? ''}`.trim()
    : null

  const date = new Date(updatedAt).toLocaleDateString(locale, {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        {editing ? (
          <form onSubmit={handleRenameSubmit} className="flex gap-2">
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleRenameSubmit}
              className="flex-1 rounded-lg border-2 border-indigo-300 px-2 py-1 text-sm font-medium text-gray-900 focus:outline-none"
            />
          </form>
        ) : (
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
        )}

        {displayName && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{displayName}{personal?.jobTitle ? ` · ${personal.jobTitle}` : ''}</p>
        )}
        <p className="text-[10px] text-gray-400 mt-1">{t('modifiedOn', { date })}</p>
      </div>

      <div className="flex items-center gap-2 flex-none">
        <button
          type="button"
          onClick={onOpen}
          className="indigo-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition"
        >
          {t('openCV')}
        </button>

        <button
          type="button"
          onClick={() => { setEditing(true); setEditValue(name) }}
          className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition"
          aria-label={t('rename')}
          title={t('rename')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg px-2 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition"
            >
              {t('confirmDelete')}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 transition"
            >
              {t('cancelDelete')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            aria-label={t('delete')}
            title={t('delete')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
