import type { Metadata } from "next";

import ReleaseMdx from "./release.mdx";

export const metadata: Metadata = {
  title: "Experience - Release",
  description: "Projects I worked on while at Release",
  openGraph: {
    title: "Release Experience - Jeremy Kreutzbender",
    description: "Work experience at Release",
    url: "https://jeremykreutzbender.com/experience/release",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Release Experience",
        width: 960,
        height: 540,
        alt: "Release Experience page",
        type: "image/png",
      },
    ],
  },
};

export default function About() {
  return <ReleaseMdx />;
}
