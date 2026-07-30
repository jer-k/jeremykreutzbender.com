import { GitMerge } from "lucide-react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { PullRequest } from "@/lib/github";
import { contributionDate, formatContributionDate } from "@/lib/open-source";

type OpenSourcePrItemProps = {
  pullRequest: PullRequest;
};

export function OpenSourcePrItem({ pullRequest }: OpenSourcePrItemProps) {
  const mergedAt = contributionDate(pullRequest);

  return (
    <Item className="hover:bg-muted/70">
      <ItemMedia className="self-start pt-0.5">
        <GitMerge aria-hidden="true" className="size-4 text-purple-500" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <a
            className="focus-visible:ring-ring rounded-sm outline-none hover:underline focus-visible:ring-2"
            href={pullRequest.permalink}
            rel="noopener noreferrer"
            target="_blank"
          >
            {pullRequest.title}
          </a>
        </ItemTitle>
        <ItemDescription>
          <span>#{pullRequest.number}</span>
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <time dateTime={mergedAt}>{formatContributionDate(mergedAt)}</time>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
