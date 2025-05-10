import { notFound } from "next/navigation";

import { fetchMdxPosts, fetchPost, postComponents } from "@/lib/fetch-posts";

import type { Metadata } from "next";

type BlogPostPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await fetchMdxPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: BlogPostPageParams,
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  const post = await fetchPost(slug);

  if (post) {
    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical: `https://jeremykreutzbender.com/blog/${slug}`,
      },
      openGraph: {
        url: `/blog/${slug}`,
        title: `${post.title}`,
        siteName: "Jeremy Kreutzbender's site",
        description: post.description,
        images: [
          {
            url: `/api/og?title=${post.title}&date=${post.date}&description=${post.description}`,
            width: 960,
            height: 540,
            alt: `Blog post: ${post.title}`,
            type: "image/png",
          },
        ],
      },
    };
  }

  return {
    title: "Not Found",
    description: "The resource you were looking for does not exist",
  };
}

export default async function BlogPost(props: BlogPostPageParams) {
  const params = await props.params;

  const { slug } = params;

  const components = await postComponents();
  const postComponent = components[slug];

  if (!postComponent) return notFound();
  return postComponent();
}
