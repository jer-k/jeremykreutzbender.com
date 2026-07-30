import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Mermaid,
  MermaidError,
  MermaidLoading,
} from "@/components/mdx/mermaid";

const meta = {
  title: "MDX/Mermaid",
  component: Mermaid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="prose w-200 max-w-full dark:prose-invert">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Mermaid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flowchart: Story = {
  args: {
    label: "Segment to ClickHouse pipeline",
    chart: `
flowchart LR
  Segment[Segment S3 Actions] --> S3[S3 Bucket]
  S3 --> Queue[Import Queue]
  Queue --> Track[Track Events]
  Queue --> Identify[Identify Events]
  Track --> Analytics[Analytics Views]
  Identify --> Analytics
`,
  },
};

export const Sequence: Story = {
  args: {
    label: "Webhook processing sequence",
    chart: `
sequenceDiagram
  participant Segment
  participant S3
  participant Worker
  participant ClickHouse

  Segment->>S3: Write event batch
  Worker->>S3: Fetch pending batch
  Worker->>ClickHouse: Insert normalized rows
  ClickHouse-->>Worker: Confirm ingest
`,
  },
};

export const Loading: Story = {
  args: {
    chart: "",
  },
  render: () => <MermaidLoading />,
};

export const Error: Story = {
  args: {
    chart: "",
  },
  render: () => (
    <MermaidError
      error="Parse error on line 2: Expected diagram syntax."
      label="Segment to ClickHouse pipeline"
    />
  ),
};
