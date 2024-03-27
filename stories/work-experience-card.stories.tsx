import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { WorkExperienceCard } from "@/components/work-experience-card";

const meta = {
  title: "WorkExperienceCard",
  component: WorkExperienceCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WorkExperienceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof WorkExperienceCard> = (args) => (
  <WorkExperienceCard
    companyName={args.companyName}
    companyUrl={args.companyUrl}
    workType={args.workType}
    duration={args.duration}
    title={args.title}
    description={args.description}
  />
);

export const Primary: Story = {
  render: Template,
  args: {
    companyName: "Jeremy Kreutzbender's Storybook",
    companyUrl: "https://storybook.jeremykreutzbender.com/",
    workType: "Remote",
    duration: "Present",
    title: "Storybook Engineer",
    description: <div>Writing Storybook Components</div>,
  },
};
