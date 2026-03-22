import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CVList from '@/components/dashboard/CVList'
import ProfileList from '@/components/dashboard/ProfileList'

export const metadata: Metadata = {
  title: 'Mon dashboard — IndigoCV',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

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

  const profiles = (rawProfiles ?? []) as unknown as {
    id: string
    name: string
    updated_at: string
    personal?: { firstName?: string; lastName?: string; jobTitle?: string } | null
  }[]

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

  return (
    <main
      className="min-h-screen py-10 px-4 pt-28 pb-14"
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
          <h1 className="text-2xl font-bold text-gray-900">Mon dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mes profils</h2>
          <ProfileList initialProfiles={profiles} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mes CVs</h2>
          <CVList initialCvs={cvs} />
        </section>
      </div>
    </main>
  )
}
