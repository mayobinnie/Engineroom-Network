import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ReportSchema = z.object({
  id: z.string().min(1),
});

export async function POST(request: Request) {
  // Must be authenticated to report
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { id } = parsed.data;

  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: {
        isReported: true,
        reportCount: { increment: 1 },
      },
    });
    return NextResponse.json({ reported: true, count: updated.reportCount });
  } catch (e) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
}
