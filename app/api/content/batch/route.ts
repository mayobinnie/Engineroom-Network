import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { generateContent, slugify } from "@/lib/anthropic";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // up to 5 min for batch

const RequestSchema = z.object({
  type: z.enum(["ARTICLE", "COMMENTARY", "LINKEDIN", "EMAIL"]).default("ARTICLE"),
  keywords: z.array(z.string().min(3).max(200)).min(1).max(10),
});

/**
 * Batch content generation. Used for weekly SEO batch via cron, or manually
 * from the admin UI. Generates one piece per keyword with 500ms pause between
 * to avoid rate limits.
 *
 * Auth: this endpoint accepts EITHER an admin session OR a Bearer token
 * matching CRON_SECRET (used by Vercel cron).
 */
export async function POST(request: Request) {
  // Check auth: admin session OR cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isCronCall = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isAdminCall = await isAdmin();

  if (!isCronCall && !isAdminCall) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { type, keywords } = parsed.data;
  const results: Array<{ keyword: string; success: boolean; slug?: string; error?: string }> = [];

  for (const keyword of keywords) {
    try {
      const generated = await generateContent({
        type,
        topic: keyword,
        seoKeyword: keyword,
      });

      let baseSlug = slugify(generated.title);
      if (!baseSlug) baseSlug = `draft-${Date.now()}`;
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const article = await prisma.article.create({
        data: {
          slug,
          type,
          status: "DRAFT",
          title: generated.title,
          excerpt: generated.excerpt,
          content: generated.content,
          seoKeyword: keyword,
          tags: generated.tags,
          generatedByAI: true,
        },
      });

      results.push({ keyword, success: true, slug: article.slug });

      // Pause to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      console.error(`Batch generation failed for "${keyword}":`, e);
      const message = e instanceof Error ? e.message : "Unknown error";
      results.push({ keyword, success: false, error: message });
    }
  }

  return NextResponse.json({
    total: keywords.length,
    succeeded: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}
