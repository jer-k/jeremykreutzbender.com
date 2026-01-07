import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeremykreutzbender.com"),
  title: {
    template: "%s",
    default: "Jeremy Kreutzbender",
  },
  description: "A website by Jeremy Kreutzbender",
  alternates: {
    canonical: "https://jeremykreutzbender.com",
  },
  openGraph: {
    title: "Jeremy Kreutzbender",
    description: "Product Engineer",
    url: "https://jeremykreutzbender.com",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(
          "Jeremy Kreutzbender's site",
        )}`,
        width: 960,
        height: 540,
        alt: "Jeremy Kreutzbender's site",
        type: "image/png",
      },
    ],
  },
  twitter: {
    title: "Jeremy Kreutzbender",
    card: "summary_large_image",
    creator: "@J_Kreutzbender",
  },
  icons: {
    shortcut: "https://jeremykreutzbender.com/favicons/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
