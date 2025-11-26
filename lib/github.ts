import "server-only";

import { Octokit } from "@octokit/core";
import { paginateGraphQL } from "@octokit/plugin-paginate-graphql";
import { ReactNode } from "react";

const MyOctokit = Octokit.plugin(paginateGraphQL);

const octokit = new MyOctokit({ auth: process.env.GITHUB_API_TOKEN });

export type PullRequest = {
  createdAt: string;
  number: number;
  title: string;
  bodyHTML: ReactNode;
  permalink: string;
  repository: {
    name: string;
    nameWithOwner: string;
    url: string;
    owner: {
      login: string;
    };
  };
};

const pullRequestsQuery = `query openSourcePullRequests($cursor: String) {
  viewer {
    pullRequests(first: 100, after: $cursor, states: MERGED, orderBy: {field:CREATED_AT, direction:DESC}) {
      totalCount
      nodes {
        id
        createdAt
        number
        title
        bodyHTML
        closedAt
        permalink
        repository {
          id
          name
          nameWithOwner
          url
          owner {
            id
            login
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`;

function pageIterator(query: string) {
  return octokit.graphql.paginate.iterator(query);
}

export async function openSourcePullRequests(): Promise<PullRequest[]> {
  let pullRequests: PullRequest[] = [];
  for await (const response of pageIterator(pullRequestsQuery)) {
    pullRequests = response.viewer.pullRequests.nodes;
  }
  return pullRequests.filter(
    (pullRequest) => pullRequest.repository.owner.login !== "jer-k",
  );
}
