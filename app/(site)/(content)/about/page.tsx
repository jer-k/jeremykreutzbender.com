import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "All About Me",
  alternates: {
    canonical: "https://jeremykreutzbender.com/about",
  },
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
  return (
    <>
      <h1>About is under construction</h1>
      <div>Who knew writing about yourself would be that difficult?</div>
    </>
  );
}
