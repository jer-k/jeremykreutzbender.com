import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { Blockquote } from "@/components/mdx/blockquote";

const meta = {
  title: "MDX/Blockquote",
  component: Blockquote,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Blockquote> = () => (
  <div className="prose">
    <Blockquote>This is a Blockquote is Storybook</Blockquote>
  </div>
);

export const Primary: Story = {
  render: Template,
};
