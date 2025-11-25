import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { LinkedInIconButton } from "@/components/linkedin-icon-button";

const meta = {
  title: "LinkedInIconButton",
  component: LinkedInIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LinkedInIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof LinkedInIconButton> = ({ href }) => (
  <LinkedInIconButton href={href} />
);

export const Primary: Story = {
  render: Template,
  args: {
    href: "https://www.linkedin.com/in/jeremykreutzbender/",
  },
};
