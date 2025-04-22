import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig = {
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
	options: {
		remarkPlugins: [
			remarkFrontmatter,
			[remarkMdxFrontmatter, { name: "frontmatter" }],
		],
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeCodeTitles],
	},
});

export default withMDX(nextConfig);
