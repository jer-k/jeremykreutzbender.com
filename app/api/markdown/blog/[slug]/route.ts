import fs from "fs/promises";
import path from "node:path";

import { fetchPost } from "@/lib/fetch-posts";
import { Post } from "@/types/post";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPostContent(post: Post): Promise<string | null> {
  // If post already has content, use it
  if (post.content) {
    return post.content;
  }

  // For third-party posts, read the MDX file directly from disk
  // The file naming convention is {date}-{slug}.mdx
  const filename = `${post.date}-${post.slug}.mdx`;
  const filePath = path.join(process.cwd(), "posts", filename);

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function hydrateContent(content: string, post: Post): string {
  let hydrated = content;

  // Replace {frontmatter.X} references with actual values
  hydrated = hydrated.replace(/\{frontmatter\.(\w+)\}/g, (_, key) => {
    const value = post[key as keyof Post];
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return String(value ?? "");
  });

  // Remove self-closing JSX components (e.g., <PublishedOnOldBlog />)
  hydrated = hydrated.replace(/<[A-Z][a-zA-Z]*\s*\/>/g, "");

  // Extract content from JSX components with children
  // Matches <Component ...>content</Component> and keeps only the content
  // Handles optional heading attribute by converting to bold prefix
  hydrated = hydrated.replace(
    /<([A-Z][a-zA-Z]*)\s*(?:heading="([^"]*)")?\s*>([\s\S]*?)<\/\1>/g,
    (_, _component, heading, innerContent) => {
      const trimmedContent = innerContent.trim();
      if (heading) {
        return `**${heading}:** ${trimmedContent}`;
      }
      return trimmedContent;
    },
  );

  // Clean up multiple consecutive blank lines
  hydrated = hydrated.replace(/\n{3,}/g, "\n\n");

  return hydrated.trim();
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const post = await fetchPost(slug);

  if (!post) {
    return new NextResponse("Post not found", { status: 404 });
  }

  const content = await getPostContent(post);

  if (!content) {
    // No local content available, redirect to original source
    if (post.href) {
      return NextResponse.redirect(post.href);
    }
    return new NextResponse("Post content not found", { status: 404 });
  }

  const hydratedContent = hydrateContent(content, post);

  return new NextResponse(hydratedContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
