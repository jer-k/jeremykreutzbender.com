import type { Metadata } from "next";

import { fetchPosts, fetchTags } from "@/lib/fetch-posts";

import { BlogCard } from "@/components/blog-card";
import { Pagination } from "@/components/pagination";
import { TagSelect } from "@/components/tag-select";

export const metadata: Metadata = {
  title: "Blog",
  description: "My blog posts",
  alternates: {
    canonical: "https://jeremykreutzbender.com/blog",
  },
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

type BlogProps = {
  searchParams: Promise<{
    page?: string;
    tags?: string;
  }>;
};

export default async function Blog(props: BlogProps) {
  const searchParams = await props.searchParams;
  const posts = await fetchPosts();
  const tags = await fetchTags();

  const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];
  const filteredPosts =
    selectedTags.length > 0
      ? posts.filter((post) =>
          post.tags.some((tag) => selectedTags.includes(tag)),
        )
      : posts;

  const page = (searchParams.page && parseInt(searchParams.page)) || 1;
  const start = (page - 1) * 10;
  const numPages = Math.ceil(filteredPosts.length / 10);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-primary dark:text-bright font-bold text-3xl">
        Blog Posts
      </h1>
      <div className="w-full">
        <TagSelect tags={tags} />
      </div>
      <div className="flex flex-col space-y-4 not-prose">
        {filteredPosts.slice(start, start + 10).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        <Pagination page={page} numPages={numPages} path="blog" />
      </div>
    </div>
  );
}
