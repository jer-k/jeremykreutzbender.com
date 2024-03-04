import { notFound } from "next/navigation";

import {
  fetchPost,
  fetchPosts,
  fetchMdxPosts,
  postComponents,
} from "@/lib/fetchPosts";

import type { Metadata } from "next";

type BlogPostPageParams = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await fetchMdxPosts();

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
      openGraph: {
        url: `/blog/${slug}`,
        title: `${post.title}`,
        siteName: "jeremykreutzbender.com",
        description: post.description,
        images: [
          {
            url: `/og-image/${slug}`,
            width: 960,
            height: 540,
            alt: `Blog post: ${post.title}`,
            type: "image/png",
          },
        ],
      },
    };
  } else {
    return {
      title: "Not Found",
      description: "The resource you were looking for does not exist",
    };
  }
}

export default async function BlogPost({
  params: { slug },
}: BlogPostPageParams) {
  const post = await fetchPost(slug);

  if (!post) return notFound();

  const components = await postComponents();
  return components[slug]();
}
