import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { BlogCard } from "@/components/blog-card";

const meta = {
  title: "BlogCard",
  component: BlogCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof BlogCard> = (args) => (
  <BlogCard post={args.post} />
);

export const Primary: Story = {
  render: Template,
  args: {
    post: {
      draft: false,
      title: "Storybook Blog Post",
      slug: "/storybook",
      date: "01-01-0000",
      tags: [],
      description: "A Storybook version of a BlogPost component",
      content: "",
    },
  },
};

export const ExternalBlogPost: Story = {
  render: Template,
  args: {
    post: {
      draft: false,
      title: "Storybook Blog Post",
      slug: "/storybook",
      date: "01-01-0000",
      tags: [],
      description: "A Storybook version of a BlogPost component",
      content: "",
      href: "https://storybook.jeremykreutzbender.com/",
    },
  },
};
