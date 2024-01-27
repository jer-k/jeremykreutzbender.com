import { cache } from "react";

import matter from "gray-matter";
import { Post } from "@/types/types";
import fs from "fs/promises";

const thirdPartyPosts: Post[] = [
  {
    title: "Creating your first Application in Release with Docker Compose",
    date: "2023-06-28",
    draft: false,
    slug: "creating-your-first-application-in-release-with-docker-compose",
    tags: ["release", "docker", "docker-compose"],
    description:
      "A walk through of creating an Application in Release from a repository with a Docker compose file.",
    content: "",
    href: "https://release.com/blog/creating-your-first-application-in-release-with-docker-compose",
  },
  {
    title: "Cache Bundle Install with BuildKit",
    date: "2023-05-03",
    draft: false,
    slug: "cache-bundle-install-with-buildkit",
    tags: ["docker", "buildkit", "rails", "ruby"],
    description:
      "How to use Buildkit's mount cache to reduce bundle install times during Docker builds.",
    content: "",
    href: "https://release.com/blog/cache-bundle-install-with-buildkit",
  },
  {
    title: "Cutting Build Time In Half with Docker’s Buildx Kubernetes Driver",
    date: "2021-02-17",
    draft: false,
    slug: "cutting-build-time-in-half-docker-buildx-kubernetes",
    tags: ["docker", "buildx", "kubernetes", "release"],
    description:
      "Our migration from a home rolled Docker builder to using Docker's Buildkit and Buildx tools.",
    content: "",
    href: "https://release.com/blog/cutting-build-time-in-half-docker-buildx-kubernetes",
  },
  {
    title: "Webhook Authentication Learnings for GitHub, GitLab, and Bitbucket",
    date: "2021-06-21",
    draft: false,
    slug: "webhook-authentication-learnings",
    tags: ["gitlab", "bitbucket", "github", "rails", "webhooks", "release"],
    description:
      "What I learned from implementing Gitlab support at Release and how I refactored our Rails code to support all three providers.",
    href: "https://release.com/blog/webhook-authentication-learnings",
    content: "",
  },
  {
    title: "How Release Uses Action Cable and Redux Toolkit",
    date: "2021-07-15",
    draft: false,
    slug: "how-release-uses-action-cable-redux-toolkit",
    tags: ["react", "redux", "rails", "actioncable", "release"],
    description:
      "A look at how we use Action Cable and Redux Toolkit to provide realtime UI updates.",
    href: "https://release.com/blog/how-release-uses-action-cable-redux-toolkit",
    content: "",
  },
];

export const fetchPosts = cache(async () => {
  const filePaths = await fs.readdir("./posts/");

  const postsData = [];

  for (const filePath of filePaths) {
    const postFilePath = `./posts/${filePath}`;
    const postContent = await fs.readFile(postFilePath, "utf8");
    const { data } = matter(postContent);

    if (!data.draft) {
      const postData = { ...data, content: postContent } as Post;
      postsData.push(postData);
    }
  }

  const postsAndThirdPartyPosts = [...postsData, ...thirdPartyPosts];

  return postsAndThirdPartyPosts.sort((a, b) =>
    a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
  ) as Post[];
});

export async function fetchPost(slug: string) {
  const posts = await fetchPosts();
  return posts.find((post) => post.slug === slug);
}

export default fetchPosts;
