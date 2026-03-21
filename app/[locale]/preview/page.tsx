import PDFPreview from '@/components/cv/PDFPreview'
import { createClient } from '@/lib/supabase/server'

export default async function PreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <PDFPreview isAuthenticated={!!user} />
}
