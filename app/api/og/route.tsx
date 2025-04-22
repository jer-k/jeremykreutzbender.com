import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const date = searchParams.get("date");
    const description = searchParams.get("description");

    const geistSansRegular = await fetch(
      new URL("@/public/fonts/Geist-Regular.otf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    const geistSansBold = await fetch(
      new URL("@/public/fonts/Geist-Bold.otf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #FAFAF0, #F8E08E)",
          fontFamily: "Geist Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAFAF0",
            width: "80%",
            height: "80%",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#0F0A0A",
                margin: "0 0 20px 0",
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: "24px",
                  color: "#0F0A0A",
                  margin: "0 0 20px 0",
                }}
              >
                {description}
              </p>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <span style={{ fontSize: "18px", color: "#0F0A0A" }}>
                jeremykreutzbender.com
              </span>
              {date && (
                <span style={{ fontSize: "18px", color: "#0F0A0A" }}>
                  {date}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Geist Sans",
            data: geistSansRegular,
            style: "normal",
            weight: 400,
          },
          {
            name: "Geist Sans",
            data: geistSansBold,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );
  } catch (_) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
