import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJwtSecretKey, workos, getClientId } from "@/lib/authkit";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      const { user } = await workos.userManagement.authenticateWithCode({
        clientId: getClientId(),
        code,
      });

      const token = await new SignJWT({
        // Here you might lookup and retrieve user details from your database
        user,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(getJwtSecretKey());

      const url = request.nextUrl.clone();

      url.searchParams.delete("code");

      url.pathname = "/";
      const response = NextResponse.redirect(url);

      response.cookies.set({
        name: "authToken",
        value: token,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      return response;
    } catch (error) {
      console.log("caught an error", error);
      return NextResponse.json(error);
    }
  }

  return NextResponse.json({
    error: "No authorization code was received from AuthKit",
  });
}
