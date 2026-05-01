import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AdminActionSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["hide", "unhide", "pin", "unpin", "ban-author", "unban-author"]),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get admin email for audit trail
  const user = await currentUser();
  const adminEmail = user?.emailAddresses[0]?.emailAddress ?? "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AdminActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { id, action } = parsed.data;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  try {
    if (action === "hide") {
      await prisma.comment.update({
        where: { id },
        data: {
          isHidden: true,
          hiddenAt: new Date(),
          hiddenBy: adminEmail,
          isReported: false, // clear report flag once handled
        },
      });
    } else if (action === "unhide") {
      await prisma.comment.update({
        where: { id },
        data: { isHidden: false, hiddenAt: null, hiddenBy: null },
      });
    } else if (action === "pin") {
      await prisma.comment.update({ where: { id }, data: { isPinned: true } });
    } else if (action === "unpin") {
      await prisma.comment.update({ where: { id }, data: { isPinned: false } });
    } else if (action === "ban-author") {
      await prisma.user.update({
        where: { id: comment.authorUserId },
        data: { commentsBanned: true },
      });
    } else if (action === "unban-author") {
      await prisma.user.update({
        where: { id: comment.authorUserId },
        data: { commentsBanned: false },
      });
    }

    return NextResponse.json({ success: true, action });
  } catch (e) {
    console.error("Admin comment action failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
