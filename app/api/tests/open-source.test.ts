import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/github", () => ({
  openSourcePullRequests: vi.fn().mockResolvedValue([
    {
      createdAt: "2024-01-15T10:00:00Z",
      number: 42,
      title: "Fix typo in README",
      bodyHTML: "<p>Fixed a typo</p>",
      permalink: "https://github.com/some-org/some-repo/pull/42",
      repository: {
        name: "some-repo",
        nameWithOwner: "some-org/some-repo",
        url: "https://github.com/some-org/some-repo",
        owner: { login: "some-org" },
      },
    },
    {
      createdAt: "2024-02-20T10:00:00Z",
      number: 99,
      title: "Add feature flag support",
      bodyHTML: "<p>Added feature flags</p>",
      permalink: "https://github.com/other-org/other-repo/pull/99",
      repository: {
        name: "other-repo",
        nameWithOwner: "other-org/other-repo",
        url: "https://github.com/other-org/other-repo",
        owner: { login: "other-org" },
      },
    },
    {
      createdAt: "2024-03-10T10:00:00Z",
      number: 150,
      title: "Update dependencies",
      bodyHTML: "<p>Bumped deps</p>",
      permalink: "https://github.com/third-org/third-repo/pull/150",
      repository: {
        name: "third-repo",
        nameWithOwner: "third-org/third-repo",
        url: "https://github.com/third-org/third-repo",
        owner: { login: "third-org" },
      },
    },
  ]),
}));

import { GET } from "@/app/api/open-source/route";

describe("GET /api/open-source", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return pull requests with valid API key", async () => {
    const request = new NextRequest("http://localhost/api/open-source", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("pullRequests");
    expect(json).toHaveProperty("pagination");
    expect(Array.isArray(json.pullRequests)).toBe(true);
    expect(json.pullRequests.length).toBe(3);
    expect(json.pagination.total).toBe(3);
  });

  it("should exclude bodyHTML from results", async () => {
    const request = new NextRequest("http://localhost/api/open-source", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    const json = await response.json();

    for (const pr of json.pullRequests) {
      expect(pr).not.toHaveProperty("bodyHTML");
      expect(pr).toHaveProperty("title");
      expect(pr).toHaveProperty("permalink");
      expect(pr).toHaveProperty("repository");
    }
  });

  it("should support pagination", async () => {
    const request = new NextRequest(
      "http://localhost/api/open-source?page=1&limit=2",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    const json = await response.json();

    expect(json.pullRequests.length).toBe(2);
    expect(json.pagination.page).toBe(1);
    expect(json.pagination.limit).toBe(2);
    expect(json.pagination.total).toBe(3);
    expect(json.pagination.totalPages).toBe(2);
  });

  it("should return second page of results", async () => {
    const request = new NextRequest(
      "http://localhost/api/open-source?page=2&limit=2",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    const json = await response.json();

    expect(json.pullRequests.length).toBe(1);
    expect(json.pagination.page).toBe(2);
  });

  it("should handle invalid page numbers gracefully", async () => {
    const request = new NextRequest(
      "http://localhost/api/open-source?page=-1",
      {
        headers: {
          authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    const response = await GET(request);
    const json = await response.json();

    expect(json.pagination.page).toBe(1);
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest("http://localhost/api/open-source");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new NextRequest("http://localhost/api/open-source", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
