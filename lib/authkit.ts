import { cookies } from "next/headers";
import WorkOS, { User } from "@workos-inc/node";
import { jwtVerify } from "jose";

export const workos = new WorkOS(process.env.WORKOS_API_KEY);

export function getClientId() {
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!clientId) {
    throw new Error("WORKOS_CLIENT_ID is not set");
  }

  return clientId;
}

export async function getAuthorizationUrl() {
  const redirectUri = process.env.AUTH_CALLBACK_ROUTE;

  if (!redirectUri) {
    throw new Error("AUTH_CALLBACK_ROUTE is not set");
  }

  return workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    redirectUri,
  });
}

export function getJwtSecretKey() {
  const secret = process.env.AUTH_SECRET_KEY;

  if (!secret) {
    throw new Error("AUTH_SECRET_KEY is not set");
  }

  return new Uint8Array(Buffer.from(secret, "base64"));
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user?: User | null;
}> {
  const token = cookies().get("authToken")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (verifiedToken) {
    return {
      isAuthenticated: true,
      user: verifiedToken.user as User | null,
    };
  }

  return { isAuthenticated: false };
}

export function getCookie() {
  return cookies().get("authToken");
}

export function clearCookie() {
  cookies().delete("authToken");
}
