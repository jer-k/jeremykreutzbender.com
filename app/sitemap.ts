import { fetchPosts } from "@/lib/fetchPosts";

export default async function sitemap() {
  const posts = await fetchPosts();
  const blogs = posts.map((post) => ({
    url: `https://jeremykreutzbender.com/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const routes = [
    "",
    "/blog",
    "/videos",
    "/contact",
    "/cv",
    "/open_source",
  ].map((route) => ({
    url: `https://jeremykreutzbender.com${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
