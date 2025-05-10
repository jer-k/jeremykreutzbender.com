import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  return NextResponse.json({
    name: "Jeremy Kreutzbender",
    email: "jeremykreutzbender@gmail.com",
    website: "jeremykreutzbender.com",
  });
}
