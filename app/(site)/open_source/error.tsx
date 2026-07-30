"use client";

import { RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function OpenSourceError({ reset }: { reset: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <TriangleAlert aria-hidden="true" className="size-5" />
        </EmptyMedia>
        <EmptyTitle>Couldn&apos;t load open source contributions</EmptyTitle>
        <EmptyDescription>
          GitHub may be temporarily unavailable. Try loading the page again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reset} variant="outline">
          <RefreshCcw aria-hidden="true" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}
