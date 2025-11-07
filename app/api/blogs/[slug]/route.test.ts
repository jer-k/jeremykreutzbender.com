import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/blogs/[slug]", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return blog post by slug with valid API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs/getting-started", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const params = Promise.resolve({ slug: "getting-started" });
    const response = await GET(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.slug).toBe("getting-started");
    expect(json).toHaveProperty("title");
    expect(json).toHaveProperty("date");
    expect(json).toHaveProperty("tags");
  });

  it("should return 404 for non-existent post", async () => {
    const request = new NextRequest("http://localhost/api/blogs/non-existent", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const params = Promise.resolve({ slug: "non-existent" });
    const response = await GET(request, { params });
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ error: "Post not found" });
  });

  it("should return 400 for missing slug", async () => {
    const request = new NextRequest("http://localhost/api/blogs/", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const params = Promise.resolve({ slug: "" });
    const response = await GET(request, { params });
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ error: "Slug parameter is required" });
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs/existing-post");

    const params = Promise.resolve({ slug: "existing-post" });
    const response = await GET(request, { params });
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs/existing-post", {
      headers: {
        "x-api-key": "wrong-key",
      },
    });

    const params = Promise.resolve({ slug: "existing-post" });
    const response = await GET(request, { params });
    expect(response.status).toBe(401);
  });
});
