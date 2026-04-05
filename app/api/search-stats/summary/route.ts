import { type NextRequest, NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { fetchSearchSummary } from "@/lib/search-console";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") ?? "28") || 28;

    const summary = await fetchSearchSummary(days);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching search summary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
