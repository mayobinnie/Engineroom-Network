import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { generateContent, slugify } from "@/lib/anthropic";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Take the most recently published article and generate a LinkedIn version
 * of it. Saves the LinkedIn draft to the queue.
 */
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const latestArticle = await prisma.article.findFirst({
      where: { type: "ARTICLE", status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });

    if (!latestArticle) {
      return NextResponse.json(
        { error: "No published articles found. Publish an article first." },
        { status: 404 }
      );
    }

    // Generate a LinkedIn version. Pass a topic that references the article.
    const topic = `Adapt this article for LinkedIn:\n\nTitle: ${latestArticle.title}\n\nExcerpt: ${latestArticle.excerpt ?? ""}\n\nKey points from the article:\n${latestArticle.content.slice(0, 1500)}`;

    const generated = await generateContent({
      type: "LINKEDIN",
      topic,
    });

    let baseSlug = `linkedin-${slugify(latestArticle.title).slice(0, 50)}`;
    if (!baseSlug || baseSlug === "linkedin-") baseSlug = `linkedin-draft-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const linkedinPost = await prisma.article.create({
      data: {
        slug,
        type: "LINKEDIN",
        status: "DRAFT",
        title: generated.title || `LinkedIn: ${latestArticle.title}`,
        excerpt: generated.excerpt,
        content: generated.content,
        tags: generated.tags,
        generatedByAI: true,
        sourceUrl: `https://engineroomnetwork.com/articles/${latestArticle.slug}`,
        sourceTitle: latestArticle.title,
        sourceName: "EngineRoom Network",
      },
    });

    return NextResponse.json({
      id: linkedinPost.id,
      slug: linkedinPost.slug,
      sourceArticle: latestArticle.slug,
    });
  } catch (e) {
    console.error("Social-from-blog generation failed:", e);
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
