import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";

import { ThemeProvider } from "@/lib/theme-provider";

import "../app/globals.css";

const preview: Preview = {
  decorators: [
    (Story, context) =>
      createElement(
        ThemeProvider,
        {
          attribute: "class",
          defaultTheme: context.globals.theme,
          enableSystem: false,
          forcedTheme: context.globals.theme,
        },
        createElement(
          "div",
          {
            className:
              "min-h-screen bg-background p-4 text-foreground transition-colors",
          },
          createElement(Story),
        ),
      ),
  ],
  globalTypes: {
    theme: {
      description: "Global color theme",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        title: "Theme",
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
