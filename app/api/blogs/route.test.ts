import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

// Mock the fetchPosts function
vi.mock("@/lib/fetch-posts", () => ({
  fetchPosts: vi.fn(() =>
    Promise.resolve([
      {
        slug: "test-post-1",
        title: "Test Post 1",
        date: "2024-01-01",
        tags: ["test"],
        content: "Test content 1",
        draft: false,
      },
      {
        slug: "test-post-2",
        title: "Test Post 2",
        date: "2024-01-02",
        tags: ["test"],
        content: "Test content 2",
        draft: false,
      },
    ]),
  ),
}));

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
    expect(json.posts).toHaveLength(2);
    expect(json.posts[0]).not.toHaveProperty("content");
    expect(json.posts[0]).not.toHaveProperty("draft");
    expect(json.pagination).toEqual({
      page: 1,
      limit: 100,
      totalPosts: 2,
      totalPages: 1,
    });
  });

  it("should support pagination with page and limit params", async () => {
    const request = new NextRequest("http://localhost/api/blogs?page=1&limit=1", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.posts).toHaveLength(1);
    expect(json.pagination).toEqual({
      page: 1,
      limit: 1,
      totalPosts: 2,
      totalPages: 2,
    });
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
