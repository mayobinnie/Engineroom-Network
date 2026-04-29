import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = waitlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Honeypot check - bots fill the website field, real users don't
    if (data.website && data.website.length > 0) {
      // Pretend success to avoid signalling the bot
      return NextResponse.json({ ok: true });
    }

    // Capture lightweight metadata for spam analysis
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    // Check if email already exists (idempotent: succeed quietly if already on list)
    const existing = await prisma.waitlistSignup.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json({ ok: true, alreadyOnList: true });
    }

    // Create the signup
    await prisma.waitlistSignup.create({
      data: {
        email: data.email,
        name: data.name || null,
        rank: data.rank || null,
        vesselType: data.vesselType || null,
        interest: data.interest || null,
        message: data.message || null,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again in a moment." },
      { status: 500 }
    );
  }
}
