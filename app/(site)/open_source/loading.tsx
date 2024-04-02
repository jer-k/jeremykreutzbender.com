import { PullRequestCardSkeleton } from "@/components/skeletons/pull-request-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl">Open Source Contributions</h1>
      <div className="flex flex-col space-y-4 w-full">
        <PullRequestCardSkeleton />
        <PullRequestCardSkeleton />
        <PullRequestCardSkeleton />
      </div>
    </div>
  );
}
