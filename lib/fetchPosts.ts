import { cache } from "react";

import matter from "gray-matter";
import { Post } from "@/types/types";
import fs from "fs/promises";

export const fetchPosts = cache(async () => {
  const filePaths = await fs.readdir("posts/");

  const postsData = [];

  for (const filePath of filePaths) {
    const postFilePath = `posts/${filePath}`;
    const postContent = await fs.readFile(postFilePath, "utf8");
    const { data } = matter(postContent);

    if (!data.draft) {
      const postData = { ...data, content: postContent } as Post;
      postsData.unshift(postData);
    }
  }

  return postsData;
});

export async function fetchPost(slug: string) {
  const posts = await fetchPosts();
  return posts.find((post) => post.slug === slug);
}

export default fetchPosts;
