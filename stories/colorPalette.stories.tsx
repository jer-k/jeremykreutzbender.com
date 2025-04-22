import * as React from "react";
import { Tweet } from "react-tweet";

import type { Meta, StoryFn, StoryObj } from "@storybook/react";

const meta = {
  title: "ColorPalette",
  component: React.Fragment,
  parameters: {},
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<unknown> = () => (
  <React.Fragment>
    <div className="flex flex-row w-full space-x-4">
      <div className="flex flex-col">
        <h2>
          Color Palette from{" "}
          <a href="https://twitter.com/pjscow" target="_blank">
            @pjscow
          </a>
        </h2>
        <Tweet id="1732809863288213630" />
      </div>
      <div className="flex">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="h-20 w-20 bg-midnight">Midnight</div>
            <div className="h-20 w-20 bg-twilight">Twilight</div>
            <div className="h-20 w-20 bg-dusk">Dusk</div>
            <div className="h-20 w-20 bg-cloud">Cloud</div>
            <div className="h-20 w-20 bg-fog">Fog</div>
          </div>
          <div className="flex flex-row">
            <div className="h-20 w-20 bg-radiance">Radiance</div>
            <div className="h-20 w-20 bg-warmth">Warmth</div>
            <div className="h-20 w-20 bg-shine">Shine</div>
            <div className="h-20 w-20 bg-gleam">Gleam</div>
            <div className="h-20 w-20 bg-bright">Bright</div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export const Primary: Story = {
  render: Template,
};
