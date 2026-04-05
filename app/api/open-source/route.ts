import { type NextRequest, NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { openSourcePullRequests } from "@/lib/github";

const DEFAULT_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const pullRequests = await openSourcePullRequests();

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

    const total = pullRequests.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPRs = pullRequests
      .slice(startIndex, endIndex)
      .map(({ bodyHTML: _bodyHTML, ...rest }) => rest);

    return NextResponse.json({
      pullRequests: paginatedPRs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching open source pull requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
