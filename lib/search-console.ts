import "server-only";

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const searchconsole = google.searchconsole({ version: "v1", auth });

const SITE_URL = "sc-domain:jeremykreutzbender.com";

export async function fetchTopQueries(days = 28, limit = 20) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3); // data has 2-3 day delay
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions: ["query"],
      rowLimit: limit,
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: Math.round((row.ctr ?? 0) * 1000) / 1000,
    position: Math.round((row.position ?? 0) * 10) / 10,
  }));
}

export async function fetchTopPages(days = 28, limit = 20) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions: ["page"],
      rowLimit: limit,
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    page: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: Math.round((row.ctr ?? 0) * 1000) / 1000,
    position: Math.round((row.position ?? 0) * 10) / 10,
  }));
}

export async function fetchSearchSummary(days = 28) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
  });

  const rows = response.data.rows ?? [];
  if (rows.length === 0) {
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      totalClicks: 0,
      totalImpressions: 0,
      averageCtr: 0,
      averagePosition: 0,
    };
  }

  const row = rows[0];
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    totalClicks: row.clicks ?? 0,
    totalImpressions: row.impressions ?? 0,
    averageCtr: Math.round((row.ctr ?? 0) * 1000) / 1000,
    averagePosition: Math.round((row.position ?? 0) * 10) / 10,
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
