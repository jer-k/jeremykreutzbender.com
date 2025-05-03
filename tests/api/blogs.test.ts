import { GET } from "@/app/api/blogs/route";
/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

describe("/api/blogs", () => {
  function createRequest(searchParams = {}) {
    const url = new URL("https://jeremykreutzbender.com/api/blogs");

    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });

    return new NextRequest(url);
  }

  it("should return paginated posts", async () => {
    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("posts");
    expect(data).toHaveProperty("pagination");
    expect(data.posts).toBeInstanceOf(Array);

    expect(data.posts[0]).not.toHaveProperty("content");
    expect(data.posts[0]).not.toHaveProperty("draft");

    expect(data.posts[0]).toHaveProperty("title");
    expect(data.posts[0]).toHaveProperty("slug");
    expect(data.posts[0]).toHaveProperty("date");
  });

  it("should handle pagination parameters correctly", async () => {
    const request = createRequest({ page: "2", limit: "10" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(10);
  });

  it("should apply default pagination when parameters are missing", async () => {
    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(100);
  });

  it("should handle invalid pagination parameters gracefully", async () => {
    const request = createRequest({ page: "invalid", limit: "invalid" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(100);
  });

  it("should handle negative pagination parameters gracefully", async () => {
    const request = createRequest({ page: "-1", limit: "-10" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(100);
  });
});
