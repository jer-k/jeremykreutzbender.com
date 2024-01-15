import { Code } from "bright";
import type { MDXComponents } from "mdx/types";
import { PublishedOnOldBlog } from "@/components/mdx/published-on-old-blog";
import { PublishedOnReleaseBlog } from "@/components/mdx/published-on-release-blog";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
};

export const mdxComponents: MDXComponents = {
  PublishedOnOldBlog: PublishedOnOldBlog,
  PublishedOnReleaseBlog: PublishedOnReleaseBlog,
  pre: Code,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
