import type { ThemeAttribute, ThemeValueMap } from "./types";

export function themeScript(
  attribute: ThemeAttribute | ThemeAttribute[],
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string | undefined,
  themes: string[],
  value: ThemeValueMap | undefined,
  enableSystem: boolean,
  enableColorScheme: boolean,
) {
  const root = document.documentElement;
  const systemThemes = ["light", "dark"];

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function updateColorScheme(themeName: string) {
    if (enableColorScheme && systemThemes.includes(themeName)) {
      root.style.colorScheme = themeName;
    }
  }

  function updateDOM(themeName: string) {
    const attributes = Array.isArray(attribute) ? attribute : [attribute];

    for (const attr of attributes) {
      const name = value && value[themeName] ? value[themeName] : themeName;

      if (attr === "class") {
        const classes = value
          ? Array.from(new Set([...themes, ...Object.values(value)]))
          : themes;
        root.classList.remove(...classes);
        root.classList.add(name);
      } else {
        root.setAttribute(attr, name);
      }
    }

    updateColorScheme(themeName);
  }

  if (forcedTheme) {
    updateDOM(forcedTheme);
    return;
  }

  try {
    const themeName = localStorage.getItem(storageKey) || defaultTheme;
    const resolvedTheme =
      enableSystem && themeName === "system" ? getSystemTheme() : themeName;
    updateDOM(resolvedTheme);
  } catch {
    updateDOM(defaultTheme);
  }
}
