import { MDXRemote } from "next-mdx-remote/rsc";
import { fetchPost } from "@/lib/fetchPosts";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

type BlogPostPageParams = {
  params: {
    slug: string;
  };
};
export default async function BlogPost({
  params: { slug },
}: BlogPostPageParams) {
  const post = await fetchPost(slug);

  if (!post) return notFound();

  return (
    <MDXRemote
      source={post.content}
      options={{
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkFrontmatter],
        },
      }}
      components={mdxComponents}
    />
  );
}
