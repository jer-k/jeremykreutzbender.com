import { NextResponse } from "next/server";

export function validateApiKey(request: Request): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.API_SECRET_KEY;

  if (!expectedKey) {
    console.error("API_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "API authentication not configured" },
      { status: 500 },
    );
  }

  if (!authHeader) {
    return NextResponse.json(
      { error: "Unauthorized - Missing Authorization header" },
      { status: 401 },
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return NextResponse.json(
      {
        error:
          "Unauthorized - Invalid Authorization format. Expected: Bearer <token>",
      },
      { status: 401 },
    );
  }

  if (token !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid API key" },
      { status: 401 },
    );
  }

  return null;
}
