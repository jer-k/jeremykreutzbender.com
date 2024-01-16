import { fetchPosts } from "@/lib/fetchPosts";
import { BlogCard } from "@/components/blog-card";

export default async function Blog() {
  const posts = await fetchPosts();
  return (
    <div className="flex flex-col space-y-4 not-prose">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
