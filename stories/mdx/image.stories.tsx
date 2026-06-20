import type { Meta, StoryObj } from "@storybook/nextjs";

import { MdxImage } from "@/components/mdx/image";

const meta = {
  title: "MDX/MdxImage",
  component: MdxImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="prose w-160 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MdxImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AnimatedGif: Story = {
  args: {
    src: "/post_images/failed-attempt-at-a-side-project/audit-logs-vid.gif",
    alt: "Audit log filters being changed",
    width: 900,
    height: 492,
  },
};

export const StaticImage: Story = {
  args: {
    src: "/post_images/failed-attempt-at-a-side-project/loan-structure.png",
    alt: "A loan structure interface",
    width: 806,
    height: 658,
    maxWidth: 500,
  },
};
