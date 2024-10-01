import { GlobeIcon } from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { WorkExperienceCard } from "@/components/work-experience-card";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online CV",
  description: "An interactive online CV",
  alternates: {
    canonical: "https://jeremykreutzbender.com/cv",
  },
  openGraph: {
    title: "Online CV - Jeremy Kreutzbender",
    description: "An interactive online CV",
    url: "https://jeremykreutzbender.com/cv",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=CV",
        width: 960,
        height: 540,
        alt: "CV page",
        type: "image/png",
      },
    ],
  },
};

export default function CvPage() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-4 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-4 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">Jeremy Kreutzbender</h1>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href="https://www.google.com/maps/place/Portland,+OR"
                target="_blank"
              >
                <GlobeIcon className="size-3" />
                Portland, Oregon, United States
              </a>
            </p>
          </div>
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/jer-k.png" alt="@jer-k" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
        </div>
        <section className="flex min-h-0 flex-col gap-y-3">
          <Link href={"about"}>
            <h2 className="text-xl font-bold hover:underline">About</h2>
          </Link>
          <p className="text-pretty font-mono text-xs text-muted-foreground">
            As a Software Engineer I have taken projects from initial idea to
            completion on my own as well as within a team. I have led projects
            as an engineer but also managed ticket writing and prioritization. I
            highly value collaboration and insights from my colleagues.
          </p>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">Ruby on Rails</Badge>
            <Badge variant="secondary">GraphQL</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">React / Next.js</Badge>
            <Badge variant="secondary">Kubernetes</Badge>
            <Badge variant="secondary">Docker</Badge>
          </div>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <WorkExperienceCard
            companyName="Release"
            companyUrl="https://release.com"
            workType="Remote"
            duration="March, 2020 - August 2024"
            title="Founding Engineer"
            description={
              <ul className="list-disc ps-4">
                <li>
                  Migrated build system to Buildkit which reduced build times by
                  50% and unlocked horizontal scaling
                </li>
                <li>
                  Wrote tool to translate Docker compose files into Release
                  Application Template YAML (similar to kompose)
                </li>
                <li>
                  Built a webhook processing system to ingest and normalize
                  webhooks from GitHub, Gitlab, and Bitbucket. After
                  normalization, trigger pipelines to carry out tasks such as
                  creating new environments or triggering deploys to existing
                  environments
                </li>
                <li>
                  Rebuilt UI using Next.js, Typescript, and GraphQL. Modernized
                  the look of the site with Chakra UI. Reduced cold page load
                  times by an average of 20% but also took advantage of SWR
                  strategy to make subsequent navigation instantaneous
                </li>
              </ul>
            }
          />
          <WorkExperienceCard
            companyName="TrueCar"
            companyUrl="https://truecar.com"
            workType="On-Site"
            duration="January, 2014 - September, 2019"
            title="Software Engineer II-IV"
            description={
              <>
                <ul className="list-disc ps-4">
                  <li>
                    Built iOS app for a new Sell My Car initiative; including
                    backend work with Ruby on Rails
                  </li>
                  <li>
                    Worked on an internal tool (Ruby on Rails / React) which
                    replaced a week long manual ETL process of car data. The
                    tool processed data from a daily feed while providing the
                    ability to manage and deploy the transformed data multiple
                    times a day (700% increase)
                  </li>
                  <li>
                    Rebuilt the New Car traffic funnel ($200m/yr business at the
                    time) using Ruby on Rails / React. Ran extensive A/B tests
                    on each funnel step to ensure NFE did not drop. Reduced page
                    load times from 3 seconds to sub 1 second (300% increase)
                  </li>
                </ul>
              </>
            }
          />
          <WorkExperienceCard
            companyName="CarWoo!"
            workType="On-Site"
            duration="June, 2012 - December, 2013"
            title="Software Engineer"
            description={
              <ul className="list-disc ps-4">
                <li>
                  Built an iOS app to give car dealers a mobile first experience
                  using CarWoo!
                </li>
                <li>
                  Transitioned to working on the main CarWoo! website, learning
                  Ruby on Rails
                </li>
                <li>
                  Built an Account Manager dashboard powered by a nightly job
                  running a MySQL query collecting events
                </li>
                <li>
                  Rebuilt a high traffic page by gathering empirical evidence on
                  issues customers were facing
                </li>
              </ul>
            }
          />
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Education</h2>
          <Card className="bg-white py-4">
            <CardHeader className="py-0">
              <div className="flex items-start justify-between gap-x-2 text-base">
                <h3 className="flex flex-col space-y-1 font-semibold leading-none">
                  <a
                    className="hover:underline"
                    href="https://oregonstate.edu"
                    target="_blank"
                  >
                    Oregon State University
                  </a>
                  <a
                    className="text-sm text-gray-500 hover:underline"
                    href="https://engineering.oregonstate.edu/EECS"
                    target="_blank"
                  >
                    School of Electrical Engineering and Computer Science
                  </a>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  September, 2008 - June, 2012
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-0 mt-2 text-xs">
              B.S. Computer Science - Cum Laude
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
