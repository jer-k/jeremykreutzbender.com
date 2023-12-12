import { NextRequest, NextResponse } from "next/server";

import { getCookie, verifyJwtToken } from "@/lib/authkit";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { value: token } = getCookie() ?? { value: null };

    const hasVerifiedToken = token && (await verifyJwtToken(token));

    if (hasVerifiedToken) {
      return NextResponse.next();
    } else {
      // Redirect back to the root
      const { origin } = new URL(request.url);
      return NextResponse.redirect(origin);
    }
  }
}
