import { Cv } from "@/types/cv";

export const cvData: Cv = {
  personalInfo: {
    name: "Jeremy Kreutzbender",
    location: "Portland, Oregon, United States",
    locationUrl: "https://www.google.com/maps/place/Portland,+OR",
    avatarUrl: "https://github.com/jer-k.png",
    avatarFallback: "JK",
  },
  about: {
    summary:
      "As a Software Engineer I have taken projects from initial idea to completion on my own as well as within a team. I have led projects as an engineer but also managed ticket writing and prioritization. I highly value collaboration and insights from my colleagues.",
  },
  jobs: [
    {
      companyName: "Vantage",
      companyUrl: "https://vantage.sh",
      workType: "Remote",
      duration: "February, 2025 - Present",
      title: "Staff Software Engineer",
      descriptionMarkdown: "",
    },
    {
      companyName: "Release",
      companyUrl: "https://release.com",
      workType: "Remote",
      duration: "March, 2020 - August, 2024",
      title: "Senior Software Engineer",
      descriptionMarkdown: `
*   Reduced build times by 50% by migrating [Docker](https://www.docker.com/) build system to [Buildkit](https://docs.docker.com/build/buildkit/) and [Bake](https://docs.docker.com/build/bake/)
*   Wrote tool to translate Docker [compose](https://docs.docker.com/compose/) files into Release Application Template YAML (similar to [kompose](https://kompose.io/)) which helped reduce onboarding time of new customers with compose files by 30%
*   Built a webhook processing system to ingest and normalize webhooks from GitHub, Gitlab, and Bitbucket. After normalization, created an average of 4,000 [Preview Environments](/blog/what-are-preview-environments) per month
*   Led project, including ticket writing and prioritization, to rebuild UI in [Next.js](https://nextjs.org/) with [Typescript](https://www.typescriptlang.org/) which reduced unhandled exceptions by 80%
*   Helped with implementation of [GraphQL](https://graphql.org/) on [Rails](https://rubyonrails.org/) backend and Next.js frontend to reduce cold page load times by an average of 20%. Utilized [stale-while-revalidate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate) to make navigation to previous pages instantaneous
*   Interfaced with customers to gather product requirements and triage bug reports
*   First Engineering hire and part of the founding Engineering team
      `,
    },
    {
      companyName: "TrueCar",
      companyUrl: "https://truecar.com",
      workType: "On-Site",
      duration: "January, 2014 - September, 2019",
      title: "Software Engineer II-IV",
      descriptionMarkdown: `
*   Rebuilt the [New Car](https://www.truecar.com/shop/new/) funnel ($200m/yr business at the time) with Rails backend and [React](https://react.dev/) frontend
    *   Reduced page load times from 3 seconds to sub 1 second (300% increase)
    *   Ran extensive A/B tests on each change to the UI to ensure the funnel conversion rate did not drop
*   Technical lead on an internal tool built with a Rails backend and React frontend to replace a week long manual [ETL](https://cloud.google.com/learn/what-is-etl) process of car data
    *   Helped build a data processing pipeline which processed new vehicle information daily instead of the weekly (700% increase)
    *   Helped build various data management UIs that consolidated multi-step and multi-person processes into single a single source of truth
    *   Built a publishing and ingesting system of the managed vehicle data. New data in the form of a [PostgreSQL](https://www.postgresql.org/) dump was uploaded to [S3](https://aws.amazon.com/pm/serv-s3/) and able to be made available multiple times a day instead of the previous weekly publish (> 700% increase)
*   Built native iOS application with [Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011210) for a new business initiative (Sell My Car) to help users sell their vehicles
    *   Helped build a dynamic screen building library which consumed an API to determine which screen to display to users after they answered vehicle related questions
    *   Managed internal state of user's data with [Core Data](https://developer.apple.com/documentation/coredata/) to ensure that progress was not lost if the application was closed
      `,
    },
    {
      companyName: "CarWoo!",
      workType: "On-Site",
      duration: "June, 2012 - December, 2013",
      title: "Software Engineer",
      descriptionMarkdown: `
*   Rebuilt a consumer funnel on the main website (Rails) seeing high abandonment rates and saw funnel conversion rate increase by 25%
*   Built an internal dashboard which aggregated events from the database into actionable tasks for the CarWoo! Account Managers increasing the speed at which they were able to resolve account issues by 50%
*   Built an iOS app to give car dealers a mobile first experience using CarWoo!
    *   Added data synchronization with Core Data so that the application was useful on car dealer lots where connectivity may have been low
    *   Built an in application messaging platform which saw dealer to consumer communication increase by 10%
    *   Built event handling system to launch the application to the correct screen when clicking on push notifications
      `,
    },
  ],
  projects: [
    {
      name: "jeremykreutzbender.com",
      url: "https://jeremykreutzbender.com",
      descriptionMarkdown: `
*   Personal website (you're on it right now!) built with Next.js App Router, React, and Typescript
*   I'm using this website as a platform for writing blog posts, learning Typescript, and a playground to try out new features in React and Next.js
      `,
    },
  ],
  skills: {
    languages: ["Ruby", "Javascript", "TypeScript", "Objective-C"],
    technologies: [
      "Ruby on Rails",
      "React",
      "Next.js",
      "GraphQL",
      "Docker",
      "Postgresql",
    ],
  },
  schools: [
    {
      institutionName: "Oregon State University",
      institutionUrl: "https://oregonstate.edu",
      department: "School of Electrical Engineering and Computer Science",
      departmentUrl: "https://engineering.oregonstate.edu/EECS",
      location: "Corvallis, Oregon, United States",
      locationUrl: "https://www.google.com/maps/place/Corvallis,+OR",
      duration: "September, 2008 - June, 2012",
      degree: "B.S. Computer Science",
      achievement: "Cum Laude",
    },
    {
      institutionName: "Amity High School",
      institutionUrl: "https://www.amity.k12.or.us/",
      location: "Amity, Oregon, United States",
      locationUrl: "https://www.google.com/maps/place/Amity,+OR",
      duration: "September, 2004 - June, 2008",
      achievement: "Valedictorian",
    },
  ],
};
