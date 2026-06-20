import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { BlogList } from "@/components/blog-list";

const posts = [
  {
    draft: false,
    title: "Building Component Parity",
    slug: "/component-parity",
    date: "2026-01-01",
    tags: ["storybook", "components"],
    description: "How Storybook helps keep visual states documented.",
    content: "",
  },
  {
    draft: false,
    title: "External Writing Sample",
    slug: "/external-writing-sample",
    date: "2026-02-01",
    tags: ["writing"],
    description: "A linked post hosted elsewhere.",
    content: "",
    href: "https://storybook.jeremykreutzbender.com/",
  },
];

const meta = {
  title: "BlogList",
  component: BlogList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogList>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof BlogList> = (args) => (
  <div className="w-full max-w-2xl">
    <BlogList posts={args.posts} />
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    posts,
  },
};

export const Empty: Story = {
  render: Template,
  args: {
    posts: [],
  },
};
