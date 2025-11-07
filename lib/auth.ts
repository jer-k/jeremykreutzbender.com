import { NextResponse } from "next/server";

const API_KEY_HEADER = "x-api-key";

export function validateApiKey(request: Request): NextResponse | null {
  const apiKey = request.headers.get(API_KEY_HEADER);
  const expectedKey = process.env.API_SECRET_KEY;

  if (!expectedKey) {
    console.error("API_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "API authentication not configured" },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid or missing API key" },
      { status: 401 },
    );
  }

  return null;
}
