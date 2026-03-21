import type { Metadata } from 'next'
import FormWizard from '@/components/form/FormWizard'
import CVLoader from '@/components/CVLoader'
import { createClient } from '@/lib/supabase/server'
import type { CVRecord } from '@/types/cv'

export const metadata: Metadata = {
  title: 'Créer mon CV — IndigoCV',
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
      className="min-h-screen py-10 px-4 pt-28"
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
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Mon CV</h1>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez chaque étape, puis prévisualisez votre CV.
          </p>
        </div>
        <FormWizard />
      </div>
    </main>
  )
}
