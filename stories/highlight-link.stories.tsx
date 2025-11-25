import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { HighlightLink } from "@/components/highlight-link";

const meta = {
  title: "HighlightLink",
  component: HighlightLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HighlightLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof HighlightLink> = ({ href, label }) => (
  <HighlightLink href={href} label={label} />
);

export const Primary: Story = {
  render: Template,
  args: {
    href: "/storybook",
    label: "Storybook",
  },
};
