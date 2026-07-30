import { Skeleton } from "@/components/ui/skeleton";

export function OpenSourceGridSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="ring-foreground/10 flex min-h-52 flex-col gap-4 rounded-xl p-5 ring-1"
          key={index}
        >
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="size-4 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="mt-auto space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
