import { config } from '@fortawesome/fontawesome-svg-core'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Metadata, Viewport } from 'next'

import CursorAnimation from '@/components/common/cursor-animation'
import MainNav from '@/components/navigation/main-nav'
import ScrollProgress from '@/components/ui/scroll-progress'

import './globals.css'

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

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="leading-relaxed antialiased selection:bg-primary/20 selection:text-primary-foreground">
        <div className="relative min-h-screen bg-background text-foreground">
          <ScrollProgress />
          <CursorAnimation />
          <MainNav />
          <main className="pt-14">{children}</main>
        </div>
      </body>
    </html>
  )
}
