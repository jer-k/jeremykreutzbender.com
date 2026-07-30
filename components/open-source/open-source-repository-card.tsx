import { ChevronDown, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { RepositoryContributionGroup } from "@/lib/open-source";
import { contributionDate, formatContributionDate } from "@/lib/open-source";
import { cn } from "@/lib/utils";

type OpenSourceRepositoryCardProps = {
  group: RepositoryContributionGroup;
  isActive: boolean;
  onSelect: () => void;
  triggerRef: (element: HTMLButtonElement | null) => void;
};

export function OpenSourceRepositoryCard({
  group,
  isActive,
  onSelect,
  triggerRef,
}: OpenSourceRepositoryCardProps) {
  const { latestPullRequest, repository } = group;
  const repositoryId = repository.nameWithOwner.replaceAll("/", "-");
  const triggerId = `repository-trigger-${repositoryId}`;
  const panelId = `repository-panel-${repositoryId}`;
  const mergedAt = contributionDate(latestPullRequest);

  return (
    <Card
      className={cn(
        "relative min-h-52 p-5 transition-colors duration-200 hover:bg-muted/50",
        isActive && "bg-muted/70 ring-primary/60",
      )}
      data-active={isActive}
      data-testid={`repository-card-${repository.nameWithOwner}`}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isActive}
        aria-labelledby={`${triggerId}-title`}
        className="absolute inset-0 z-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        id={triggerId}
        onClick={onSelect}
        ref={triggerRef}
        type="button"
      />
      <div className="relative z-10 grid h-full min-h-42 grid-rows-[2.75rem_auto_1fr] pointer-events-none">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="h-11 min-w-0 overflow-hidden text-base font-semibold leading-snug"
            id={`${triggerId}-title`}
          >
            <a
              className="pointer-events-auto inline-flex max-w-full items-start gap-1.5 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              href={repository.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="min-w-0 break-words line-clamp-2">
                {repository.nameWithOwner}
              </span>
              <ExternalLink
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </h2>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200",
              isActive && "rotate-180 text-foreground",
            )}
          />
        </div>
        <div className="mt-4 flex flex-col items-start gap-1.5 text-sm">
          <Badge className="pointer-events-none" variant="secondary">
            {group.pullRequests.length} merged PR
            {group.pullRequests.length === 1 ? "" : "s"}
          </Badge>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="text-muted-foreground">Latest merge:</span>
            <time className="text-muted-foreground" dateTime={mergedAt}>
              {formatContributionDate(mergedAt)}
            </time>
          </div>
        </div>
        <div className="self-end min-w-0 pt-6">
          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Latest PR
          </div>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
            {latestPullRequest.title}
          </p>
        </div>
      </div>
    </Card>
  );
}
