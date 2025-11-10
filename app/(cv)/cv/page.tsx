import type { Metadata } from "next";

import { GlobeIcon } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { SchoolCard } from "@/components/school-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WorkExperienceCard } from "@/components/work-experience-card";

import { cvData } from "@/lib/constants/cv-data";

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
  const { personalInfo, about, jobs, projects, skills, schools } = cvData;
  return (
    <main className="pb-2">
      <section className="mx-auto w-full max-w-2xl space-y-4 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{personalInfo.name}</h1>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={personalInfo.locationUrl}
                target="_blank"
                rel="noreferrer"
              >
                <GlobeIcon className="size-3" />
                {personalInfo.location}
              </a>
            </p>
          </div>
          <Avatar className="h-20 w-20">
            <AvatarImage src={personalInfo.avatarUrl} alt="@jer-k" />
            <AvatarFallback>{personalInfo.avatarFallback}</AvatarFallback>
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
            {about.summary}
          </p>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          {jobs.map((job) => (
            <WorkExperienceCard key={job.title} job={job} />
          ))}
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Projects</h2>
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </section>
        <section className="flex flex-col min-h-0">
          <h2 className="text-l font-bold">Languages</h2>
          <div className="flex flex-wrap gap-1">
            {skills.languages.map((lang) => (
              <Badge key={lang} variant="secondary">
                {lang}
              </Badge>
            ))}
          </div>
        </section>
        <section className="flex flex-col min-h-0">
          <h2 className="text-l font-bold">Technologies</h2>
          <div className="flex flex-wrap gap-1">
            {skills.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </section>
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Education</h2>
          {schools.map((school) => {
            return <SchoolCard key={school.institutionName} school={school} />;
          })}
        </section>
      </section>
    </main>
  );
}
