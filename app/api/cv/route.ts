import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { cvData } from "@/lib/constants/cv-data";

export const runtime = "edge";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }
  try {
    return NextResponse.json(cvData);
  } catch (error) {
    console.error("Error fetching CV data:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching CV data" },
      { status: 500 },
    );
  }
}
