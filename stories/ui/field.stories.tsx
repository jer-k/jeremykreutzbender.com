import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Field",
  component: Field,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <FieldSet className="w-96 max-w-full">
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="storybook-field-name">Name</FieldLabel>
          <Input id="storybook-field-name" placeholder="Jeremy" />
          <FieldDescription>This appears on public pages.</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Email updates</FieldTitle>
            <FieldDescription>
              Receive occasional site updates.
            </FieldDescription>
          </FieldContent>
          <input type="checkbox" aria-label="Email updates" />
        </Field>
        <FieldSeparator>Validation</FieldSeparator>
        <Field data-invalid="true">
          <FieldLabel htmlFor="storybook-field-slug">Slug</FieldLabel>
          <Input
            id="storybook-field-slug"
            aria-invalid
            defaultValue="Invalid Slug"
          />
          <FieldError>Use lowercase letters and hyphens only.</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
