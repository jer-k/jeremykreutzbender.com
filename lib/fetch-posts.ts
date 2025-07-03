import path from "node:path";

import { ReactElement, cache } from "react";

import { Post } from "@/types/post";
import fs from "fs/promises";
import matter from "gray-matter";

import { thirdPartyPosts } from "@/lib/constants/third-party-posts";

async function parseMdxFiles() {
  const filePaths = await fs.readdir(path.join(process.cwd(), "posts"));

  const postsData = [];

  for (const filePath of filePaths) {
    const postFilePath = path.join(process.cwd(), "posts", filePath);
    const postContent = await fs.readFile(postFilePath, "utf8");
    const { data } = matter(postContent);

    if (!data.draft) {
      const postData = { ...data, content: postContent } as Post;
      postsData.push(postData);
    }
  }

  return postsData;
}

const parsedMdxFiles = cache(parseMdxFiles);

export async function postComponents() {
  const components: Record<string, () => ReactElement> = {};

  const postsData = await parsedMdxFiles();

  for (const post of postsData) {
    const { default: Component } = await import(
      `@/posts/${post.date}-${post.slug}.mdx`
    );
    components[post.slug] = Component;
  }

  return components;
}

export async function fetchMdxPosts() {
  const postsData = await parsedMdxFiles();

  return postsData.sort((a, b) =>
    a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
  ) as Post[];
}

export async function fetchTags() {
  const postsData = await parsedMdxFiles();

  const tags = postsData.reduce<string[]>(
    (acc, post) => [...acc, ...post.tags],
    [],
  );

  return [...new Set(tags)].sort();
}

export async function fetchPosts() {
  const postsData = await parsedMdxFiles();
  const postsAndThirdPartyPosts = [...postsData, ...thirdPartyPosts];

  return postsAndThirdPartyPosts.sort((a, b) =>
    a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
  ) as Post[];
}

export async function fetchPost(slug: string) {
  const posts = await fetchPosts();
  return posts.find((post) => post.slug === slug);
}
