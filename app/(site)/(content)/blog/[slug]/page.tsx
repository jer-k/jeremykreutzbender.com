import { MDXRemote } from "next-mdx-remote/rsc";
import { fetchPost, fetchPosts } from "@/lib/fetchPosts";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

import { Metadata } from "next";

type MetadataProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
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

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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
