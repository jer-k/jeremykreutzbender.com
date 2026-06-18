import Link from "next/link";
import { BlogList } from "@/components/blog-list";
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/fetch-posts";

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <>
      <section className="md:w-full md:flex">
        <div className="flex flex-col space-y-4 w-full">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Latest Blog Posts
          </h2>
          <div className="flex flex-col">
            <BlogList posts={posts.slice(0, 5)} />
            <div className="mt-4">
              <Link href={"/blog"}>
                <Button>Read More...</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
