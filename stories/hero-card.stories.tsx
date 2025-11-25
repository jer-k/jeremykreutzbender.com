import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { HeroCard } from "@/components/hero-card";

const meta = {
  title: "HeroCard",
  component: HeroCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof HeroCard> = ({
  title,
  description,
  href,
  externalLink,
}) => (
  <HeroCard
    title={title}
    description={description}
    href={href}
    externalLink={externalLink}
  />
);

export const Primary: Story = {
  render: Template,
  args: {
    title: "Storybook Hero Card",
    description: "This is a story",
    href: "/storybook",
    externalLink: false,
  },
};

export const ExternalHeroCard: Story = {
  render: Template,
  args: {
    title: "Storybook Hero Card",
    description: "This is a story",
    href: "/storybook",
    externalLink: true,
  },
};
