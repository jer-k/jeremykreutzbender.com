// @vitest-environment node

import { renderToString } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { ThemeProvider } from "@/lib/theme-provider";

describe("ThemeProvider server rendering", () => {
  test("renders the bootstrap script on the server", () => {
    const html = renderToString(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        nonce="nonce-value"
        scriptProps={{ "data-test": "theme-script" }}
      >
        <main>Hello</main>
      </ThemeProvider>,
    );

    expect(html).toContain('<script data-test="theme-script"');
    expect(html).toContain('nonce="nonce-value"');
    expect(html).toContain("localStorage.getItem");
    expect(html).toContain("<main>Hello</main>");
  });
});
