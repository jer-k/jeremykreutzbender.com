import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/search-console", () => ({
  fetchTopQueries: vi.fn().mockResolvedValue([
    {
      query: "jeremy kreutzbender",
      clicks: 50,
      impressions: 200,
      ctr: 0.25,
      position: 1.2,
    },
    {
      query: "next.js blog tutorial",
      clicks: 30,
      impressions: 500,
      ctr: 0.06,
      position: 8.5,
    },
  ]),
  fetchTopPages: vi.fn().mockResolvedValue([
    {
      page: "https://jeremykreutzbender.com/blog/getting-started",
      clicks: 40,
      impressions: 300,
      ctr: 0.133,
      position: 3.2,
    },
    {
      page: "https://jeremykreutzbender.com/",
      clicks: 35,
      impressions: 150,
      ctr: 0.233,
      position: 1.5,
    },
  ]),
  fetchSearchSummary: vi.fn().mockResolvedValue({
    startDate: "2026-03-05",
    endDate: "2026-04-02",
    totalClicks: 500,
    totalImpressions: 5000,
    averageCtr: 0.1,
    averagePosition: 12.3,
  }),
}));

import { GET as getTopQueries } from "@/app/api/search-stats/top-queries/route";
import { GET as getTopPages } from "@/app/api/search-stats/top-pages/route";
import { GET as getSummary } from "@/app/api/search-stats/summary/route";

describe("GET /api/search-stats/top-queries", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return top queries with valid API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/top-queries",
      {
        headers: { authorization: `Bearer ${mockApiKey}` },
      },
    );

    const response = await getTopQueries(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("queries");
    expect(json).toHaveProperty("days", 28);
    expect(json).toHaveProperty("total", 2);
    expect(Array.isArray(json.queries)).toBe(true);
    expect(json.queries[0]).toHaveProperty("query");
    expect(json.queries[0]).toHaveProperty("clicks");
    expect(json.queries[0]).toHaveProperty("impressions");
    expect(json.queries[0]).toHaveProperty("ctr");
    expect(json.queries[0]).toHaveProperty("position");
  });

  it("should accept custom days and limit params", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/top-queries?days=7&limit=5",
      {
        headers: { authorization: `Bearer ${mockApiKey}` },
      },
    );

    const response = await getTopQueries(request);
    const json = await response.json();
    expect(json.days).toBe(7);
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/top-queries",
    );

    const response = await getTopQueries(request);
    expect(response.status).toBe(401);
  });
});

describe("GET /api/search-stats/top-pages", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return top pages with valid API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/top-pages",
      {
        headers: { authorization: `Bearer ${mockApiKey}` },
      },
    );

    const response = await getTopPages(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("pages");
    expect(json).toHaveProperty("days", 28);
    expect(json).toHaveProperty("total", 2);
    expect(json.pages[0]).toHaveProperty("page");
    expect(json.pages[0]).toHaveProperty("clicks");
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/top-pages",
    );

    const response = await getTopPages(request);
    expect(response.status).toBe(401);
  });
});

describe("GET /api/search-stats/summary", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return search summary with valid API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/summary",
      {
        headers: { authorization: `Bearer ${mockApiKey}` },
      },
    );

    const response = await getSummary(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("startDate");
    expect(json).toHaveProperty("endDate");
    expect(json).toHaveProperty("totalClicks");
    expect(json).toHaveProperty("totalImpressions");
    expect(json).toHaveProperty("averageCtr");
    expect(json).toHaveProperty("averagePosition");
  });

  it("should accept custom days param", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/summary?days=90",
      {
        headers: { authorization: `Bearer ${mockApiKey}` },
      },
    );

    const response = await getSummary(request);
    expect(response.status).toBe(200);
  });

  it("should return 401 without API key", async () => {
    const request = new NextRequest(
      "http://localhost/api/search-stats/summary",
    );

    const response = await getSummary(request);
    expect(response.status).toBe(401);
  });
});
