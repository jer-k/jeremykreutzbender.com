import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { TwitterIconButton } from "@/components/twitter-icon-button";

const meta = {
  title: "TwitterIconButton",
  component: TwitterIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TwitterIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof TwitterIconButton> = ({ href }) => (
  <TwitterIconButton href={href} />
);

export const Primary: Story = {
  render: Template,
  args: {
    href: "https://twitter.com/J_Kreutzbender",
  },
};
