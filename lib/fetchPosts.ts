import { cache, ReactElement } from "react";

import matter from "gray-matter";
import { Post } from "@/types/types";
import fs from "fs/promises";

import { thirdPartyPosts } from "@/lib/constants/thirdPartyPosts";

async function parseMdxFiles() {
  const filePaths = await fs.readdir("posts/");

  const postsData = [];

  for (const filePath of filePaths) {
    const postFilePath = `posts/${filePath}`;
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
