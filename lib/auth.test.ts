import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateApiKey } from "./auth";

describe("validateApiKey", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return null for valid Bearer token", () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const result = validateApiKey(request);
    expect(result).toBeNull();
  });

  it("should return 401 error for missing Authorization header", async () => {
    const request = new Request("http://localhost/api/test");

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error: "Unauthorized - Missing Authorization header",
    });
  });

  it("should return 401 error for invalid Bearer token", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid API key",
    });
  });

  it("should return 401 error for missing Bearer scheme", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        authorization: mockApiKey,
      },
    });

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error:
        "Unauthorized - Invalid Authorization format. Expected: Bearer <token>",
    });
  });

  it("should return 401 error for wrong scheme", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        authorization: `Basic ${mockApiKey}`,
      },
    });

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error:
        "Unauthorized - Invalid Authorization format. Expected: Bearer <token>",
    });
  });

  it("should return 500 error when API_SECRET_KEY is not configured", async () => {
    vi.stubEnv("API_SECRET_KEY", undefined);

    const request = new Request("http://localhost/api/test", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(500);

    const json = await result?.json();
    expect(json).toEqual({
      error: "API authentication not configured",
    });
  });
});
