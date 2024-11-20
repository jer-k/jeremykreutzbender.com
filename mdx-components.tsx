import Image, { type ImageProps } from "next/image";

import { Code } from "bright";
import { Tweet } from "react-tweet";

import { Aside } from "@/components/mdx/aside";
import { Blockquote } from "@/components/mdx/blockquote";
import { BlockquoteWithLink } from "@/components/mdx/blockquote-with-link";
import { CodeblockTitle } from "@/components/mdx/codeblock-title";
import { H2WithAnchor } from "@/components/mdx/h2-with-anchor";
import { InlineCodeBlock } from "@/components/mdx/inline-code-block";
import { PublishedOnOldBlog } from "@/components/mdx/published-on-old-blog";
import { PublishedOnReleaseBlog } from "@/components/mdx/published-on-release-blog";

import type { MDXComponents } from "mdx/types";

Code.theme = {
  dark: "solarized-dark",
  light: "solarized-light",
  lightSelector: "html.light",
};

export const mdxComponents: MDXComponents = {
  PublishedOnOldBlog: PublishedOnOldBlog,
  PublishedOnReleaseBlog: PublishedOnReleaseBlog,
  BlockquoteWithLink: BlockquoteWithLink,
  Aside: Aside,
  pre: Code,
  code: ({ children }) => <InlineCodeBlock>{children}</InlineCodeBlock>,
  div: ({ className, children, ...props }) => {
    if (className?.includes("rehype-code-title")) {
      return <CodeblockTitle {...props}>{children}</CodeblockTitle>;
    }
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
  h2: ({ id, children }) => <H2WithAnchor id={id}>{children}</H2WithAnchor>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      width={450}
      height={450}
      placeholder="blur"
      blurDataURL={"@/public/post_images/1x1-fafaf07f.png"}
      {...(props as ImageProps)}
    />
  ),
  Tweet: (props) => (
    <div className="not-prose">
      <Tweet {...props} />
    </div>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
