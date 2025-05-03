/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "@/app/api/blogs/[slug]/route";

// Mock the fetchPost function
jest.mock("@/lib/fetchPosts", () => ({
  fetchPost: jest.fn((slug) => {
    if (slug === "getting-started") {
      return Promise.resolve({
        title: "Getting Started - Another Attempt at Blogging",
        date: "2018-02-17",
        draft: false,
        slug: "getting-started",
        category: "Thoughts",
        description: "A new year, a new attempt at blogging!",
        tags: ["blogging"],
        content: "Sample content here"
      });
    }
    return Promise.resolve(null);
  }),
}));

describe("/api/blogs/[slug]", () => {
  const fetchPostMock = require("@/lib/fetchPosts").fetchPost;
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("should return post data when valid slug is provided", async () => {
    const response = await GET({} as NextRequest, { 
      params: Promise.resolve({ slug: "getting-started" }) 
    });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("slug", "getting-started");
    expect(data).toHaveProperty("content");
    expect(fetchPostMock).toHaveBeenCalledWith("getting-started");
  });
  
  it("should return 404 when post is not found", async () => {
    const response = await GET({} as NextRequest, { 
      params: Promise.resolve({ slug: "non-existent-post" }) 
    });
    const data = await response.json();
    
    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Post not found");
    expect(fetchPostMock).toHaveBeenCalledWith("non-existent-post");
  });
  
  it("should return 400 when slug parameter is missing", async () => {
    const response = await GET({} as NextRequest, { 
      params: Promise.resolve({ slug: "" }) 
    });
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Slug parameter is required");
  });
  
  it("should handle error in fetchPost", async () => {
    // Override the mock to throw an error for this test
    fetchPostMock.mockRejectedValueOnce(new Error("Test error"));
    
    const response = await GET({} as NextRequest, { 
      params: Promise.resolve({ slug: "getting-started" }) 
    });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Internal Server Error");
  });
});