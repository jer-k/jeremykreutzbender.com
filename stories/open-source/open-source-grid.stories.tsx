import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpenSourceGrid } from "@/components/open-source/open-source-grid";
import { groupOpenSourcePullRequests } from "@/lib/open-source";

const repositories = groupOpenSourcePullRequests([
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
  {
    createdAt: "2026-05-01T10:00:00Z",
    mergedAt: "2026-05-20T10:00:00Z",
    number: 18,
    title: "Improve the setup guide",
    bodyHTML: "",
    permalink: "https://github.com/another/project/pull/18",
    repository: {
      name: "project",
      nameWithOwner: "another/project",
      url: "https://github.com/another/project",
      owner: { login: "another" },
    },
  },
]);

const meta = {
  title: "Open Source/Grid",
  component: OpenSourceGrid,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = { args: { repositories } };

export const DeepLinked: Story = {
  args: { repositories, initialRepository: "example/project" },
};
