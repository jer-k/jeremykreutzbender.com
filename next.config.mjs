import createMDX from '@next/mdx'
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import rehypeMdxCodeProps from "rehype-mdx-code-props"

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
    rehypePlugins: [rehypeMdxCodeProps],
  }
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)