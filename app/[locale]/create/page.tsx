import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import FormWizard from '@/components/form/FormWizard'
import CVLoader from '@/components/CVLoader'
import { createClient } from '@/lib/supabase/server'
import type { CVRecord } from '@/types/cv'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('form')
  return { title: `${t('finish').replace(' →', '')} — IndigoCV` }
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ cvId?: string }>
}) {
  const { cvId } = await searchParams
  let initialRecord: CVRecord | null = null

  if (cvId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .single()
    initialRecord = data ?? null
  }

  return (
    <main
      className="min-h-screen py-6 px-4 pt-20 sm:pt-28 pb-14"
      style={{
        background: `
          repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 28px,
            rgba(255, 255, 255, 0.18) 28px,
            rgba(255, 255, 255, 0.18) 30px
          ),
          linear-gradient(
            105deg,
            #ffd6d6 0%,
            #ffddb8 16%,
            #faf7c0 32%,
            #c9efd4 48%,
            #c0e8f7 64%,
            #cdd3f5 80%,
            #e8cef5 100%
          )
        `,
      }}
    >
      <CVLoader initialRecord={initialRecord} />
      <div className="max-w-xl mx-auto">
        <FormWizard />
      </div>
    </main>
  )
}
