import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://indigocv.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'fr']
  const pages = ['', '/create', '/login']

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1 : 0.8,
    })),
  )
}
