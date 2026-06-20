import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchIcon, SendIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div className="grid w-96 max-w-full gap-3">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search posts" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Message" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Send message" size="icon-xs">
            <SendIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Internal note</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea placeholder="Write a longer note..." />
      </InputGroup>
    </div>
  ),
};
