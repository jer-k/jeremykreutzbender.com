import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { Hero } from "@/components/hero";

const meta = {
  title: "Hero",
  component: Hero,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Hero> = () => <Hero />;

export const Primary: Story = {
  render: Template,
};

export const Mobile: Story = {
  render: Template,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
