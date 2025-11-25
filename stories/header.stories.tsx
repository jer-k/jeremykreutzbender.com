import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { Header } from "@/components/header";

const meta = {
  title: "Header",
  component: Header,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Header> = () => <Header />;

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
