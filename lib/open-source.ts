import type { PullRequest } from "@/lib/github";

export type OpenSourceRepository = PullRequest["repository"];

export type RepositoryContributionGroup = {
  repository: OpenSourceRepository;
  pullRequests: PullRequest[];
  latestMergedAt: string;
  latestPullRequest: PullRequest;
};

export function contributionDate(pullRequest: PullRequest) {
  return pullRequest.mergedAt || pullRequest.createdAt;
}

function newestFirst(left: PullRequest, right: PullRequest) {
  return (
    new Date(contributionDate(right)).getTime() -
    new Date(contributionDate(left)).getTime()
  );
}

export function groupOpenSourcePullRequests(
  pullRequests: PullRequest[],
): RepositoryContributionGroup[] {
  const groups = new Map<string, PullRequest[]>();

  for (const pullRequest of pullRequests) {
    const key = pullRequest.repository.nameWithOwner;
    const repositoryPullRequests = groups.get(key) ?? [];
    repositoryPullRequests.push(pullRequest);
    groups.set(key, repositoryPullRequests);
  }

  return [...groups.entries()]
    .map(([nameWithOwner, repositoryPullRequests]) => {
      const sortedPullRequests = [...repositoryPullRequests].sort(newestFirst);
      const latestPullRequest = sortedPullRequests[0];

      return {
        repository: {
          ...latestPullRequest.repository,
          nameWithOwner,
        },
        pullRequests: sortedPullRequests,
        latestMergedAt: contributionDate(latestPullRequest),
        latestPullRequest,
      };
    })
    .sort(
      (left, right) =>
        new Date(right.latestMergedAt).getTime() -
        new Date(left.latestMergedAt).getTime(),
    );
}

export function formatContributionDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
