import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { PublishedOnOldBlog } from "@/components/mdx/published-on-old-blog";

const meta = {
  title: "MDX/PublishedOnOldBlog",
  component: PublishedOnOldBlog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PublishedOnOldBlog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof PublishedOnOldBlog> = () => (
  <div className="prose">
    <PublishedOnOldBlog />
  </div>
);

export const Primary: Story = {
  render: Template,
};
