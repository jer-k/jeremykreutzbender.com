import { cache } from "react";

import matter from "gray-matter";
import { Post } from "@/types/types";
import fs from "fs/promises";

export const fetchPosts = cache(async () => {
  const posts = await fs.readdir("posts/");

  return Promise.all(
    posts.map(async (file) => {
      const filePath = `./posts/${file}`;
      const postContent = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(postContent);

      if (data.published === false) {
        return null;
      }

      return data as Post;
    }),
  );

  // return posts.reduce<Post[]>(async (array, file) => {
  //   const filePath = `posts/${file}`;
  //   const postContent = await fs.readFile(filePath, "utf8");
  //   const { data } = matter(postContent);
  //
  //   if (data.draft === true) {
  //     return array;
  //   }
  //
  //   const postData = data as Post;
  //   return [postData, ...array]
  // }, []);
});

export async function fetchPost(slug: string) {
  const posts = await fetchPosts();
  return posts.find((post) => post?.slug === slug);
}

export default fetchPosts;
