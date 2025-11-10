import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/cv/jobs", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return jobs data with valid API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0]).toHaveProperty("companyName");
    expect(json[0]).toHaveProperty("title");
    expect(json[0]).toHaveProperty("workType");
    expect(json[0]).toHaveProperty("duration");
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/cv/jobs", {
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
