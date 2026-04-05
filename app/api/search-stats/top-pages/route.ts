import { type NextRequest, NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { fetchTopPages } from "@/lib/search-console";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") ?? "28") || 28;
    const limit = parseInt(searchParams.get("limit") ?? "20") || 20;

    const pages = await fetchTopPages(days, limit);

    return NextResponse.json({ pages, days, total: pages.length });
  } catch (error) {
    console.error("Error fetching top pages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
