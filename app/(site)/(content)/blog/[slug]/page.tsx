import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

import { fetchPost, fetchPosts } from "@/lib/fetchPosts";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";

import type { Metadata } from "next";

type BlogPostPageParams = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageParams): Promise<Metadata> {
  const slug = params.slug;

  const post = await fetchPost(slug);

  if (post) {
    return {
      title: post.title,
      description: post.description,
    };
  } else {
    return {};
  }
}

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
