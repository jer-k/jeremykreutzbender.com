import Image, { ImageProps } from "next/image";

import { Code } from "bright";
import type { MDXComponents } from "mdx/types";

import { PublishedOnOldBlog } from "@/components/mdx/published-on-old-blog";
import { PublishedOnReleaseBlog } from "@/components/mdx/published-on-release-blog";

Code.theme = {
  dark: "solarized-dark",
  light: "solarized-light",
  lightSelector: "html.light",
};

export const mdxComponents: MDXComponents = {
  PublishedOnOldBlog: PublishedOnOldBlog,
  PublishedOnReleaseBlog: PublishedOnReleaseBlog,
  pre: Code,
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      width={450}
      height={450}
      {...(props as ImageProps)}
    />
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}