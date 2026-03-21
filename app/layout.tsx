import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'IndigoCV',
  description: 'Générez votre CV professionnel en PDF, directement dans votre navigateur.',
  openGraph: {
    title: 'IndigoCV',
    description: 'Créez et téléchargez votre CV en PDF.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased">
        <AuthProvider initialUser={user}>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
