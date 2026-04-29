import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const UpdateSchema = z.object({
  summary: z.string().min(10).max(2000),
  description: z.string().min(10).max(20000),
  typicalSize: z.string().max(500).nullable().optional(),
  propulsionNotes: z.string().max(5000).nullable().optional(),
  auxiliaryNotes: z.string().max(5000).nullable().optional(),
  cargoSystemNotes: z.string().max(5000).nullable().optional(),
  commonOEMs: z.string().max(5000).nullable().optional(),
  engineeringChallenges: z.string().max(5000).nullable().optional(),
  sourcingNotes: z.string().max(5000).nullable().optional(),
  isPublished: z.boolean(),
  reviewedBy: z.string().max(200).nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
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

  const data = parsed.data;

  try {
    const updated = await prisma.vesselType.update({
      where: { id },
      data: {
        summary: data.summary,
        description: data.description,
        typicalSize: data.typicalSize || null,
        propulsionNotes: data.propulsionNotes || null,
        auxiliaryNotes: data.auxiliaryNotes || null,
        cargoSystemNotes: data.cargoSystemNotes || null,
        commonOEMs: data.commonOEMs || null,
        engineeringChallenges: data.engineeringChallenges || null,
        sourcingNotes: data.sourcingNotes || null,
        isPublished: data.isPublished,
        reviewedBy: data.reviewedBy || null,
        // If publishing for the first time and reviewer is set, record review time
        ...(data.isPublished && data.reviewedBy ? { reviewedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ id: updated.id, slug: updated.slug });
  } catch (e) {
    console.error("Vessel type update failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
