import { NextResponse } from "next/server";

import { cvData } from "@/lib/constants/cv-data";

export const runtime = "edge";

export async function GET(_request: Request) {
  try {
    return NextResponse.json(cvData);
  } catch (error) {
    console.error("Error fetching CV data:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching CV data" },
      { status: 500 },
    );
  }
}
