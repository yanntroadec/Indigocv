import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/server'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://indigocv.vercel.app'

const descriptions: Record<string, string> = {
  en: 'Create and download your professional CV as a PDF, directly in your browser. Free and instant.',
  fr: 'Créez et téléchargez votre CV professionnel en PDF, directement dans votre navigateur. Gratuit et instantané.',
  es: 'Crea y descarga tu CV profesional en PDF, directamente en tu navegador. Gratis e instantáneo.',
}

const titles: Record<string, string> = {
  en: 'Create your clean and professional CV',
  fr: 'Créez votre CV propre et professionnel',
  es: 'Crea tu CV limpio y profesional',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = titles[locale] || titles.en
  const description = descriptions[locale] || descriptions.en
  const ogLocaleMap: Record<string, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' }
  const ogLocale = ogLocaleMap[locale] || 'en_US'
  const altLocale = Object.values(ogLocaleMap).filter((l) => l !== ogLocale)

  return {
    title: {
      default: 'IndigoCV',
      template: '%s — IndigoCV',
    },
    description,
    openGraph: {
      title: `IndigoCV — ${title}`,
      description,
      type: 'website',
      siteName: 'IndigoCV',
      locale: ogLocale,
      alternateLocale: altLocale,
      url: `${SITE_URL}/${locale}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'IndigoCV',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `IndigoCV — ${title}`,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        es: `${SITE_URL}/es`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr' | 'es')) {
    notFound()
  }

  const messages = await getMessages()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider initialUser={user}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
