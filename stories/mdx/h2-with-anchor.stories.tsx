import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { H2WithAnchor } from "@/components/mdx/h2-with-anchor";

const meta = {
  title: "MDX/H2WithAnchor",
  component: H2WithAnchor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H2WithAnchor>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof H2WithAnchor> = () => (
  <div className="prose">
    <H2WithAnchor>This is an H2 in Storybook</H2WithAnchor>
  </div>
);

export const Primary: Story = {
  render: Template,
};
