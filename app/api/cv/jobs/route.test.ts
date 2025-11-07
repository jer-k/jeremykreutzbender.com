import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

// Mock the cvData
vi.mock("@/lib/constants/cv-data", () => ({
  cvData: {
    name: "Test User",
    jobs: [
      {
        company: "Test Company 1",
        title: "Test Title 1",
        startDate: "2020-01-01",
        endDate: "2021-01-01",
      },
      {
        company: "Test Company 2",
        title: "Test Title 2",
        startDate: "2021-01-01",
        endDate: "2022-01-01",
      },
    ],
    schools: [
      {
        name: "Test School",
        degree: "Test Degree",
        startDate: "2015-01-01",
        endDate: "2019-01-01",
      },
    ],
  },
}));

describe("GET /api/cv/jobs", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return jobs data with valid API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveLength(2);
    expect(json[0].company).toBe("Test Company 1");
    expect(json[1].company).toBe("Test Company 2");
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs", {
      headers: {
        "x-api-key": "wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });
});
