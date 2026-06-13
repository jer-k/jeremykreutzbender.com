import type { Metadata } from "next";
import { Pagination } from "@/components/pagination";
import { PullRequestCard } from "@/components/pull-request-card";
import { openSourcePullRequests } from "@/lib/github";

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
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function OpenSourcePage(props: OpenSourceProps) {
  const searchParams = await props.searchParams;
  const pullRequests = await openSourcePullRequests();

  const page = (searchParams.page && parseInt(searchParams.page)) || 1;
  const start = (page - 1) * 25;
  const numPages = Math.ceil(pullRequests.length / 25);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
      {pullRequests.slice(start, start + 25).map((pullRequest) => (
        <PullRequestCard
          key={`${pullRequest.repository.name}-${pullRequest.number}`}
          pullRequest={pullRequest}
        />
      ))}
      <Pagination page={page} numPages={numPages} path="open_source" />
    </div>
  );
}
