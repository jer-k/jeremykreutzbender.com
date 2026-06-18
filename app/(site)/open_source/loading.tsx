import { PullRequestCardSkeleton } from "@/components/skeletons/pull-request-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
      <PullRequestCardSkeleton />
      <PullRequestCardSkeleton />
      <PullRequestCardSkeleton />
    </div>
  );
}
