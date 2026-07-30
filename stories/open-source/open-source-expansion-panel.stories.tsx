import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpenSourceExpansionPanel } from "@/components/open-source/open-source-expansion-panel";
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
  {
    createdAt: "2026-06-01T10:00:00Z",
    mergedAt: "2026-06-15T10:00:00Z",
    number: 35,
    title: "Document the public contribution workflow",
    bodyHTML: "",
    permalink: "https://github.com/example/project/pull/35",
    repository: {
      name: "project",
      nameWithOwner: "example/project",
      url: "https://github.com/example/project",
      owner: { login: "example" },
    },
  },
]);

const meta = {
  title: "Open Source/Expansion Panel",
  component: OpenSourceExpansionPanel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceExpansionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { group, onClose: () => {} },
};
