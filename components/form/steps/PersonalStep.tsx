'use client'

import { useCVStore } from '@/store/cvStore'
import type { CVData } from '@/types/cv'

export default function PersonalStep() {
  const { cv, setPersonal } = useCVStore()
  const personal = cv.personal

  const update = (field: keyof CVData['personal'], value: string) => {
    setPersonal({ ...personal, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Prénom"
          value={personal.firstName}
          onChange={(v) => update('firstName', v)}
          placeholder="Jean"
        />
        <Field
          label="Nom"
          value={personal.lastName}
          onChange={(v) => update('lastName', v)}
          placeholder="Dupont"
        />
      </div>
      <Field
        label="Titre du poste"
        value={personal.jobTitle}
        onChange={(v) => update('jobTitle', v)}
        placeholder="Développeur Full-Stack"
      />
      <Field
        label="Email"
        type="email"
        value={personal.email}
        onChange={(v) => update('email', v)}
        placeholder="jean.dupont@email.com"
      />
      <Field
        label="Téléphone"
        type="tel"
        value={personal.phone}
        onChange={(v) => update('phone', v)}
        placeholder="+33 6 12 34 56 78"
      />
      <Field
        label="Rue et numéro"
        value={personal.street}
        onChange={(v) => update('street', v)}
        placeholder="12 Rue de la Paix"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Ville"
          value={personal.city}
          onChange={(v) => update('city', v)}
          placeholder="Paris"
        />
        <Field
          label="Code postal"
          value={personal.postalCode}
          onChange={(v) => update('postalCode', v)}
          placeholder="75001"
        />
      </div>
      <Field
        label="Pays"
        value={personal.country}
        onChange={(v) => update('country', v)}
        placeholder="France"
      />
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">Présence en ligne</p>
      <Field
        label="LinkedIn"
        value={personal.linkedin}
        onChange={(v) => update('linkedin', v)}
        placeholder="linkedin.com/in/username"
      />
      <Field
        label="GitHub"
        value={personal.github}
        onChange={(v) => update('github', v)}
        placeholder="github.com/username"
      />
      <Field
        label="Portfolio / Site web"
        value={personal.portfolio}
        onChange={(v) => update('portfolio', v)}
        placeholder="monportfolio.fr"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Résumé / Profil
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          rows={4}
          value={personal.summary}
          onChange={(e) => update('summary', e.target.value)}
          placeholder="Décrivez brièvement votre profil professionnel..."
        />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
