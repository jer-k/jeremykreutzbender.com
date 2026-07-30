import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpenSourceGridSkeleton } from "@/components/skeletons/open-source-grid-skeleton";

const meta = {
  title: "Open Source/Grid Skeleton",
  component: OpenSourceGridSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceGridSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
