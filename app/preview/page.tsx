import type { Metadata } from 'next'
import PDFPreview from '@/components/cv/PDFPreview'

export const metadata: Metadata = {
  title: 'Aperçu du CV — IndigoCV',
}

export default function PreviewPage() {
  return <PDFPreview />
}
