import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[75px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4" />
        <div className="flex flex-row items-center justify-end w-full">
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
