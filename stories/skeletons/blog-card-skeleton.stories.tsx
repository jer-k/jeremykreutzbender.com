import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { BlogCardSkeleton } from "@/components/skeletons/blog-card-skeleton";

const meta = {
  title: "Skeletons/BlogCardSkeleton",
  component: BlogCardSkeleton,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof BlogCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof BlogCardSkeleton> = () => (
  <div className="max-w-md">
    <BlogCardSkeleton />
  </div>
);

export const Primary: Story = {
  render: Template,
};
