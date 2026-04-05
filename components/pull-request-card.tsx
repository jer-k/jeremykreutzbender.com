import dayjs from "dayjs";
import { GitMerge } from "lucide-react";

import type { PullRequest } from "@/lib/github";

type PullRequestCardProps = {
  pullRequest: PullRequest;
};

export function PullRequestCard({ pullRequest }: PullRequestCardProps) {
  return (
    <a
      href={pullRequest.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <article className="group py-4">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-2xl font-semibold group-hover:underline flex items-start gap-2">
              <GitMerge className="h-5 w-5 shrink-0 stroke-purple-500 mt-1.5" />
              {pullRequest.title}
            </h3>
            {pullRequest.bodyHTML && (
              <div
                className="text-muted-foreground mt-2 line-clamp-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: pullRequest.bodyHTML }}
              />
            )}
          </div>
          <div className="flex flex-row gap-2 text-sm">
            <span>{dayjs(pullRequest.createdAt).format("YYYY-MM-DD")}</span>
            <span>{pullRequest.repository.nameWithOwner}</span>
            <span>#{pullRequest.number}</span>
          </div>
        </div>
      </article>
    </a>
  );
}
