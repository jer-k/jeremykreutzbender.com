import * as React from "react";

import { themeScript } from "./theme-script";
import type { ThemeProviderProps } from "./types";

const isServer = typeof window === "undefined";

type ThemeScriptElementProps = Omit<ThemeProviderProps, "children"> & {
  defaultTheme: string;
};

export const ThemeScriptElement = React.memo(function ThemeScriptElement({
  forcedTheme,
  storageKey,
  attribute,
  enableSystem,
  enableColorScheme,
  defaultTheme,
  value,
  themes,
  nonce,
  scriptProps,
}: ThemeScriptElementProps) {
  if (!isServer) {
    return null;
  }

  const scriptArgs = JSON.stringify([
    attribute,
    storageKey,
    defaultTheme,
    forcedTheme,
    themes,
    value,
    enableSystem,
    enableColorScheme,
  ]).slice(1, -1);

  return (
    <script
      {...scriptProps}
      suppressHydrationWarning
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `(${themeScript.toString()})(${scriptArgs})`,
      }}
    />
  );
});
