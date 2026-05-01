import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
  id: z.string().min(1),
  // Either edit content or soft-delete (delete = mark hidden by user themselves)
  content: z.string().min(2).max(5000).optional(),
  delete: z.boolean().optional(),
});

export async function POST(request: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: "Unable to load user" }, { status: 500 });
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

  const { id, content, delete: shouldDelete } = parsed.data;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Must be the author
  if (comment.authorUserId !== user.id) {
    return NextResponse.json({ error: "Not your comment" }, { status: 403 });
  }

  try {
    if (shouldDelete) {
      // Hard delete the comment. Replies cascade.
      await prisma.comment.delete({ where: { id } });
      return NextResponse.json({ deleted: true });
    } else if (content) {
      const updated = await prisma.comment.update({
        where: { id },
        data: { content, isEdited: true },
      });
      return NextResponse.json({ id: updated.id });
    } else {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
  } catch (e) {
    console.error("Comment update failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
