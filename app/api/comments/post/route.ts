import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PostSchema = z.object({
  content: z.string().min(2).max(5000),
  targetType: z.enum(["ARTICLE", "VESSEL_CLASS"]),
  targetId: z.string().min(1),
  parentCommentId: z.string().optional(),
});

export async function POST(request: Request) {
  // Must be authenticated
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Ensure User row exists
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: "Unable to load user" }, { status: 500 });
  }

  // Check ban status
  if (user.commentsBanned) {
    return NextResponse.json(
      { error: "Your account is not currently allowed to post comments. Contact support." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Verify the target exists and is published
  if (data.targetType === "ARTICLE") {
    const article = await prisma.article.findUnique({ where: { id: data.targetId } });
    if (!article || article.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }
    if (article.type !== "ARTICLE" && article.type !== "COMMENTARY") {
      return NextResponse.json({ error: "Cannot comment on this content type" }, { status: 400 });
    }
  } else if (data.targetType === "VESSEL_CLASS") {
    const vessel = await prisma.vesselClass.findUnique({ where: { id: data.targetId } });
    if (!vessel || !vessel.isPublished) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }
  }

  // If replying, verify parent exists and is on the same target. Disallow
  // reply-to-reply (only one level of threading).
  if (data.parentCommentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: data.parentCommentId },
    });
    if (!parent) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
    }
    if (parent.targetType !== data.targetType || parent.targetId !== data.targetId) {
      return NextResponse.json({ error: "Parent comment is on a different target" }, { status: 400 });
    }
    if (parent.parentCommentId) {
      return NextResponse.json({ error: "Cannot reply to a reply (one level only)" }, { status: 400 });
    }
    if (parent.isHidden) {
      return NextResponse.json({ error: "Cannot reply to a hidden comment" }, { status: 400 });
    }
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        targetType: data.targetType,
        targetId: data.targetId,
        authorUserId: user.id,
        parentCommentId: data.parentCommentId,
      },
    });

    return NextResponse.json({ id: comment.id });
  } catch (e) {
    console.error("Comment post failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
