import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "@/components/header";

const meta = {
  title: "Header",
  component: Header,
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Header> = (args) => (
  <Header>{args.children}</Header>
);

export const Primary: Story = {
  render: Template,
  args: {
    children: (
      <div className="rounded-xl border bg-card p-8 text-card-foreground">
        <h1 className="text-3xl font-semibold">Storybook Header</h1>
        <p className="mt-2 text-muted-foreground">
          Header content appears above the decorative background layer.
        </p>
      </div>
    ),
  },
};
