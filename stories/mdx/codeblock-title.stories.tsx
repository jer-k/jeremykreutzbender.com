import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { CodeblockTitle } from "@/components/mdx/codeblock-title";

const meta = {
  title: "MDX/CodeblockTitle",
  component: CodeblockTitle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CodeblockTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof CodeblockTitle> = (args) => (
  <div className="w-96 max-w-full">
    <CodeblockTitle>{args.children}</CodeblockTitle>
    <pre className="rounded-b-md bg-solarized-light p-4 text-sm text-solarized-light-foreground dark:bg-solarized-dark dark:text-solarized-dark-foreground">
      <code>{"npm run storybook"}</code>
    </pre>
  </div>
);

export const Primary: Story = {
  render: Template,
  args: {
    children: "package.json",
  },
};
