import PDFPreview from '@/components/cv/PDFPreview'
import { createClient } from '@/lib/supabase/server'

export default async function PreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profiles: { id: string; name: string }[] = []

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, name')
      .order('updated_at', { ascending: false })
      .limit(50)

    profiles = (data ?? []).map((r) => ({
      id: String(r.id),
      name: String(r.name),
    }))
  }

  return <PDFPreview isAuthenticated={!!user} profiles={profiles} />
}
