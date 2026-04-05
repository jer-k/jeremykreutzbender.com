import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/blogs/by-tag/[tag]/route";

describe("GET /api/blogs/by-tag/[tag]", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return posts matching a tag", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/blogging",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const params = Promise.resolve({ tag: "blogging" });
    const response = await GET(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("tag", "blogging");
    expect(json).toHaveProperty("posts");
    expect(json).toHaveProperty("total");
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBeGreaterThan(0);
    expect(json.total).toBe(json.posts.length);
  });

  it("should not include content or draft in results", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/blogging",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const params = Promise.resolve({ tag: "blogging" });
    const response = await GET(request, { params });
    const json = await response.json();

    for (const post of json.posts) {
      expect(post).not.toHaveProperty("content");
      expect(post).not.toHaveProperty("draft");
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
    }
  });

  it("should be case-insensitive", async () => {
    const requestLower = new NextRequest(
      "http://localhost/api/blogs/by-tag/blogging",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const requestUpper = new NextRequest(
      "http://localhost/api/blogs/by-tag/Blogging",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const paramsLower = Promise.resolve({ tag: "blogging" });
    const paramsUpper = Promise.resolve({ tag: "Blogging" });

    const responseLower = await GET(requestLower, { params: paramsLower });
    const responseUpper = await GET(requestUpper, { params: paramsUpper });

    const jsonLower = await responseLower.json();
    const jsonUpper = await responseUpper.json();

    expect(jsonLower.total).toBe(jsonUpper.total);
    expect(jsonLower.total).toBeGreaterThan(0);
  });

  it("should return empty results for non-existent tag", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/nonexistenttag123",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const params = Promise.resolve({ tag: "nonexistenttag123" });
    const response = await GET(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.posts).toEqual([]);
    expect(json.total).toBe(0);
  });

  it("should handle URL-encoded tags", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/ruby%20on%20rails",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const params = Promise.resolve({ tag: "ruby%20on%20rails" });
    const response = await GET(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("tag", "ruby on rails");
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/blogging",
    );

    const params = Promise.resolve({ tag: "blogging" });
    const response = await GET(request, { params });
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/by-tag/blogging",
      {
        headers: {
          authorization: "Bearer wrong-key",
        },
      },
    );

    const params = Promise.resolve({ tag: "blogging" });
    const response = await GET(request, { params });
    expect(response.status).toBe(401);
  });
});
