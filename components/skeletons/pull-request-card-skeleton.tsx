import { Skeleton } from "@/components/ui/skeleton";

export function PullRequestCardSkeleton() {
  return (
    <div className="flex items-center space-x-4 w-full">
      <div className="space-y-2 border-2 w-full">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/8" />
      </div>
    </div>
  );
}
