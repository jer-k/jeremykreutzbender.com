import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { Footer } from "@/components/footer";

const meta = {
  title: "Footer",
  component: Footer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Footer> = () => <Footer />;

export const Primary: Story = {
  render: Template,
};
