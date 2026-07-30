import type { Metadata } from "next";
import { OpenSourceGrid } from "@/components/open-source/open-source-grid";
import { openSourcePullRequests } from "@/lib/github";
import { groupOpenSourcePullRequests } from "@/lib/open-source";

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
    repository?: string;
  }>;
};

export default async function OpenSourcePage(props: OpenSourceProps) {
  const searchParams = await props.searchParams;
  const pullRequests = await openSourcePullRequests();
  const repositories = groupOpenSourcePullRequests(pullRequests);

  return (
    <OpenSourceGrid
      repositories={repositories}
      initialRepository={searchParams.repository}
    />
  );
}
