import { type NextRequest, NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { fetchPost } from "@/lib/fetch-posts";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const post = await fetchPost(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
