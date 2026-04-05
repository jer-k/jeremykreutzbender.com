import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { socialLinks } from "@/lib/constants/social-links";

export const runtime = "edge";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  return NextResponse.json(socialLinks);
}
