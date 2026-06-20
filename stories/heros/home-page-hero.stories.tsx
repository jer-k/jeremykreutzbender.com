import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { HomePageHero } from "@/components/heros/home-page-hero";

const meta = {
  title: "Heros/HomePageHero",
  component: HomePageHero,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof HomePageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof HomePageHero> = () => <HomePageHero />;

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
