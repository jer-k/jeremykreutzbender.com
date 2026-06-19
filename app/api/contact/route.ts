import { type NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/app/actions/emails/send";
import { validateApiKey } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/schemas/contact-form-schema";

const CONTACT_RATE_LIMIT_MAX = parseInt(
  process.env.CONTACT_API_RATE_LIMIT_MAX || "5",
);
const CONTACT_RATE_LIMIT_WINDOW_SECONDS = parseInt(
  process.env.CONTACT_API_RATE_LIMIT_WINDOW_SECONDS || "3600",
);

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }

  let rateLimit;

  try {
    rateLimit = await checkRateLimit({
      key: `contact:${getClientIp(request)}`,
      limit: CONTACT_RATE_LIMIT_MAX,
      windowMs: CONTACT_RATE_LIMIT_WINDOW_SECONDS * 1000,
    });
  } catch (error) {
    console.error("Error checking contact rate limit:", error);
    return NextResponse.json(
      { error: "Unable to check contact rate limit" },
      { status: 503 },
    );
  }
  const rateLimitHeaders = {
    "RateLimit-Limit": rateLimit.limit.toString(),
    "RateLimit-Remaining": rateLimit.remaining.toString(),
    "RateLimit-Reset": Math.ceil(rateLimit.resetAt / 1000).toString(),
  };

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many contact requests. Please try again later." },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": rateLimit.retryAfter.toString(),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const parsedBody = contactSchema.safeParse(body);
  if (!parsedBody.success) {
    const fieldErrors = parsedBody.error.flatten().fieldErrors;

    return NextResponse.json(
      {
        error: "Invalid contact request",
        fieldErrors: {
          fullName: fieldErrors.fullName?.[0],
          emailAddress: fieldErrors.emailAddress?.[0],
          message: fieldErrors.message?.[0],
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await sendEmail(parsedBody.data);

    if (result.error) {
      console.error(
        `Error sending contact email: ${result.error.name}: ${result.error.message}`,
      );
      return NextResponse.json(
        { error: "Unable to send contact email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
