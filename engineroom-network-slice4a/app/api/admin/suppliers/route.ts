import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const SupplierSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(100),
  description: z.string().min(10).max(5000),
  servicesSummary: z.string().min(10).max(500),
  website: z.string().url().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  headquarters: z.string().max(200).nullable().optional(),
  founded: z.number().int().min(1800).max(2100).nullable().optional(),
  isPublished: z.boolean().default(false),
  locationIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  oemIds: z.array(z.string()).default([]),
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

  const parsed = SupplierSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check slug uniqueness
  const existing = await prisma.supplier.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A supplier with that slug already exists" }, { status: 409 });
  }

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        servicesSummary: data.servicesSummary,
        website: data.website || null,
        email: data.email || null,
        phone: data.phone || null,
        headquarters: data.headquarters || null,
        founded: data.founded || null,
        isPublished: data.isPublished,
        locations: {
          create: data.locationIds.map((id) => ({ locationId: id })),
        },
        categories: {
          create: data.categoryIds.map((id) => ({ categoryId: id })),
        },
        oems: {
          create: data.oemIds.map((id) => ({ oemId: id })),
        },
      },
    });

    return NextResponse.json({ id: supplier.id, slug: supplier.slug }, { status: 201 });
  } catch (e) {
    console.error("Supplier create failed:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
