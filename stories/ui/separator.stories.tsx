import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "@/components/ui/separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <h3 className="text-sm font-medium">Section title</h3>
        <p className="text-sm text-muted-foreground">Supporting content.</p>
      </div>
      <Separator />
      <div className="flex h-12 items-center gap-4">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};
