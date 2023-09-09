import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Jeremy Kreutzbender',
    default: 'Jeremy Kreutzbender',
  },
  description: 'Product Engineer',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
  openGraph: {
    title: 'Jeremy Kreutzbender',
    description: 'Product Engineer',
    url: 'https://jeremykreutzbender.com',
    siteName: "Jeremy Kreutzbender's site",
    locale: 'en_US',
    type: 'website',
    // To use your own endpoint, refer to https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation
    // Note that an official `app/` solution is coming soon.
    images: [
      {
        url: `https://jeremykreutzbender.com/api/og?title=${encodeURIComponent(
            "Jeremy Kreutzbender's site"
        )}`,
        width: 1200,
        height: 630,
        alt: '',
      },
    ],
  },
  twitter: {
    title: 'Jeremy Kreutzbender',
    card: 'summary_large_image',
    creator: '@j_kreutzbender',
  },
  icons: {
    shortcut: 'https://jeremykreutzbender.com/favicons/favicon.ico',
  },
  alternates: {
    types: {
      // See the RSS Feed section for more details
      'application/rss+xml': 'https://jeremykreutzbender.com/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
