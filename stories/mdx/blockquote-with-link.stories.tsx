import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { BlockquoteWithLink } from "@/components/mdx/blockquote-with-link";

const meta = {
  title: "MDX/BlockquoteWithLink",
  component: BlockquoteWithLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlockquoteWithLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof BlockquoteWithLink> = (args) => (
  <div className="prose dark:prose-invert">
    <BlockquoteWithLink link={args.link} linkText={args.linkText}>
      Storybook makes component states visible before they become bugs.
    </BlockquoteWithLink>
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    link: "https://storybook.js.org/",
    linkText: "Storybook documentation",
  },
};
