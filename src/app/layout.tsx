/* eslint-disable simple-import-sort/imports */
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

import { Metadata, Viewport } from 'next'

import './globals.css'
import CursorAnimation from '@/components/common/CursorAnimation'
import MobileNav from '@/components/common/MobileNav'

export const metadata: Metadata = {
  title: 'James Jeremy Foong',
  description:
    'James Jeremy Foong — Senior Software Engineer specializing in Angular, TypeScript, and enterprise HR-tech. 3+ years building CATAPA for 15K+ users.',
  category: 'Portfolio',
  authors: { name: 'James Jeremy Foong' },
  keywords: [
    'James Jeremy Foong',
    'Portfolio',
    'Senior Software Engineer',
    'Angular',
    'TypeScript',
    'NgRx',
    'Enterprise Frontend',
    'CATAPA',
  ],
  creator: 'James Jeremy Foong',
  publisher: 'James Jeremy Foong',
  alternates: {
    canonical: 'https://jamesjfoong.vercel.app',
  },
  openGraph: {
    title: 'James Jeremy Foong — Senior Software Engineer',
    description:
      'Senior Software Engineer specializing in Angular, TypeScript, and enterprise HR-tech. 3+ years building CATAPA for 15K+ users.',
    url: 'https://jamesjfoong.vercel.app/',
    siteName: 'James Jeremy Foong',
    images: [
      {
        url: 'https://jamesjfoong.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'James Jeremy Foong — Senior Software Engineer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'James Jeremy Foong — Senior Software Engineer',
    description:
      'Senior Software Engineer specializing in Angular, TypeScript, and enterprise HR-tech.',
    images: ['https://jamesjfoong.vercel.app/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="leading-relaxed antialiased selection:bg-teal-300 selection:text-teal-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <MobileNav />
        <div className="relative">
          <CursorAnimation />
          {children}
        </div>
      </body>
    </html>
  )
}
