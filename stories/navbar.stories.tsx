import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { Navbar } from "@/components/navbar";

const meta = {
  title: "Navbar",
  component: Navbar,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Navbar> = () => <Navbar />;

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
