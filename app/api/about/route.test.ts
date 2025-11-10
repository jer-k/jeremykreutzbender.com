import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/about", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return about data with valid API key", async () => {
    const request = new Request("http://localhost/api/about", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual({
      name: "Jeremy Kreutzbender",
      email: "jeremykreutzbender@gmail.com",
      website: "jeremykreutzbender.com",
    });
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/about");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/about", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized - Invalid API key",
    });
  });
});
