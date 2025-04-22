import { GlobeIcon } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <main className="pb-2">
      <section className="mx-auto w-full max-w-2xl space-y-4 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">Jeremy Kreutzbender</h1>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href="https://www.google.com/maps/place/Portland,+OR"
                target="_blank"
                rel="noreferrer"
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
        <section className="flex min-h-0 flex-col gap-y-3 !mt-0">
          <Link
            className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="/about"
          >
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
          <h2 className="text-xl font-bold">Work Experience</h2>
          <WorkExperienceCard
            companyName="Vantage"
            companyUrl="https://vantage.sh"
            workType="Remote"
            duration="February, 2025 - Present"
            title="Staff Software Engineer"
            description={<></>}
          />
          <WorkExperienceCard
            companyName="Release"
            companyUrl="https://release.com"
            workType="Remote"
            duration="March, 2020 - August, 2024"
            title="Senior Software Engineer"
            description={
              <ul className="list-disc ps-4">
                <li>
                  Reduced build times by 50% by migrating{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://www.docker.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Docker
                  </a>{" "}
                  build system to{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://docs.docker.com/build/buildkit/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buildkit
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://docs.docker.com/build/bake/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Bake
                  </a>
                </li>
                <li>
                  Wrote tool to translate Docker{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://docs.docker.com/compose/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    compose
                  </a>{" "}
                  files into Release Application Template YAML (similar to{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://kompose.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    kompose
                  </a>
                  ) which helped reduce onboarding time of new customers with
                  compose files by 30%
                </li>
                <li>
                  Built a webhook processing system to ingest and normalize
                  webhooks from GitHub, Gitlab, and Bitbucket. After
                  normalization, created an average of 4,000{" "}
                  <Link
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="/blog/what-are-preview-environments"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview Environments
                  </Link>{" "}
                  per month
                </li>
                <li>
                  Led project, including ticket writing and prioritization, to
                  rebuild UI in{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Next.js
                  </a>{" "}
                  with{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://www.typescriptlang.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Typescript
                  </a>{" "}
                  which reduced unhandled exceptions by 80%
                </li>
                <li>
                  Helped with implementation of{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://graphql.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GraphQL
                  </a>{" "}
                  on{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://rubyonrails.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Rails
                  </a>{" "}
                  backend and Next.js frontend to reduce cold page load times by
                  an average of 20%. Utilized{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate"
                    target="_blank"
                    rel="noreferrer"
                  >
                    stale-while-revalidate
                  </a>{" "}
                  to make navigation to previous pages instantaneous
                </li>
                <li>
                  Interfaced with customers to gather product requirements and
                  triage bug reports
                </li>
                <li>
                  First Engineering hire and part of the founding Engineering
                  team
                </li>
              </ul>
            }
          />
          <WorkExperienceCard
            companyName="TrueCar"
            companyUrl="https://truecar.com"
            workType="On-Site"
            duration="January, 2014 - September, 2019"
            title={
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Software Engineer II-IV</TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <ul className="list-disc ps-4">
                      <li>Software Engineer II: January, 2014 - March, 2016</li>
                      <li>Software Engineer III: March, 2016 - July, 2017</li>
                      <li>
                        Software Engineer IV: July, 2017 - September, 2019
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            description={
              <ul className="list-disc ps-4">
                <li>
                  Rebuilt the{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://www.truecar.com/shop/new/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    New Car
                  </a>{" "}
                  funnel ($200m/yr business at the time) with Rails backend and{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://react.dev/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    React
                  </a>{" "}
                  frontend
                  <ul className="list-disc ps-4">
                    <li>
                      Reduced page load times from 3 seconds to sub 1 second
                      (300% increase)
                    </li>
                    <li>
                      Ran extensive A/B tests on each change to the UI to ensure
                      the funnel conversion rate did not drop
                    </li>
                  </ul>
                </li>
                <li>
                  Technical lead on an internal tool built with a Rails backend
                  and React frontend to replace a week long manual{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://cloud.google.com/learn/what-is-etl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ETL
                  </a>{" "}
                  process of car data
                  <ul className="list-disc ps-4">
                    <li>
                      Helped build a data processing pipeline which processed
                      new vehicle information daily instead of the weekly (700%
                      increase)
                    </li>
                    <li>
                      Helped build various data management UIs that consolidated
                      multi-step and multi-person processes into single a single
                      source of truth
                    </li>
                    <li>
                      Built a publishing and ingesting system of the managed
                      vehicle data. New data in the form of a{" "}
                      <a
                        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        href="https://www.postgresql.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PostgreSQL
                      </a>{" "}
                      dump was uploaded to{" "}
                      <a
                        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        href="https://aws.amazon.com/pm/serv-s3/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        S3
                      </a>{" "}
                      and able to be made available multiple times a day instead
                      of the previous weekly publish (&gt; 700% increase)
                    </li>
                  </ul>
                </li>
                <li>
                  Built native iOS application with{" "}
                  <a
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011210"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Objective-C
                  </a>{" "}
                  for a new business initiative (Sell My Car) to help users sell
                  their vehicles
                  <ul className="list-disc ps-4">
                    <li>
                      Helped build a dynamic screen building library which
                      consumed an API to determine which screen to display to
                      users after they answered vehicle related questions
                    </li>
                    <li>
                      Managed internal state of user&apos;s data with{" "}
                      <a
                        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        href="https://developer.apple.com/documentation/coredata/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Core Data
                      </a>{" "}
                      to ensure that progress was not lost if the application
                      was closed
                    </li>
                  </ul>
                </li>
              </ul>
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
                  Rebuilt a consumer funnel on the main website (Rails) seeing
                  high abandonment rates and saw funnel conversion rate increase
                  by 25%
                </li>
                <li>
                  Built an internal dashboard which aggregated events from the
                  database into actionable tasks for the CarWoo! Account
                  Managers increasing the speed at which they were able to
                  resolve account issues by 50%
                </li>
                <li>
                  Built an iOS app to give car dealers a mobile first experience
                  using CarWoo!
                  <ul className="list-disc ps-4">
                    <li>
                      Added data synchronization with Core Data so that the
                      application was useful on car dealer lots where
                      connectivity may have been low
                    </li>
                    <li>
                      Built an in application messaging platform which saw
                      dealer to consumer communication increase by 10%
                    </li>
                    <li>
                      Built event handling system to launch the application to
                      the correct screen when clicking on push notifications
                    </li>
                  </ul>
                </li>
              </ul>
            }
          />
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Projects</h2>
          <Card className="bg-white py-4">
            <CardHeader className="py-0">
              <a
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href="https://jeremykreutzbender.com"
                target="_blank"
                rel="noreferrer"
              >
                jeremykreutzbender.com
              </a>
            </CardHeader>
            <CardContent className="py-0 mt-2 text-xs">
              <ul className="list-disc ps-4">
                <li>
                  Personal website (you&apos;re on it right now!) built with
                  Next.js App Router, React, and Typescript
                </li>
                <li>
                  I&apos;m using this website as a platform for writing blog
                  posts, learning Typescript, and a playground to try out new
                  features in React and Next.js
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
        <section className="flex min-h-0 flex-col">
          <h3 className="text-l font-bold">Languages</h3>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">Ruby</Badge>
            <Badge variant="secondary">Javascript</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Objective-C</Badge>
          </div>
        </section>
        <section className="flex min-h-0 flex-col">
          <h3 className="text-l font-bold">Technologies</h3>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">Ruby on Rails</Badge>
            <Badge variant="secondary">ReactNext.js</Badge>
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">GraphQL</Badge>
            <Badge variant="secondary">Docker</Badge>
            <Badge variant="secondary">Postgresql</Badge>
          </div>
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
                    rel="noreferrer"
                  >
                    Oregon State University
                  </a>
                  <a
                    className="text-sm text-gray-500 hover:underline"
                    href="https://engineering.oregonstate.edu/EECS"
                    target="_blank"
                    rel="noreferrer"
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
              <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
                <a
                  className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  href="https://www.google.com/maps/place/Corvallis,+OR"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GlobeIcon className="size-3" />
                  Corvallis, Oregon, United States
                </a>
              </p>
              <p>B.S. Computer Science - Cum Laude</p>
            </CardContent>
          </Card>
          <Card className="bg-white py-4">
            <CardHeader className="py-0">
              <div className="flex items-start justify-between gap-x-2 text-base">
                <h3 className="flex flex-col space-y-1 font-semibold leading-none">
                  <a
                    className="hover:underline"
                    href="https://www.amity.k12.or.us/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amity High School
                  </a>
                </h3>

                <div className="text-sm tabular-nums text-gray-500">
                  September, 2004 - June, 2008
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-0 mt-2 text-xs">
              <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
                <a
                  className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  href="https://www.google.com/maps/place/Amity,+OR"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GlobeIcon className="size-3" />
                  Amity, Oregon, United States
                </a>
              </p>
              <p>Valedictorian</p>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
