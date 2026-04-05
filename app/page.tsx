import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";

import { fetchPosts } from "@/lib/fetch-posts";

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <main className="flex-1 flex flex-col gap-y-8 px-16 pt-4">
        <section className="flex justify-center w-full">
          <Hero />
        </section>
        <section className="md:w-full md:flex">
          <div className="w-full">
            <div className="flex flex-col space-y-4 w-full">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Latest Blog Posts
              </h2>
              <div className="flex flex-col mt-8 space-y-6">
                {posts.slice(0, 5).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
                <div className="flex justify-center">
                  <Link href={"/blog"}>
                    <Button>Read More...</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
