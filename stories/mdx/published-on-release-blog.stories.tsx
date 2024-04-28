import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { PublishedOnReleaseBlog } from "@/components/mdx/published-on-release-blog";

const meta = {
  title: "MDX/PublishedOnReleaseBlog",
  component: PublishedOnReleaseBlog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PublishedOnReleaseBlog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof PublishedOnReleaseBlog> = () => (
  <div className="prose">
    <PublishedOnReleaseBlog />
  </div>
);

export const Primary: Story = {
  render: Template,
};
