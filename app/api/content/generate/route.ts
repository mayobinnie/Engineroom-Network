import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { generateContent, slugify } from "@/lib/anthropic";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow up to 60s for Anthropic API

const RequestSchema = z.object({
  type: z.enum(["ARTICLE", "COMMENTARY", "LINKEDIN", "EMAIL"]),
  topic: z.string().min(3).max(500),
  seoKeyword: z.string().max(200).optional(),
  sourceUrl: z.string().url().optional(),
  sourceTitle: z.string().max(500).optional(),
  sourceName: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
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

  const data = parsed.data;

  try {
    const generated = await generateContent({
      type: data.type,
      topic: data.topic,
      seoKeyword: data.seoKeyword,
      sourceUrl: data.sourceUrl,
      sourceTitle: data.sourceTitle,
      sourceName: data.sourceName,
    });

    // Generate a unique slug, append suffix if collision
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
        type: data.type,
        status: "DRAFT",
        title: generated.title,
        excerpt: generated.excerpt,
        content: generated.content,
        seoKeyword: data.seoKeyword,
        sourceUrl: data.sourceUrl,
        sourceTitle: data.sourceTitle,
        sourceName: data.sourceName,
        tags: generated.tags,
        generatedByAI: true,
      },
    });

    return NextResponse.json({
      id: article.id,
      slug: article.slug,
      title: article.title,
    });
  } catch (e) {
    console.error("Content generation failed:", e);
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
