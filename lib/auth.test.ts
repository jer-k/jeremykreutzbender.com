import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateApiKey } from "./auth";

describe("validateApiKey", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return null for valid API key", () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const result = validateApiKey(request);
    expect(result).toBeNull();
  });

  it("should return 401 error for missing API key", async () => {
    const request = new Request("http://localhost/api/test");

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 401 error for invalid API key", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        "x-api-key": "wrong-key",
      },
    });

    const result = validateApiKey(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const json = await result?.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 500 error when API_SECRET_KEY is not configured", async () => {
    vi.stubEnv("API_SECRET_KEY", undefined);

    const request = new Request("http://localhost/api/test", {
      headers: {
        "x-api-key": mockApiKey,
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

  it("should be case-insensitive for header name", () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        "X-API-Key": mockApiKey,
      },
    });

    const result = validateApiKey(request);
    expect(result).toBeNull();
  });
});
