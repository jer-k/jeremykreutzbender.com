import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/markdown/blog/[slug]", () => {
  it("should return markdown content for existing post", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/getting-started",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "getting-started" });
    const response = await GET(request, { params });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );

    const content = await response.text();
    expect(content).toContain("---");
    expect(content).toContain("title:");
    expect(content).toContain("Getting Started");
  });

  it("should hydrate frontmatter references", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/getting-started",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "getting-started" });
    const response = await GET(request, { params });
    const content = await response.text();

    // Should replace {frontmatter.title} with actual title
    expect(content).not.toContain("{frontmatter.title}");
    expect(content).toContain(
      "# Getting Started - Another Attempt at Blogging",
    );

    // Should replace {frontmatter.date} with actual date
    expect(content).not.toContain("{frontmatter.date}");
    expect(content).toContain("2018-02-17");
  });

  it("should remove self-closing JSX components", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/getting-started",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "getting-started" });
    const response = await GET(request, { params });
    const content = await response.text();

    // Should remove self-closing JSX components
    expect(content).not.toContain("<PublishedOnOldBlog />");
  });

  it("should extract content from JSX components with children", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/app-router-dynamic-breadcrumbs",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "app-router-dynamic-breadcrumbs" });
    const response = await GET(request, { params });
    const content = await response.text();

    // Should remove JSX tags but keep content
    expect(content).not.toContain("<Aside");
    expect(content).not.toContain("</Aside>");

    // Should convert heading attribute to bold prefix
    expect(content).toContain(
      "**This feature is fully functional in Next.js 15:**",
    );

    // Should preserve the inner content
    expect(content).toContain("This blog post has been updated");
    expect(content).toContain("jer-k/parallel-routes");
  });

  it("should return 404 for non-existent post", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/non-existent",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "non-existent" });
    const response = await GET(request, { params });
    expect(response.status).toBe(404);

    const text = await response.text();
    expect(text).toBe("Post not found");
  });

  it("should return markdown content for third-party posts from local files", async () => {
    const request = new NextRequest(
      "http://localhost/api/markdown/blog/cache-bundle-install-with-buildkit",
      {
        headers: {
          accept: "text/markdown",
        },
      },
    );

    const params = Promise.resolve({ slug: "cache-bundle-install-with-buildkit" });
    const response = await GET(request, { params });

    // Should return 200 with local content, not redirect
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );

    const content = await response.text();
    expect(content).toContain("Cache Bundle Install with BuildKit");
    expect(content).toContain("BuildKit");
  });
});
