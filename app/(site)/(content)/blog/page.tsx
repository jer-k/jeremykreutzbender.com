import { fetchPosts } from "@/lib/fetchPosts";
import { BlogCard } from "@/components/blog-card";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "My blog posts",
  openGraph: {
    title: "Blog - Jeremy Kreutzbender",
    description: "All my blog posts",
    url: "https://jeremykreutzbender.com/blog",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Blog",
        width: 960,
        height: 540,
        alt: "Blog page",
        type: "image/png",
      },
    ],
  },
};

export default async function Blog() {
  const posts = await fetchPosts();
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-primary dark:text-bright font-bold text-3xl">
        Blog Posts
      </h1>
      <div className="flex flex-col space-y-4 not-prose">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
