import type { Metadata } from "next";

import { openSourcePullRequests } from "@/lib/github";

import { PullRequestCard } from "@/components/pull-request-card";

export const metadata: Metadata = {
  title: "Open Source",
  description: "My open source contributions",
  openGraph: {
    title: "Open Source - Jeremy Kreutzbender",
    description: "My open source contributions",
    url: "https://jeremykreutzbender.com/open_source",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Open Source",
        width: 960,
        height: 540,
        alt: "Open Source page",
        type: "image/png",
      },
    ],
  },
};

export default async function OpenSourcePage() {
  const pullRequests = await openSourcePullRequests();

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-primary dark:text-bright font-bold text-3xl">
        Open Source Contributions
      </h1>
      <div className="prose">
        <div className="flex flex-col space-y-6 not-prose">
          {pullRequests.map((pullRequest) => (
            <PullRequestCard
              key={pullRequest.number}
              pullRequest={pullRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
