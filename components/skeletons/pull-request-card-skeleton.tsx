import { Skeleton } from "@/components/ui/skeleton";

export function PullRequestCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton className="h-25 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
      <Skeleton className="h-25" />
    </div>
  );
}
