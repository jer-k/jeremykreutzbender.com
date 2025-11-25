import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs";

import { ContactForm } from "@/components/contact-form";

const meta = {
  title: "ContactForm",
  component: ContactForm,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof ContactForm> = () => <ContactForm />;

export const Primary: Story = {
  render: Template,
};
