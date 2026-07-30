import { describe, expect, it } from "vitest";

import type { PullRequest } from "@/lib/github";
import { groupOpenSourcePullRequests } from "@/lib/open-source";

function pullRequest(
  repository: string,
  number: number,
  mergedAt: string,
): PullRequest {
  const [owner, name] = repository.split("/");

  return {
    createdAt: "2024-01-01T00:00:00Z",
    mergedAt,
    number,
    title: `Pull request ${number}`,
    bodyHTML: "",
    permalink: `https://github.com/${repository}/pull/${number}`,
    repository: {
      name,
      nameWithOwner: repository,
      url: `https://github.com/${repository}`,
      owner: { login: owner },
    },
  };
}

describe("groupOpenSourcePullRequests", () => {
  it("groups by full repository name and sorts repositories by latest merge", () => {
    const groups = groupOpenSourcePullRequests([
      pullRequest("first-org/shared", 1, "2024-01-01T00:00:00Z"),
      pullRequest("second-org/shared", 2, "2024-04-01T00:00:00Z"),
      pullRequest("first-org/shared", 3, "2024-05-01T00:00:00Z"),
    ]);

    expect(groups.map(({ repository }) => repository.nameWithOwner)).toEqual([
      "first-org/shared",
      "second-org/shared",
    ]);
    expect(groups[0].pullRequests.map(({ number }) => number)).toEqual([3, 1]);
  });

  it("uses mergedAt for ordering even when createdAt is older", () => {
    const groups = groupOpenSourcePullRequests([
      {
        ...pullRequest("org/repo", 1, "2024-03-01T00:00:00Z"),
        createdAt: "2024-05-01T00:00:00Z",
      },
      {
        ...pullRequest("org/repo", 2, "2024-04-01T00:00:00Z"),
        createdAt: "2024-01-01T00:00:00Z",
      },
    ]);

    expect(groups[0].pullRequests.map(({ number }) => number)).toEqual([2, 1]);
    expect(groups[0].latestMergedAt).toBe("2024-04-01T00:00:00Z");
  });
});
