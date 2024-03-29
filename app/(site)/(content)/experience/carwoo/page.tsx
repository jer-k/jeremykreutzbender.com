import { Progress } from "@/components/ui/progress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - CarWoo!",
  description: "Projects I worked on while at CarWoo!",
  openGraph: {
    title: "CarWoo! Experience - Jeremy Kreutzbender",
    description: "Work experience at CarWoo!",
    url: "https://jeremykreutzbender.com/experience/carwoo",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=CarWoo! Experience",
        width: 960,
        height: 540,
        alt: "Carwoo! Experience page",
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
