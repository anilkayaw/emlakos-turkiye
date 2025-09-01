import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EmlakOS Türkiye - Modern Gayrimenkul Platformu',
  description: 'Türkiye\'nin gayrimenkul piyasası için merkezi "işletim sistemi" - ev arama, kiralama, satın alma, satma ve yönetme süreçlerinin tamamını tek bir çatı altında toplayan platform.',
  keywords: 'emlak, gayrimenkul, türkiye, ev arama, kiralama, satın alma, satma, değerleme',
  authors: [{ name: 'EmlakOS Türkiye Team' }],
  creator: 'EmlakOS Türkiye',
  publisher: 'EmlakOS Türkiye',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emlakos-turkiye.com'),
  openGraph: {
    title: 'EmlakOS Türkiye - Modern Gayrimenkul Platformu',
    description: 'Türkiye\'nin gayrimenkul piyasası için merkezi "işletim sistemi"',
    url: 'https://emlakos-turkiye.com',
    siteName: 'EmlakOS Türkiye',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EmlakOS Türkiye',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmlakOS Türkiye - Modern Gayrimenkul Platformu',
    description: 'Türkiye\'nin gayrimenkul piyasası için merkezi "işletim sistemi"',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased bg-secondary-50 text-secondary-900`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
