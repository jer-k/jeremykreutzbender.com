import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpenSourceRepositoryCard } from "@/components/open-source/open-source-repository-card";
import { groupOpenSourcePullRequests } from "@/lib/open-source";

const [group] = groupOpenSourcePullRequests([
  {
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
]);

const meta = {
  title: "Open Source/Repository Card",
  component: OpenSourceRepositoryCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceRepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: { group, isActive: false, onSelect: () => {}, triggerRef: () => {} },
};

export const Active: Story = {
  args: { group, isActive: true, onSelect: () => {}, triggerRef: () => {} },
};
