import type { Metadata } from "next";

import { openSourcePullRequests } from "@/lib/github";

import { PullRequestCard } from "@/components/pull-request-card";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Open Source",
  description: "My open source contributions",
  alternates: {
    canonical: "https://jeremykreutzbender.com/open_source",
  },
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

type OpenSourceProps = {
  searchParams: {
    page?: string;
  };
};

export default async function OpenSourcePage({
  searchParams,
}: OpenSourceProps) {
  const pullRequests = await openSourcePullRequests();

  const page = (searchParams.page && parseInt(searchParams.page)) || 1;
  const start = (page - 1) * 10;
  const numPages = Math.ceil(pullRequests.length / 10);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-primary dark:text-bright font-bold text-3xl">
        Open Source Contributions
      </h1>
      <div className="prose">
        <div className="flex flex-col space-y-6 not-prose">
          {pullRequests.slice(start, start + 10).map((pullRequest) => (
            <PullRequestCard
              key={pullRequest.number}
              pullRequest={pullRequest}
            />
          ))}
          <Pagination page={page} numPages={numPages} path="open_source" />
        </div>
      </div>
    </div>
  );
}
