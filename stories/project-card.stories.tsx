import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { ProjectCard } from "@/components/cv/project-card";

const meta = {
  title: "ProjectCard",
  component: ProjectCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof ProjectCard> = (args) => (
  <div className="w-full max-w-xl">
    <ProjectCard project={args.project} />
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    project: {
      name: "Storybook Project",
      url: "https://storybook.jeremykreutzbender.com/",
      descriptionMarkdown:
        "A sample project card with **Markdown** content and a short list.\n\n- Built with React\n- Documented in Storybook",
    },
  },
};
