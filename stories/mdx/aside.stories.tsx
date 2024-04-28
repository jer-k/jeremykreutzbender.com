import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { Aside } from "@/components/mdx/aside";

const meta = {
  title: "MDX/Aside",
  component: Aside,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Aside>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Aside> = ({ heading }) => (
  <div className="prose">
    <Aside heading={heading}>This is an Aside in Storybook</Aside>
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    heading: "Storybook Aside",
  },
};
