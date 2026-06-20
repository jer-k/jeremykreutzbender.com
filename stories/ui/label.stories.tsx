import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="storybook-label-email">Email</Label>
      <Input id="storybook-label-email" placeholder="you@example.com" />
    </div>
  ),
};
