import type { Post } from "@/types/post";

import { type NextRequest, NextResponse } from "next/server";

import { fetchPosts } from "@/lib/fetch-posts";

const DEFAULT_PAGE_SIZE = 100;

type ApiPost = Omit<Post, "content" | "draft">;

export async function GET(request: NextRequest) {
  try {
    const posts = await fetchPosts();

    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    let page = (pageParam && parseInt(pageParam)) || 1;
    let limit = (limitParam && parseInt(limitParam)) || DEFAULT_PAGE_SIZE;

    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1) {
      limit = DEFAULT_PAGE_SIZE;
    }

    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPosts: ApiPost[] = posts
      .slice(startIndex, endIndex)
      .map((post) => {
        const { content, draft, ...rest } = post;
        return rest;
      });

    const response = {
      posts: paginatedPosts,
      pagination: {
        page: page,
        limit: limit,
        totalPosts: posts.length,
        totalPages: totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching or processing blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
