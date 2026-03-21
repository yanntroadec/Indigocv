import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'IndigoCV',
  description: 'Générez votre CV professionnel en PDF, directement dans votre navigateur.',
  openGraph: {
    title: 'IndigoCV',
    description: 'Créez et téléchargez votre CV en PDF — sans compte, sans serveur.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <Header />
        {children}
      </body>
    </html>
  )
}
