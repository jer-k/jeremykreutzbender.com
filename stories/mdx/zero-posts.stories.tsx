import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { ZeroPosts } from "@/components/mdx/zero-posts";

const meta = {
  title: "MDX/ZeroPosts",
  component: ZeroPosts,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ZeroPosts>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof ZeroPosts> = (args) => (
  <div className="prose dark:prose-invert">
    <ZeroPosts currentSlug={args.currentSlug} />
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    currentSlug: "setting-up-rocicorp-zero-with-rails",
  },
};
