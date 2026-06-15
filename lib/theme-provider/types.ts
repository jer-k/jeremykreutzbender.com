import type * as React from "react";

export type ThemeAttribute = `data-${string}` | "class";
export type ThemeValueMap = Record<string, string>;
export type ColorScheme = "light" | "dark";

export interface ThemeScriptProps
  extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  [dataAttribute: `data-${string}`]: string | undefined;
}

export interface UseThemeProps {
  themes: string[];
  forcedTheme?: string | undefined;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme?: string | undefined;
  resolvedTheme?: string | undefined;
  systemTheme?: ColorScheme | undefined;
}

export interface ThemeProviderProps extends React.PropsWithChildren<unknown> {
  themes?: string[] | undefined;
  forcedTheme?: string | undefined;
  enableSystem?: boolean | undefined;
  disableTransitionOnChange?: boolean | undefined;
  enableColorScheme?: boolean | undefined;
  storageKey?: string | undefined;
  defaultTheme?: string | undefined;
  attribute?: ThemeAttribute | ThemeAttribute[] | undefined;
  value?: ThemeValueMap | undefined;
  nonce?: string | undefined;
  scriptProps?: ThemeScriptProps | undefined;
}
