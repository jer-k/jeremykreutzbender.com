import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/blog/:slug",
          destination: "/api/markdown/blog/:slug",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(.*)text/markdown(.*)",
            },
          ],
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
    rehypePlugins: [
      "rehype-slug",
      "rehype-autolink-headings",
      "rehype-code-titles",
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
