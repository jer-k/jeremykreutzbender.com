import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/cv", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return CV data with valid API key", async () => {
    const request = new Request("http://localhost/api/cv", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("personalInfo");
    expect(json).toHaveProperty("jobs");
    expect(json).toHaveProperty("schools");
    expect(json.personalInfo).toHaveProperty("name");
    expect(Array.isArray(json.jobs)).toBe(true);
    expect(Array.isArray(json.schools)).toBe(true);
    expect(json.jobs.length).toBeGreaterThan(0);
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/cv");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/cv", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });
});
