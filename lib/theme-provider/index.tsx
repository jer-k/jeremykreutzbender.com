"use client";

import * as React from "react";

import { defaultThemes, mediaQuery } from "./constants";
import { applyThemeToDocument } from "./dom";
import { getStoredTheme, saveTheme } from "./storage";
import {
  addMediaListener,
  getSystemTheme,
  removeMediaListener,
} from "./system-theme";
import { ThemeScriptElement } from "./theme-script-element";
import type { ColorScheme, ThemeProviderProps, UseThemeProps } from "./types";

export type { ThemeProviderProps, UseThemeProps } from "./types";

const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = {
  setTheme: () => {},
  themes: [],
};

export function useTheme() {
  return React.useContext(ThemeContext) ?? defaultContext;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const context = React.useContext(ThemeContext);

  if (context) {
    return <>{props.children}</>;
  }

  return <Theme {...props} />;
}

function Theme({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = "theme",
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
  scriptProps,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState(() =>
    getStoredTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = React.useState(() =>
    theme === "system" ? getSystemTheme() : theme,
  );

  const applyTheme = React.useCallback(
    (themeName: string | undefined) => {
      applyThemeToDocument({
        attribute,
        defaultTheme,
        disableTransitionOnChange,
        enableColorScheme,
        enableSystem,
        nonce,
        theme: themeName,
        themes,
        value,
      });
    },
    [
      attribute,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      nonce,
      themes,
      value,
    ],
  );

  const setTheme = React.useCallback<UseThemeProps["setTheme"]>(
    (nextTheme) => {
      setThemeState((currentTheme) => {
        const newTheme =
          typeof nextTheme === "function"
            ? nextTheme(currentTheme ?? defaultTheme)
            : nextTheme;
        saveTheme(storageKey, newTheme);
        return newTheme;
      });
    },
    [defaultTheme, storageKey],
  );

  const handleMediaQuery = React.useCallback(
    (event: MediaQueryList | MediaQueryListEvent) => {
      const resolved = getSystemTheme(event);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [applyTheme, enableSystem, forcedTheme, theme],
  );

  React.useEffect(() => {
    const media = window.matchMedia(mediaQuery);

    addMediaListener(media, handleMediaQuery);
    handleMediaQuery(media);

    return () => removeMediaListener(media, handleMediaQuery);
  }, [handleMediaQuery]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      if (event.newValue) {
        setThemeState(event.newValue);
      } else {
        setTheme(defaultTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, setTheme, storageKey]);

  React.useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [applyTheme, forcedTheme, theme]);

  const providerValue = React.useMemo<UseThemeProps>(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: enableSystem ? (resolvedTheme as ColorScheme) : undefined,
    }),
    [enableSystem, forcedTheme, resolvedTheme, setTheme, theme, themes],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScriptElement
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableColorScheme={enableColorScheme}
        enableSystem={enableSystem}
        forcedTheme={forcedTheme}
        nonce={nonce}
        scriptProps={scriptProps}
        storageKey={storageKey}
        themes={themes}
        value={value}
      />
      {children}
    </ThemeContext.Provider>
  );
}
