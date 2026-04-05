import { type NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { fetchPosts } from "@/lib/fetch-posts";
import type { Post } from "@/types/post";

type ApiPost = Omit<Post, "content" | "draft">;

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing required query parameter: q" },
        { status: 400 },
      );
    }

    const posts = await fetchPosts();
    const lowerQuery = query.toLowerCase();

    const matchingPosts: ApiPost[] = posts
      .filter((post) => {
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.description.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      })
      .map((post) => {
        const { content: _content, draft: _draft, ...rest } = post;
        return rest;
      });

    return NextResponse.json({
      query,
      posts: matchingPosts,
      total: matchingPosts.length,
    });
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
