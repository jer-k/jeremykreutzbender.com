import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { SchoolCard } from "@/components/cv/school-card";

const meta = {
  title: "SchoolCard",
  component: SchoolCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SchoolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof SchoolCard> = (args) => (
  <div className="w-full max-w-xl">
    <SchoolCard school={args.school} />
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    school: {
      institutionName: "Storybook University",
      institutionUrl: "https://storybook.js.org/",
      department: "Component Systems",
      departmentUrl: "https://storybook.js.org/docs",
      location: "Remote",
      locationUrl: "https://storybook.js.org/",
      duration: "2018 - 2022",
      degree: "BS",
      achievement: "Design Systems Engineering",
    },
  },
};
