import type { Metadata } from "next";

import AboutMdx from "./about.mdx";

export const metadata: Metadata = {
  title: "About",
  description: "All About Me",
  openGraph: {
    title: "About - Jeremy Kreutzbender",
    description: "All About Me",
    url: "https://jeremykreutzbender.com/about",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=About",
        width: 960,
        height: 540,
        alt: "About Me page",
        type: "image/png",
      },
    ],
  },
};

export default function About() {
  return <AboutMdx />;
}
