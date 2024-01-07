import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Button> = (args) => <Button>Button</Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  render: Template,
};

export const Variants: Story = {
  render: () => (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
    </>
  ),
};
