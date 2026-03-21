'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
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
  { key: 'template' as const,       component: TemplateStep },
  { key: 'photo' as const,          component: PhotoStep },
  { key: 'personal' as const,       component: PersonalStep },
  { key: 'experience' as const,     component: ExperienceStep },
  { key: 'projects' as const,       component: ProjectsStep },
  { key: 'education' as const,      component: EducationStep },
  { key: 'certifications' as const, component: CertificationsStep },
  { key: 'skills' as const,         component: SkillsStep },
  { key: 'languages' as const,      component: LanguagesStep },
  { key: 'interests' as const,      component: InterestsStep },
]

export default function FormWizard() {
  const t = useTranslations('form')
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
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {t(`steps.${STEPS[step].key}.label`)}
        </h2>
        <StepComponent />
      </div>

      <div className="flex gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 rounded-xl border border-gray-300 bg-white/60 py-3 text-sm font-medium text-gray-700 hover:bg-white/90 transition"
          >
            {t('prev')}
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: '#4f46e5' }}
        >
          {isLast ? t('finish') : t('next')}
        </button>
      </div>
    </div>
  )
}
