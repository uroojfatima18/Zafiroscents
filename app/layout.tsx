import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/components/auth/AuthProvider'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zafiro Scents — Artisanal Luxury Fragrances',
    template: '%s | Zafiro Scents',
  },
  description:
    'Discover Zafiro Scents — handcrafted luxury perfumes for men, women, and beyond. Rare ingredients, quiet confidence.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zafiroscents.com'),
  openGraph: {
    type: 'website',
    siteName: 'Zafiro Scents',
    title: 'Zafiro Scents — Artisanal Luxury Fragrances',
    description:
      'Handcrafted luxury perfumes composed with rare ingredients and slow intention.',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zafiro Scents',
    description: 'Artisanal luxury fragrances — Pakistan',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
