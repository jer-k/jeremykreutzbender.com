import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/social-links/route";

describe("GET /api/social-links", () => {
  const mockApiKey = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("API_SECRET_KEY", mockApiKey);
  });

  it("should return social links with valid API key", async () => {
    const request = new Request("http://localhost/api/social-links", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("github");
    expect(json).toHaveProperty("twitter");
    expect(json).toHaveProperty("linkedin");
    expect(json.github).toHaveProperty("profile");
    expect(json.github).toHaveProperty("repo");
  });

  it("should return valid URLs", async () => {
    const request = new Request("http://localhost/api/social-links", {
      headers: {
        authorization: `Bearer ${mockApiKey}`,
      },
    });

    const response = await GET(request);
    const json = await response.json();

    expect(json.github.profile).toMatch(/^https:\/\/github\.com\//);
    expect(json.github.repo).toMatch(/^https:\/\/github\.com\//);
    expect(json.twitter).toMatch(/^https:\/\/twitter\.com\//);
    expect(json.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
  });

  it("should return 401 without API key", async () => {
    const request = new Request("http://localhost/api/social-links");

    const response = await GET(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  it("should return 401 with invalid API key", async () => {
    const request = new Request("http://localhost/api/social-links", {
      headers: {
        authorization: "Bearer wrong-key",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
