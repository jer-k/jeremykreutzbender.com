import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { fetchPost } from "@/lib/fetch-posts";

type BlogPostHeroParams = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostHero(props: BlogPostHeroParams) {
  const params = await props.params;
  const post = await fetchPost(params.slug);

  if (!post) return notFound();

  return <PageHero title={post.title} />;
}
