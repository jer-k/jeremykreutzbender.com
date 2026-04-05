import { type NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { fetchPosts } from "@/lib/fetch-posts";
import type { Post } from "@/types/post";

type ApiPost = Omit<Post, "content" | "draft">;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> },
) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const posts = await fetchPosts();

    const matchingPosts: ApiPost[] = posts
      .filter((post) =>
        post.tags.some(
          (postTag) => postTag.toLowerCase() === decodedTag.toLowerCase(),
        ),
      )
      .map((post) => {
        const { content: _content, draft: _draft, ...rest } = post;
        return rest;
      });

    return NextResponse.json({
      tag: decodedTag,
      posts: matchingPosts,
      total: matchingPosts.length,
    });
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
