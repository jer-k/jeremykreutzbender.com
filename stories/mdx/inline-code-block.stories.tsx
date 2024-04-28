import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { InlineCodeBlock } from "@/components/mdx/inline-code-block";

const meta = {
  title: "MDX/InlineCodeBlock",
  component: InlineCodeBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof InlineCodeBlock> = () => (
  <div className="prose">
    <p>
      This is
      <InlineCodeBlock>an inline code block</InlineCodeBlock>
      in Storybook
    </p>
  </div>
);

export const Primary: Story = {
  render: Template,
};
