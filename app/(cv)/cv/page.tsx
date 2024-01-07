import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CvPage() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">Jeremy Kreutzbender</h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
              Product Engineer focused on building and delivering user facing
              experiences
            </p>
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
          <Avatar className="size-28">
            <AvatarImage src="https://github.com/jer-k.png" alt="@jer-k" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
        </div>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground">
            As a Software Engineer I have taken projects from initial idea to
            completion on my own as well as within a team. I have led projects
            as an engineer but also managed ticket writing and prioritization. I
            highly value collaboration and insights from my colleagues.
            Currently, I work primarily with Ruby on Rails, GraphQL, TypeScript,
            React, Next.js.
          </p>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                  <a className="hover:underline" href="https://release.com">
                    Release
                  </a>
                  <span className="inline-flex gap-x-1">
                    <Badge variant="secondary" className="align-middle text-xs">
                      Remote
                    </Badge>
                  </span>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  March, 2020 - Current
                </div>
              </div>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h4 className="font-mono text-sm leading-none">
                  Founding Engineer
                </h4>
              </div>
            </CardHeader>
            <CardContent className="mt-2 text-xs">
              As the first engineering hire at Release I&apos;ve worn nearly
              every hat imaginable. My primary role has always been one of the
              lead engineers on the customer facing website. I have also spent
              large portions of time supporting and triaging customer issues and
              handling ticket writing and prioritization.
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                  <a className="hover:underline" href="https://truecar.com">
                    TrueCar
                  </a>
                  <span className="inline-flex gap-x-1">
                    <Badge variant="secondary" className="align-middle text-xs">
                      On-Site
                    </Badge>
                  </span>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  January, 2014 - September, 2019
                </div>
              </div>
              <h4 className="font-mono text-sm leading-none">
                Software Engineer II-IV
              </h4>
            </CardHeader>
            <CardContent className="mt-2 text-xs">
              I worked on various internal facing and public facing projects
              throughout my career at TrueCar. The largest internal project
              replaced a week long manual ETL pipeline with a React application
              that was able to process and deploy new data every day. The
              largest public facing project was responsible for the main funnel
              of New Car traffic ($200m/yr business). We built new Rails APIs
              and React components and worked to take page speed loading times
              from 3 seconds to less than 1 second.
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                  CarWoo!
                  <span className="inline-flex gap-x-1">
                    <Badge variant="secondary" className="align-middle text-xs">
                      On-Site
                    </Badge>
                  </span>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  June, 2012 - December, 2013
                </div>
              </div>
              <h4 className="font-mono text-sm leading-none">
                Software Engineer
              </h4>
            </CardHeader>
            <CardContent className="mt-2 text-xs">
              My primary focus was an iOS application which I built by myself,
              with a colleague assisting me by building the API it talked to,
              for CarWoo!&apos;s dealership customers. Upon completion of the
              application, I started working on the primary Ruby on Rails
              application.
            </CardContent>
          </Card>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Education</h2>
          <Card className="bg-white">
            <CardHeader>
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
            <CardContent className="mt-2">B.S. Computer Science</CardContent>
          </Card>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            <Badge>Ruby on Rails</Badge>
            <Badge>GraphQL</Badge>
            <Badge>TypeScript</Badge>
            <Badge>React / Next.js</Badge>
            <Badge>Kubernetes</Badge>
          </div>
        </section>
      </section>
    </main>
  );
}
