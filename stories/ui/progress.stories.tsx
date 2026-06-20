import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: 64,
  },
  render: (args) => (
    <Progress value={args.value} className="w-80">
      <ProgressLabel>Story coverage</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
};
