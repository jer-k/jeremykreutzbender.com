import { isValidElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type ImageResponseOptions = {
  width: number;
  height: number;
  fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style: string;
    weight: number;
  }>;
};

const { imageResponseMock } = vi.hoisted(() => ({
  imageResponseMock: vi.fn(function ImageResponse(
    _element: ReactNode,
    _options: ImageResponseOptions,
  ) {
    return new Response("mock-og-image", {
      headers: {
        "content-type": "image/png",
      },
    });
  }),
}));

vi.mock("next/og", () => ({
  ImageResponse: imageResponseMock,
}));

import { GET, runtime } from "@/app/api/og/route";

function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join(" ");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textContent(node.props.children);
  }

  return "";
}

describe("GET /api/og", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        arrayBuffer: async () => new ArrayBuffer(8),
      })),
    );
  });

  it("runs on the edge runtime", () => {
    expect(runtime).toBe("edge");
  });

  it("builds an OG image from query params", async () => {
    const request = new Request(
      "http://localhost/api/og?title=Testing%20OG&date=June%2017%2C%202026&description=A%20local%20preview",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(imageResponseMock).toHaveBeenCalledTimes(1);

    const [element, options] = imageResponseMock.mock.calls[0];
    expect(textContent(element)).toContain("Testing OG");
    expect(textContent(element)).toContain("June 17, 2026");
    expect(textContent(element)).toContain("A local preview");
    expect(textContent(element)).toContain("jeremykreutzbender.com");

    expect(options).toMatchObject({
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Sans",
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist Sans",
          style: "normal",
          weight: 700,
        },
      ],
    });
  });
});
