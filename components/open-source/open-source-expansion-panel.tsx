import { GitPullRequest, X } from "lucide-react";

import { OpenSourcePrItem } from "@/components/open-source/open-source-pr-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RepositoryContributionGroup } from "@/lib/open-source";

type OpenSourceExpansionPanelProps = {
  group: RepositoryContributionGroup;
  onClose: () => void;
};

export function OpenSourceExpansionPanel({
  group,
  onClose,
}: OpenSourceExpansionPanelProps) {
  const repositoryId = group.repository.nameWithOwner.replaceAll("/", "-");
  const triggerId = `repository-trigger-${repositoryId}`;
  const panelId = `repository-panel-${repositoryId}`;

  return (
    <Card
      aria-labelledby={`${triggerId}-title`}
      className="col-span-full overflow-visible"
      data-testid="repository-panel"
      id={panelId}
      role="region"
    >
      <div className="bg-background/95 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-2">
          <GitPullRequest
            aria-hidden="true"
            className="size-4 shrink-0 text-purple-500"
          />
          <a
            className="truncate rounded-sm text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            href={group.repository.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {group.repository.nameWithOwner}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span className="text-muted-foreground shrink-0 text-xs">
            {group.pullRequests.length} merged PR
            {group.pullRequests.length === 1 ? "" : "s"}
          </span>
        </div>
        <Button
          aria-label={`Collapse ${group.repository.nameWithOwner}`}
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <div className="p-2">
        {group.pullRequests.map((pullRequest, index) => (
          <div
            key={`${pullRequest.repository.nameWithOwner}-${pullRequest.number}`}
          >
            <OpenSourcePrItem pullRequest={pullRequest} />
            {index < group.pullRequests.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </Card>
  );
}
