import { type NextRequest, NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { fetchTopQueries } from "@/lib/search-console";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") ?? "30") || 30;
    const limit = parseInt(searchParams.get("limit") ?? "20") || 20;

    const queries = await fetchTopQueries(days, limit);

    return NextResponse.json({ queries, days, total: queries.length });
  } catch (error) {
    console.error("Error fetching top queries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
