import { Progress } from "@/components/ui/progress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos",
  description: "My videos",
  alternates: {
    canonical: "https://jeremykreutzbender.com/videos",
  },
  openGraph: {
    title: "Videos - Jeremy Kreutzbender",
    description: "Videos",
    url: "https://jeremykreutzbender.com/videos",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Videos",
        width: 960,
        height: 540,
        alt: "Videos page",
        type: "image/png",
      },
    ],
  },
};

export default function Videos() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-primary dark:text-bright font-bold text-3xl">
        Videos
      </h1>
      <div className="flex flex-col space-y-4 not-prose">
        <div className="flex flex-col items-center justify-center space-y-2 py-4">
          <h3>Videos are under construction</h3>
          <p>Well I haven&apos;t actually recorded anything yet, but someday</p>
        </div>
      </div>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
