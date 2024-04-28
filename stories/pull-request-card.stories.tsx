import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { PullRequestCard } from "@/components/pull-request-card";
import { ReactNode } from "react";

const meta = {
  title: "PullRequestCard",
  component: PullRequestCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PullRequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof PullRequestCard> = ({ pullRequest }) => (
  <PullRequestCard pullRequest={pullRequest} />
);

export const Primary: Story = {
  render: Template,
  args: {
    pullRequest: {
      createdAt: "2024-04-28",
      number: 1,
      title: "Storybook Pull Request",
      bodyHTML: "<div>Pull Request Body</div>",
      permalink: "/storybook",
      repository: {
        name: "jeremykreutzbender.com",
        nameWithOwner: "jer-k/jeremykreutzbender.com",
        url: "https://github.com/jer-k/jeremykreutzbender.com",
        owner: {
          login: "jer-k",
        },
      },
    },
  },
};
