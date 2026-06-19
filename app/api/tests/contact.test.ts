import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/emails/send", () => ({
  sendEmail: vi.fn().mockResolvedValue({}),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    limit: 5,
    remaining: 4,
    resetAt: 1_700_000_000_000,
    retryAfter: 3_600,
  }),
}));

import { sendEmail } from "@/app/actions/emails/send";
import { POST } from "@/app/api/contact/route";
import { checkRateLimit } from "@/lib/rate-limit";

const mockSendEmail = vi.mocked(sendEmail);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

describe("POST /api/contact", () => {
  const mockApiKey = "test-secret-key";
  const validPayload = {
    fullName: "Ada Lovelace",
    emailAddress: "ada@example.com",
    message: "Hello from the API route.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
    mockSendEmail.mockResolvedValue({});
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      limit: 5,
      remaining: 4,
      resetAt: 1_700_000_000_000,
      retryAfter: 3_600,
    });
  });

  it("should send a contact email with a valid API key and payload", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual({ success: true });
    expect(mockSendEmail).toHaveBeenCalledWith(validPayload);
  });

  it("should return field errors for invalid payloads", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: "",
        emailAddress: "not-an-email",
        message: "hey",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("error", "Invalid contact request");
    expect(json.fieldErrors).toHaveProperty("fullName");
    expect(json.fieldErrors).toHaveProperty("emailAddress");
    expect(json.fieldErrors).toHaveProperty("message");
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
      },
      body: "{",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ error: "Invalid JSON request body" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should return 502 when the email provider returns an error", async () => {
    mockSendEmail.mockResolvedValue({
      error: {
        message: "Rate limited",
        name: "rate_limit_exceeded",
      },
    });

    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(502);

    const json = await response.json();
    expect(json).toEqual({ error: "Unable to send contact email" });
  });

  it("should return 429 when the rate limit is exceeded", async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 5,
      remaining: 0,
      resetAt: 1_700_000_000_000,
      retryAfter: 3_600,
    });
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.10",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(response.headers.get("RateLimit-Limit")).toBe("5");
    expect(response.headers.get("RateLimit-Remaining")).toBe("0");

    const json = await response.json();
    expect(json).toEqual({
      error: "Too many contact requests. Please try again later.",
    });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should return 503 when rate limit storage is unavailable", async () => {
    mockCheckRateLimit.mockRejectedValue(
      new Error("Redis rate limit storage is not configured."),
    );
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mockApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);

    const json = await response.json();
    expect(json).toEqual({ error: "Unable to check contact rate limit" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        authorization: "Bearer wrong-key",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
