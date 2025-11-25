import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { PullRequestCardSkeleton } from "@/components/skeletons/pull-request-card-skeleton";

const meta = {
  title: "Skeletons/PullRequestCardSkeleton",
  component: PullRequestCardSkeleton,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof PullRequestCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof PullRequestCardSkeleton> = () => (
  <div className="max-w-md">
    <PullRequestCardSkeleton />
  </div>
);

export const Primary: Story = {
  render: Template,
};
