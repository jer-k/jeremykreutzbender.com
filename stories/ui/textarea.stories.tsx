import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => <Textarea className="w-80" placeholder="Write a message..." />,
};
