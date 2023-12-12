import { NextResponse } from "next/server";
import { clearCookie } from "@/lib/authkit";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  clearCookie();
  return NextResponse.redirect(origin);
}
