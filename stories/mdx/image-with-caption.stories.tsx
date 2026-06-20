import type { Meta, StoryObj } from "@storybook/nextjs";

import { ImageWithCaption } from "@/components/mdx/image-with-caption";

const meta = {
  title: "MDX/Image",
  component: ImageWithCaption,
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
} satisfies Meta<typeof ImageWithCaption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCaption: Story = {
  args: {
    src: "/post_images/cutting-build-time-in-half-docker-buildx-kubernetes/release-builder-architecture.png",
    alt: "A builder architecture diagram",
    caption: "BuildKit builder architecture used for cached Docker builds.",
  },
};

export const WithoutCaption: Story = {
  args: {
    src: "/cliff.png",
    alt: "A cliff at sunset",
  },
};
