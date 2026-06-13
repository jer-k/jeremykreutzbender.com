import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { GenericPageHero } from "@/components/heros/generic-page-hero";

const meta = {
  title: "Heros/GenericPageHero",
  component: GenericPageHero,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof GenericPageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof GenericPageHero> = (args) => (
  <GenericPageHero {...args} />
);

export const TitleOnly: Story = {
  render: Template,
  args: {
    title: "About",
  },
};

export const TitleAndSubtitle: Story = {
  render: Template,
  args: {
    title: "Blog",
    subtitle: "Thoughts on software engineering and more",
  },
};

export const WithChildren: Story = {
  render: Template,
  args: {
    title: "Contact",
    subtitle: "Get in touch",
    children: (
      <p className="text-muted-foreground mt-2">
        Fill out the form below and I will get back to you.
      </p>
    ),
  },
};

export const Mobile: Story = {
  render: Template,
  args: {
    title: "Blog",
    subtitle: "Thoughts on software engineering and more",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};