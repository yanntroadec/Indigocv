import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import CVList from '@/components/dashboard/CVList'
import ProfileList from '@/components/dashboard/ProfileList'
import { getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard')
  return { title: `${t('title')} — IndigoCV` }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const locale = await getLocale()

  if (!user) redirect({ href: '/login', locale })
  const userEmail = user!.email

  const [{ data: rawProfiles }, { data: rawCvs }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, updated_at, data->personal')
      .order('updated_at', { ascending: false })
      .limit(50),
    supabase
      .from('cvs')
      .select('id, name, updated_at, data->personal, profile_id, profiles(name)')
      .order('updated_at', { ascending: false })
      .limit(50),
  ])

  const profiles = (rawProfiles ?? []).map((row) => {
    const r = row as Record<string, unknown>
    return {
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      updated_at: String(r.updated_at ?? ''),
      personal: r.personal as { firstName?: string; lastName?: string; jobTitle?: string } | null ?? null,
    }
  })

  const cvs = (rawCvs ?? []).map((row) => {
    const r = row as Record<string, unknown>
    const profileRow = r.profiles as { name?: string } | null
    return {
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      updated_at: String(r.updated_at ?? ''),
      personal: r.personal as { firstName?: string; lastName?: string; jobTitle?: string } | null ?? null,
      profileName: profileRow?.name ?? null,
    }
  })

  const t = await getTranslations('dashboard')

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('profilesTitle')}</h2>
          <ProfileList initialProfiles={profiles} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('cvsTitle')}</h2>
          <CVList initialCvs={cvs} />
        </section>
      </div>
    </main>
  )
}
