import { ImageResponse } from "next/og";

//import { GeistMono } from "geist/font/mono";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const date = searchParams.get("date");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFF",
          }}
        >
          <div tw="flex flex-col items-center bg-primary w-full p-10">
            <div tw="flex max-w-screen-md">
              <h1 tw="text-4xl">{title}</h1>
            </div>
            <div tw="flex flex-row items-start justify-between w-full mt-4">
              <span tw="text-lg">jeremykreutzbender.com</span>
              {date && <span tw="text-lg">{date}</span>}
            </div>
          </div>
        </div>
      ),
      {
        // fonts: [
        //   {
        //     name: "GeistMono",
        //     data: [],
        //     weight: 500,
        //   },
        // ],
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
