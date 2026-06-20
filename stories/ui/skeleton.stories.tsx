import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Skeleton } from "@/components/ui/skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};
