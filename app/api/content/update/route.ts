import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/anthropic";

export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
  id: z.string().min(1),
  // Status change
  status: z.enum(["DRAFT", "APPROVED", "PUBLISHED", "REJECTED"]).optional(),
  // Editorial edits
  title: z.string().min(1).max(500).optional(),
  excerpt: z.string().max(2000).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  authorName: z.string().max(200).optional(),
  reviewedBy: z.string().max(200).optional(),
  // Slug edits (only allowed when in draft)
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80).optional(),
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

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, ...updates } = parsed.data;

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Build update payload
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.metaTitle !== undefined) updateData.metaTitle = updates.metaTitle;
    if (updates.metaDescription !== undefined) updateData.metaDescription = updates.metaDescription;
    if (updates.authorName !== undefined) updateData.authorName = updates.authorName;
    if (updates.reviewedBy !== undefined) updateData.reviewedBy = updates.reviewedBy;

    // Slug edits only allowed before publishing
    if (updates.slug !== undefined && existing.status !== "PUBLISHED") {
      // Ensure no collision
      const collision = await prisma.article.findUnique({ where: { slug: updates.slug } });
      if (collision && collision.id !== id) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
      updateData.slug = updates.slug;
    }

    // Status change: set publishedAt when transitioning to PUBLISHED
    if (updates.status !== undefined) {
      updateData.status = updates.status;
      if (updates.status === "PUBLISHED" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: updated.id,
      slug: updated.slug,
      status: updated.status,
    });
  } catch (e) {
    console.error("Article update failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
