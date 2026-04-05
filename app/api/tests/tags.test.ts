import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/tags/route";

describe("GET /api/tags", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return tags with valid API key", async () => {
    const request = new Request("http://localhost/api/tags", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("tags");
    expect(json).toHaveProperty("total");
    expect(Array.isArray(json.tags)).toBe(true);
    expect(json.tags.length).toBeGreaterThan(0);
    expect(json.total).toBe(json.tags.length);
  });

  it("should return tags sorted alphabetically", async () => {
    const request = new Request("http://localhost/api/tags", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    const json = await response.json();

    const sorted = [...json.tags].sort();
    expect(json.tags).toEqual(sorted);
  });

  it("should return unique tags with no duplicates", async () => {
    const request = new Request("http://localhost/api/tags", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    const json = await response.json();

    const unique = [...new Set(json.tags)];
    expect(json.tags).toEqual(unique);
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/tags");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/tags", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
