import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { TagSelect } from "@/components/tag-select";

const meta = {
  title: "TagSelect",
  component: TagSelect,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/blog",
        query: {},
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TagSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof TagSelect> = (args) => (
  <div className="w-96 max-w-full">
    <TagSelect tags={args.tags} />
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    tags: [
      "react",
      "nextjs",
      "storybook",
      "typescript",
      "tailwind",
      "testing",
      "design-systems",
      "rails",
      "postgres",
    ],
  },
};
