/* eslint-disable simple-import-sort/imports */
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

import { Metadata, Viewport } from 'next'

import './globals.css'
import CursorAnimation from '@/components/common/CursorAnimation'

export const metadata: Metadata = {
  title: 'James Jeremy Foong',
  description: 'A personal portfolio site for James Jeremy Foong',
  category: 'Portfolio',
  authors: { name: 'James Jeremy Foong' },
  keywords: [
    'James Jeremy Foong',
    'Portfolio',
    'Software Engineer',
    'Full Stack Developer',
  ],
  creator: 'James Jeremy Foong',
  publisher: 'James Jeremy Foong',
  openGraph: {
    title: 'James Jeremy Foong',
    description: 'A personal portfolio site for James Jeremy Foong',
    url: 'https://jamesjfoong.vercel.app/',
    siteName: 'James Jeremy Foong',
    images: 'https://jamesjfoong.vercel.app/images/screenshoot.PNG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'James Jeremy Foong',
    description: 'A personal portfolio site for James Jeremy Foong',
    images: ['https://jamesjfoong.vercel.app/images/screenshoot.PNG'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="leading-relaxed antialiased selection:bg-teal-300 selection:text-teal-900s">
        <div className="relative">
          <CursorAnimation />
          {children}
        </div>
      </body>
    </html>
  )
}
