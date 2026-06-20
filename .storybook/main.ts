import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: ["@storybook/addon-links"],

  staticDirs: ["../public"],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};
export default config;
