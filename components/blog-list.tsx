import { BlogCard } from "@/components/blog-card";

import { Post } from "@/types/post";

type BlogListProps = {
  posts: Post[];
};

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="flex flex-col divide-y divide-border w-full">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
