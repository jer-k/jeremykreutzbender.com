import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpenSourcePrItem } from "@/components/open-source/open-source-pr-item";

const meta = {
  title: "Open Source/PR Item",
  component: OpenSourcePrItem,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourcePrItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    pullRequest: {
      createdAt: "2026-07-01T10:00:00Z",
      mergedAt: "2026-07-29T10:00:00Z",
      number: 42,
      title: "Add support for repository contributions",
      bodyHTML: "",
      permalink: "https://github.com/example/project/pull/42",
      repository: {
        name: "project",
        nameWithOwner: "example/project",
        url: "https://github.com/example/project",
        owner: { login: "example" },
      },
    },
  },
};
