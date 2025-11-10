import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";

export const runtime = "edge";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  return NextResponse.json({
    name: "Jeremy Kreutzbender",
    email: "jeremykreutzbender@gmail.com",
    website: "jeremykreutzbender.com",
  });
}
