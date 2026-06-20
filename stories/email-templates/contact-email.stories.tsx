import type { Meta, StoryFn, StoryObj } from "@storybook/nextjs-vite";

import { ContactEmail } from "@/components/email_templates/contact-email";

const meta = {
  title: "EmailTemplates/ContactEmail",
  component: ContactEmail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContactEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof ContactEmail> = (args) => (
  <ContactEmail
    fullName={args.fullName}
    emailAddress={args.emailAddress}
    message={args.message}
  />
);

export const Primary: Story = {
  render: Template,
  args: {
    fullName: "Storybook Visitor",
    emailAddress: "visitor@example.com",
    message: "This is a rendered contact email template in Storybook.",
  },
};
