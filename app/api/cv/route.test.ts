import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

// Mock the cvData
vi.mock("@/lib/constants/cv-data", () => ({
  cvData: {
    name: "Test User",
    jobs: [
      {
        company: "Test Company",
        title: "Test Title",
        startDate: "2020-01-01",
        endDate: "2021-01-01",
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

describe("GET /api/cv", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return CV data with valid API key", async () => {
    const request = new Request("http://localhost/api/cv", {
      headers: {
        "x-api-key": mockApiKey,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("name");
    expect(json).toHaveProperty("jobs");
    expect(json).toHaveProperty("schools");
    expect(json.name).toBe("Test User");
    expect(json.jobs).toHaveLength(1);
    expect(json.schools).toHaveLength(1);
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/cv");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid or missing API key",
    });
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/cv", {
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
