import { ReactNode } from "react";

import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Jeremy Kreutzbender",
    default: "Jeremy Kreutzbender",
  },
  description: "My personal website",
  openGraph: {
    title: "Jeremy Kreutzbender",
    description: "Product Engineer",
    url: "https://jeremykreutzbender.com",
    siteName: "Jeremy Kreutzbender's site",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Jeremy Kreutzbender",
    card: "summary_large_image",
    creator: "@J_Kreutzbender",
  },
  icons: {
    shortcut: "https://jeremykreutzbender.com/favicons/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
