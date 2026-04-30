import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Weekly SEO content batch.
 *
 * Triggered by Vercel Cron (configured in vercel.json) every Wednesday 9am UTC.
 * Calls /api/content/batch with a curated keyword list for marine engineering.
 *
 * Auth: Bearer token must match CRON_SECRET env var.
 *
 * To customise the keyword list, edit MARINE_ENGINEERING_KEYWORDS below.
 */

// Marine engineering keyword list. Picked for SEO relevance: questions
// engineers actually search for when researching equipment, fault diagnosis,
// or sourcing. Each generates one ~800 word draft article per cron run.
//
// Edit this list as understanding of demand develops. Keep short (2-3 per
// week) so admins can review without falling behind.
const MARINE_ENGINEERING_KEYWORDS = [
  "MAN B&W ME-C engine common faults and troubleshooting",
  "Marine turbocharger maintenance schedule and overhaul intervals",
];

export async function GET(request: Request) {
  // Verify cron auth
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Forward to batch endpoint with the same auth
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/content/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({
        type: "ARTICLE",
        keywords: MARINE_ENGINEERING_KEYWORDS,
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      cron: "seo-batch",
      ranAt: new Date().toISOString(),
      result,
    });
  } catch (e) {
    console.error("Cron seo-batch failed:", e);
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
  }
}
