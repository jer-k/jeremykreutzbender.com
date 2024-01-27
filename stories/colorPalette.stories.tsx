import * as React from "react";

import type { Meta, StoryFn, StoryObj } from "@storybook/react";

type ColorPaletteProps = {
  name: string;
  className: string;
};
// eslint-disable-next-line react/display-name
const ColorPalette = React.forwardRef<HTMLDivElement, ColorPaletteProps>(
  ({ ...props }, ref) => {
    console.log("what are props?", props);
    const classNameString = `h-20 w-20 ${props.className}`;
    return (
      <div ref={ref} className={classNameString}>
        {props.name}
      </div>
    );
  },
);

const meta = {
  title: "ColorPalette",
  component: ColorPalette,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

// Don't quite understand what storybook is yelling about. Also the backgrounds aren't working so whatever
// @ts-ignore
export const Primary: Story = {
  render: () => (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <ColorPalette name="Midnight" className="bg-midnight" />
        <ColorPalette name="Twilight" className="bg-twilight" />
        <ColorPalette name="Dusk" className="bg-dusk" />
        <ColorPalette name="Cloud" className="bg-cloud" />
        <ColorPalette name="Fog" className="bg-fog" />
      </div>
      <div className="flex flex-row">
        <ColorPalette name="Radiance" className="bg-radiance" />
        <ColorPalette name="Warmth" className="bg-warmth" />
        <ColorPalette name="Shine" className="bg-shine" />
        <ColorPalette name="Gleam" className="bg-gleam" />
        <ColorPalette name="Bright" className="bg-bright" />
      </div>
    </div>
  ),
};
