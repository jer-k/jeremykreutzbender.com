import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { GithubIconButton } from "@/components/github-icon-button";

const meta = {
  title: "GitHubIconButton",
  component: GithubIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GithubIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof GithubIconButton> = ({ href }) => (
  <GithubIconButton href={href} />
);

export const Primary: Story = {
  render: Template,
  args: {
    href: "https://github.com/jer-k",
  },
};
