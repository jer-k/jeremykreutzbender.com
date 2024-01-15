import { lazy, Suspense } from "react";
import { fetchPost } from "@/lib/fetchPosts";
import { notFound } from "next/navigation";

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

  const MdxComponent = lazy(
    () => import(`@/posts/${post.date}-${post.slug}.mdx`),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MdxComponent />
    </Suspense>
  );
}
