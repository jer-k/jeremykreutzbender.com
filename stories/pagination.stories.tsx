import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { Pagination } from "@/components/pagination";

const meta = {
  title: "Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Pagination> = ({ page, numPages, path }) => (
  <Pagination page={page} numPages={numPages} path={path} />
);

export const Primary: Story = {
  render: Template,
  args: {
    page: 1,
    numPages: 2,
    path: "/storybook",
  },
};
