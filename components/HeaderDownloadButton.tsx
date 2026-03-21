'use client'

import dynamic from 'next/dynamic'
import { useCVStore } from '@/store/cvStore'
import { useTranslations } from 'next-intl'
import CVDocument from '@/components/cv/CVDocument'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink),
  { ssr: false }
)

export default function HeaderDownloadButton() {
  const { cv } = useCVStore()
  const tCv = useTranslations('cv')
  const tPreview = useTranslations('preview')

  const sectionTitles = {
    profile: tCv('profile'),
    experience: tCv('experience'),
    projects: tCv('projects'),
    education: tCv('education'),
    certifications: tCv('certifications'),
    skills: tCv('skills'),
    languages: tCv('languages'),
    interests: tCv('interests'),
    contact: tCv('contact'),
    present: tCv('present'),
  }

  return (
    <PDFDownloadLink document={<CVDocument cv={cv} sectionTitles={sectionTitles} />} fileName="cv.pdf">
      {({ loading }) => (
        <span
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
          style={{
            background: 'linear-gradient(105deg, #c97a7a 0%, #c4924a 20%, #b5a030 40%, #4a9e70 55%, #3a7eaf 75%, #7a72c4 100%)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '…' : tPreview('download')}
        </span>
      )}
    </PDFDownloadLink>
  )
}
