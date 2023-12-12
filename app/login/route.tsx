import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/authkit";

export async function GET() {
  const authorizationUrl = await getAuthorizationUrl();
  return NextResponse.redirect(authorizationUrl);
}
