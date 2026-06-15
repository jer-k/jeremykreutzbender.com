import { colorSchemes } from "./constants";
import { getSystemTheme } from "./system-theme";
import type { ColorScheme, ThemeAttribute, ThemeValueMap } from "./types";

type ApplyThemeOptions = {
  attribute: ThemeAttribute | ThemeAttribute[];
  defaultTheme: string;
  disableTransitionOnChange: boolean;
  enableColorScheme: boolean;
  enableSystem: boolean;
  nonce?: string | undefined;
  theme: string | undefined;
  themes: string[];
  value?: ThemeValueMap | undefined;
};

export function applyThemeToDocument({
  attribute,
  defaultTheme,
  disableTransitionOnChange,
  enableColorScheme,
  enableSystem,
  nonce,
  theme,
  themes,
  value,
}: ApplyThemeOptions) {
  if (!theme) {
    return;
  }

  const resolved =
    theme === "system" && enableSystem ? getSystemTheme() : theme;
  const name = value ? value[resolved] : resolved;
  const restoreTransitions = disableTransitionOnChange
    ? disableAnimation(nonce)
    : undefined;
  const root = document.documentElement;
  const attributes = Array.isArray(attribute) ? attribute : [attribute];
  const removableValues = getRemovableThemeValues(themes, value);

  for (const attr of attributes) {
    if (attr === "class") {
      root.classList.remove(...removableValues);
      if (name) {
        root.classList.add(name);
      }
    } else if (name) {
      root.setAttribute(attr, name);
    } else {
      root.removeAttribute(attr);
    }
  }

  if (enableColorScheme) {
    const fallback = isColorScheme(defaultTheme) ? defaultTheme : undefined;
    root.style.colorScheme = isColorScheme(resolved)
      ? resolved
      : (fallback ?? "");
  }

  restoreTransitions?.();
}

function isColorScheme(themeName: string): themeName is ColorScheme {
  return colorSchemes.includes(themeName as ColorScheme);
}

function getRemovableThemeValues(themes: string[], value?: ThemeValueMap) {
  if (!value) {
    return themes;
  }

  return Array.from(new Set([...themes, ...Object.values(value)]));
}

function disableAnimation(nonce?: string) {
  const style = document.createElement("style");

  if (nonce) {
    style.setAttribute("nonce", nonce);
  }

  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);

    setTimeout(() => {
      style.parentNode?.removeChild(style);
    }, 1);
  };
}
