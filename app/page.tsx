/**
 * v0 by Vercel.
 * @see https://v0.dev/t/sO96mj8LWN6
 */
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import Link from "next/link";

import { BlogCardSkeleton } from "@/components/skeletons/blog-card-skeleton";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen justify-between px-16 pt-4">
      <Header />
      <main className="flex-1">
        <section className="w-full">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                Jeremy Kreutzbender - Product Engineer
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Welcome to my personal website. Here you can find my latest blog
                posts and projects.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl">
              Latest Blog Posts
            </h2>
            <div className="mt-8 space-y-6">
              <Suspense
                fallback={
                  <div className="flex items-center">
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                  </div>
                }
              >
                <div className="flex flex-col items-center space-y-4">
                  <BlogCardSkeleton />
                  <BlogCardSkeleton />
                  <BlogCardSkeleton />
                </div>
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
