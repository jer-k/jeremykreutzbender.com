import dayjs from "dayjs";
import { GitMerge } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { PullRequest } from "@/lib/github";

type PullRequestCardProps = {
  pullRequest: PullRequest;
};

export function PullRequestCard({ pullRequest }: PullRequestCardProps) {
  return (
    <article className="w-full">
      <Card className="relative block">
        <a
          className="absolute inset-0"
          href={pullRequest.permalink}
          target="_blank"
        />
        <CardTitle className="flex flex-row p-6 pb-2 space-x-2">
          <GitMerge className="stroke-purple-500" />
          <div>{pullRequest.title}</div>
        </CardTitle>
        <CardContent>
          <div className="flex flex-col items-start space-y-4">
            <div>
              <div className="flex flex-row items-center space-x-1">
                <div className="font-semibold">Repository</div>
                <a
                  className="text-blue-600 z-50"
                  href={pullRequest.repository.url}
                  target="_blank"
                >
                  {pullRequest.repository.nameWithOwner}
                </a>
              </div>
              <div className="flex flex-row items-center space-x-1">
                <div className="font-semibold">#{pullRequest.number}</div>
                <div>by</div>
                <a
                  className="text-blue-600 z-50"
                  href="https://github.com/jer-k"
                  target="_blank"
                >
                  jer-k
                </a>
                <div>|</div>
                <div className="font-semibold">
                  {dayjs(pullRequest.createdAt).format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            {pullRequest.bodyHTML && (
              <div className="text-sm text-muted-foreground w-full">
                <div
                  dangerouslySetInnerHTML={{ __html: pullRequest.bodyHTML }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
