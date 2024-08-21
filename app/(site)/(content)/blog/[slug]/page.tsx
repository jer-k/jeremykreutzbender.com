import { notFound } from "next/navigation";

import { fetchPost, fetchMdxPosts, postComponents } from "@/lib/fetchPosts";

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
  const components = await postComponents();
  const postComponent = components[slug];

  if (!postComponent) return notFound();
  return postComponent();
}
