import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { ModeToggle } from "@/components/mode-toggle";

const meta = {
  title: "ModeToggle",
  component: ModeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof ModeToggle> = () => <ModeToggle />;

export const Primary: Story = {
  render: Template,
};
