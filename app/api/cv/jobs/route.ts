import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/auth";
import { cvData } from "@/lib/constants/cv-data";

export const runtime = "edge";

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) {
    return authError;
  }
  try {
    const jobs = cvData.jobs;
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs data:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching jobs data" },
      { status: 500 },
    );
  }
}
