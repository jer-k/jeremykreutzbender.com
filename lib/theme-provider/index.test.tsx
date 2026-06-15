// @vitest-environment jsdom

import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  ThemeProvider,
  type ThemeProviderProps,
  useTheme,
} from "@/lib/theme-provider";

type MatchMediaListener = (event: MediaQueryListEvent) => void;

let systemTheme: "light" | "dark" = "light";
const mediaListeners = new Set<MatchMediaListener>();

function setDeviceTheme(theme: "light" | "dark") {
  systemTheme = theme;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: systemTheme === "dark",
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, listener: MatchMediaListener) => {
        if (event === "change") {
          mediaListeners.add(listener);
        }
      }),
      removeEventListener: vi.fn(
        (event: string, listener: MatchMediaListener) => {
          if (event === "change") {
            mediaListeners.delete(listener);
          }
        },
      ),
      addListener: vi.fn((listener: MatchMediaListener) => {
        mediaListeners.add(listener);
      }),
      removeListener: vi.fn((listener: MatchMediaListener) => {
        mediaListeners.delete(listener);
      }),
      dispatchEvent: vi.fn(),
    })),
  });
}

function dispatchSystemTheme(theme: "light" | "dark") {
  systemTheme = theme;
  const event = {
    matches: theme === "dark",
    media: "(prefers-color-scheme: dark)",
  } as MediaQueryListEvent;

  for (const listener of mediaListeners) {
    listener(event);
  }
}

function resetDocumentTheme() {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-example");
  document.documentElement.removeAttribute("data-theme-test");
  document.documentElement.removeAttribute("class");
  document.documentElement.removeAttribute("style");
  document.documentElement.style.colorScheme = "";
}

function makeWrapper(props: ThemeProviderProps) {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider {...props}>{children}</ThemeProvider>
  );
}

function HelperComponent({ forceSetTheme }: { forceSetTheme?: string }) {
  const { setTheme, theme, forcedTheme, resolvedTheme, systemTheme } =
    useTheme();

  React.useEffect(() => {
    if (forceSetTheme) {
      setTheme(forceSetTheme);
    }
  }, [forceSetTheme, setTheme]);

  return (
    <>
      <p data-testid="theme">{theme}</p>
      <p data-testid="forcedTheme">{forcedTheme}</p>
      <p data-testid="resolvedTheme">{resolvedTheme}</p>
      <p data-testid="systemTheme">{systemTheme}</p>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  mediaListeners.clear();
  setDeviceTheme("light");
  resetDocumentTheme();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("defaultTheme", () => {
  test("uses system theme by default", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });

    expect(result.current.theme).toBe("system");
    expect(result.current.systemTheme).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
  });

  test("uses light by default when system themes are disabled", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ enableSystem: false }),
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(result.current.systemTheme).toBeUndefined();
  });

  test("uses explicit default themes", () => {
    const { result: light } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "light" }),
    });
    expect(light.current.theme).toBe("light");
    expect(light.current.resolvedTheme).toBe("light");
    cleanup();

    const { result: dark } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "dark" }),
    });
    expect(dark.current.theme).toBe("dark");
    expect(dark.current.resolvedTheme).toBe("dark");
  });
});

describe("provider", () => {
  test("ignores nested ThemeProviders", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="dark">
          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        </ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });
});

describe("storage", () => {
  test("does not store the default theme", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "dark" }),
    });

    expect(setItem).not.toHaveBeenCalled();
    expect(localStorage.getItem("theme")).toBeNull();
  });

  test("stores literal and functional updates", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "light" }),
    });

    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(result.current.theme).toBe("dark");

    act(() =>
      result.current.setTheme((theme) => (theme === "dark" ? "light" : "dark")),
    );
    expect(localStorage.getItem("theme")).toBe("light");
    expect(result.current.theme).toBe("light");
  });

  test("uses a custom storage key", () => {
    render(
      <ThemeProvider storageKey="customKey">
        <HelperComponent forceSetTheme="light" />
      </ThemeProvider>,
    );

    expect(localStorage.getItem("customKey")).toBe("light");
    expect(localStorage.getItem("theme")).toBeNull();
  });

  test("reacts to storage events from another tab", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <HelperComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "theme",
          newValue: "dark",
        }),
      );
    });

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("attributes", () => {
  test("uses data-theme by default", () => {
    render(
      <ThemeProvider>
        <HelperComponent forceSetTheme="light" />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  test("supports class attributes without removing unrelated classes", () => {
    document.documentElement.classList.add("font-class");

    render(
      <ThemeProvider attribute="class">
        <HelperComponent forceSetTheme="dark" />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains("font-class")).toBe(
      true,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("supports custom and multiple attributes", () => {
    render(
      <ThemeProvider attribute={["data-example", "data-theme-test"]}>
        <HelperComponent forceSetTheme="light" />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-example")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme-test")).toBe(
      "light",
    );
  });
});

describe("custom value mapping", () => {
  test("maps theme names to custom DOM values", () => {
    localStorage.setItem("theme", "pink");

    render(
      <ThemeProvider
        themes={["pink", "light", "dark"]}
        value={{ pink: "my-pink-theme" }}
      >
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "my-pink-theme",
    );
  });

  test("removes attributes when a value mapping is missing", () => {
    render(
      <ThemeProvider value={{ dark: "dark-mode" }}>
        <HelperComponent forceSetTheme="light" />
      </ThemeProvider>,
    );

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  test("removes classes when a value mapping is missing", () => {
    render(
      <ThemeProvider attribute="class" value={{ dark: "dark-mode" }}>
        <HelperComponent forceSetTheme="light" />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark-mode")).toBe(
      false,
    );
  });
});

describe("forcedTheme", () => {
  test("keeps stored theme in context while forcing the DOM theme", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider forcedTheme="light">
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("forcedTheme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});

describe("system theme", () => {
  test("resolves the current system theme", () => {
    setDeviceTheme("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });

    expect(result.current.theme).toBe("system");
    expect(result.current.systemTheme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  test("updates the applied theme when system preference changes", () => {
    render(
      <ThemeProvider>
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    act(() => dispatchSystemTheme("dark"));

    expect(screen.getByTestId("systemTheme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("color-scheme", () => {
  test("sets color-scheme for light and dark themes", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  test("does not set color-scheme when disabled", () => {
    render(
      <ThemeProvider enableColorScheme={false}>
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.colorScheme).toBe("");
  });
});

describe("inline script", () => {
  test("does not render a script during client hydration", () => {
    render(
      <ThemeProvider scriptProps={{ "data-test": "1234" }}>
        <HelperComponent />
      </ThemeProvider>,
    );

    expect(document.querySelector('script[data-test="1234"]')).toBeNull();
  });
});
