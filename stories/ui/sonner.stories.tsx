import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toaster />
      <Button onClick={() => toast.success("Storybook toast")}>Success</Button>
      <Button variant="outline" onClick={() => toast.error("Something failed")}>
        Error
      </Button>
    </div>
  ),
};
