import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { BasicDiv } from "@/components/mdx/basic-div";

const meta = {
  title: "MDX/BasicDiv",
  component: BasicDiv,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BasicDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof BasicDiv> = (args) => (
  <BasicDiv text={args.text} />
);

export const Primary: Story = {
  render: Template,
  args: {
    text: "This is a basic MDX div.",
  },
};
