'use client'

import { useRouter } from 'next/navigation'
import { useCVStore } from '@/store/cvStore'
import TemplateStep from './steps/TemplateStep'
import PhotoStep from './steps/PhotoStep'
import PersonalStep from './steps/PersonalStep'
import ExperienceStep from './steps/ExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsStep from './steps/SkillsStep'
import LanguagesStep from './steps/LanguagesStep'
import ProjectsStep from './steps/ProjectsStep'
import CertificationsStep from './steps/CertificationsStep'
import InterestsStep from './steps/InterestsStep'

export const STEPS = [
  { label: 'Template',                  short: 'Template',        component: TemplateStep },
  { label: 'Photo de profil',           short: 'Photo',           component: PhotoStep },
  { label: 'Informations personnelles', short: 'Infos',           component: PersonalStep },
  { label: 'Expériences',               short: 'Expériences',     component: ExperienceStep },
  { label: 'Projets',                   short: 'Projets',         component: ProjectsStep },
  { label: 'Formation',                 short: 'Formation',       component: EducationStep },
  { label: 'Certifications',            short: 'Certifs',         component: CertificationsStep },
  { label: 'Compétences',               short: 'Compétences',     component: SkillsStep },
  { label: 'Langues',                   short: 'Langues',         component: LanguagesStep },
  { label: 'Centres d\'intérêt',        short: 'Intérêts',        component: InterestsStep },
]

export default function FormWizard() {
  const router = useRouter()
  const { step, setStep } = useCVStore()

  const StepComponent = STEPS[step].component
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  const goNext = () => {
    if (isLast) {
      router.push('/preview')
    } else {
      setStep(step + 1)
    }
  }

  const goPrev = () => {
    if (!isFirst) setStep(step - 1)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/80 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">{STEPS[step].label}</h2>
        <StepComponent />
      </div>

      <div className="flex gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 rounded-xl border border-gray-300 bg-white/60 py-3 text-sm font-medium text-gray-700 hover:bg-white/90 transition"
          >
            ← Précédent
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: '#4f46e5' }}
        >
          {isLast ? 'Aperçu de mon CV →' : 'Suivant →'}
        </button>
      </div>
    </div>
  )
}
