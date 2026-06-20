import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      <Input placeholder="Email address" type="email" />
      <Input aria-invalid placeholder="Invalid input" />
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
};
