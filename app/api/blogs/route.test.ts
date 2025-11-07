import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/blogs", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return paginated blog posts with valid API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("posts");
    expect(json).toHaveProperty("pagination");
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBeGreaterThan(0);
    expect(json.posts[0]).not.toHaveProperty("content");
    expect(json.posts[0]).not.toHaveProperty("draft");
    expect(json.posts[0]).toHaveProperty("slug");
    expect(json.posts[0]).toHaveProperty("title");
    expect(json.pagination).toHaveProperty("page");
    expect(json.pagination).toHaveProperty("limit");
    expect(json.pagination).toHaveProperty("totalPosts");
    expect(json.pagination).toHaveProperty("totalPages");
  });

  it("should support pagination with page and limit params", async () => {
    const request = new NextRequest("http://localhost/api/blogs?page=1&limit=5", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.posts.length).toBeLessThanOrEqual(5);
    expect(json.pagination.page).toBe(1);
    expect(json.pagination.limit).toBe(5);
  });

  it("should handle invalid page numbers gracefully", async () => {
    const request = new NextRequest("http://localhost/api/blogs?page=-1", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.pagination.page).toBe(1);
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs", {
      headers: {
        "x-api-key": "wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
