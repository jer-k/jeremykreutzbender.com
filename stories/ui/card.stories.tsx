import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Storybook Card</CardTitle>
        <CardDescription>
          Cards group related content and actions.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Action
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This card uses the exported header, content, and footer slots.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>Compact card spacing.</CardDescription>
      </CardHeader>
      <CardContent>Useful for dense interfaces.</CardContent>
    </Card>
  ),
};
