import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/blogs/search/route";

describe("GET /api/blogs/search", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return matching posts for a valid query", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/search?q=getting+started",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("query", "getting started");
    expect(json).toHaveProperty("posts");
    expect(json).toHaveProperty("total");
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBeGreaterThan(0);
    expect(json.total).toBe(json.posts.length);
  });

  it("should not include content or draft in results", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/search?q=getting+started",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    const json = await response.json();

    for (const post of json.posts) {
      expect(post).not.toHaveProperty("content");
      expect(post).not.toHaveProperty("draft");
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
    }
  });

  it("should search across tags", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/search?q=blogging",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    const json = await response.json();

    expect(json.posts.length).toBeGreaterThan(0);
  });

  it("should be case-insensitive", async () => {
    const requestLower = new NextRequest(
      "http://localhost/api/blogs/search?q=docker",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const requestUpper = new NextRequest(
      "http://localhost/api/blogs/search?q=Docker",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const responseLower = await GET(requestLower);
    const responseUpper = await GET(requestUpper);

    const jsonLower = await responseLower.json();
    const jsonUpper = await responseUpper.json();

    expect(jsonLower.total).toBe(jsonUpper.total);
  });

  it("should return empty results for non-matching query", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/search?q=xyznonexistent123",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.posts).toEqual([]);
    expect(json.total).toBe(0);
  });

  it("should return 400 when query parameter is missing", async () => {
    const request = new NextRequest("http://localhost/api/blogs/search", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 400 when query is empty", async () => {
    const request = new NextRequest("http://localhost/api/blogs/search?q=", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest("http://localhost/api/blogs/search?q=test");

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/blogs/search?q=test",
      {
        headers: {
          authorization: "Bearer wrong-key",
        },
      },
    );

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
