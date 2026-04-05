import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { fetchTags } from "@/lib/fetch-posts";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const tags = await fetchTags();

    return NextResponse.json({ tags, total: tags.length });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
