import { Suspense } from "react";

import Link from "next/link";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Button } from "@/components/ui/button";
import { BlogCardSkeleton } from "@/components/skeletons/blog-card-skeleton";
import { BlogCard } from "@/components/blog-card";
import { HeroCard } from "@/components/hero-card";
import { ThemeProvider } from "@/components/theme-provider";

import { fetchPosts } from "@/lib/fetchPosts";

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col h-screen justify-between px-16 pt-4">
        <Header />
        <main className="flex-1 flex flex-col gap-y-8">
          <section className="w-full">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl text-primary dark:text-bright font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                  Jeremy Kreutzbender - Product Engineer
                </h1>
              </div>
            </div>
          </section>
          <section>
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                {/*<HeroCard title="About Me" description="Learn more about me" href="/about" />*/}
                <HeroCard
                  title="Online CV"
                  description="An interactive version of my CV"
                  href="/cv"
                />
                <HeroCard
                  title="Open Source"
                  description="PRs I've made to open source projects"
                  href="/open_source"
                />
                {/*<HeroCard title="Product Engineering" description="My thoughts on what it means to be a Product Engineer instead of a Full Stack Engineer" href="/product-engineer" />*/}
              </div>
            </div>
          </section>
          <section className="md:w-full md:flex md:justify-center">
            <div className="prose">
              <div className="flex flex-col space-y-4 not-prose">
                <h2 className="text-3xl text-primary dark:text-bright font-bold tracking-tighter text-center sm:text-4xl">
                  Latest Blog Posts
                </h2>
                <div className="flex flex-col mt-8 space-y-6">
                  <Suspense
                    fallback={
                      <div className="flex items-center">
                        <BlogCardSkeleton />
                        <BlogCardSkeleton />
                        <BlogCardSkeleton />
                      </div>
                    }
                  >
                    {posts.slice(0, 5).map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                    <div className="flex justify-center">
                      <Link href={"/blog"}>
                        <Button>Read More...</Button>
                      </Link>
                    </div>
                  </Suspense>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
