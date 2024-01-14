import { Code } from "bright";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  Code.theme = {
    dark: "github-dark",
    light: "github-light",
  };

  return {
    ...components,
    pre: Code,
  };
}
