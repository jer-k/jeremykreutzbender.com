import { Progress } from "@/components/ui/progress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - TrueCar",
  description: "Projects I worked on while at TrueCar",
  alternates: {
    canonical: "https://jeremykreutzbender.com/experience/truecar",
  },
  openGraph: {
    title: "TrueCar Experience - Jeremy Kreutzbender",
    description: "Work experience at TrueCar",
    url: "https://jeremykreutzbender.com/experience/truecar",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=TrueCar Experience",
        width: 960,
        height: 540,
        alt: "TrueCar Experience page",
        type: "image/png",
      },
    ],
  },
};

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4">
      <h3>Experience is under construction</h3>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
