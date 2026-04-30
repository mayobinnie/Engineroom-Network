import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Returns all "linkable" entities on the platform with their slugs and the
 * keywords/aliases that should match them in article text. Used by the
 * internal link suggester in the admin article editor.
 *
 * Returns entities even when unpublished (admins are linking to all internal
 * pages, not just public-facing ones), but the suggester UI can choose to
 * only suggest published targets.
 */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [vessels, locations, categories, oems, articles] = await Promise.all([
    prisma.vesselClass.findMany({
      select: { slug: true, name: true, shortName: true, isPublished: true },
    }),
    prisma.location.findMany({
      select: { slug: true, name: true, country: true },
    }),
    prisma.partCategory.findMany({
      select: { slug: true, name: true },
    }),
    prisma.oEM.findMany({
      select: { slug: true, name: true },
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: { in: ["ARTICLE", "COMMENTARY"] },
      },
      select: { slug: true, title: true, seoKeyword: true },
    }),
  ]);

  // Build target list with multiple keyword aliases per entity
  type Target = {
    url: string;
    label: string;
    type: "vessel" | "location" | "category" | "oem" | "article";
    keywords: string[]; // text snippets that should match
    isPublished: boolean;
  };

  const targets: Target[] = [];

  // Vessel classes: match on full name AND short name
  for (const v of vessels) {
    const keywords = [v.name, v.shortName];
    // Add common variations
    if (v.shortName === "VLCC") keywords.push("VLCC tanker", "Very Large Crude Carrier");
    if (v.shortName === "ULCV") keywords.push("ULCV", "ultra large container vessel");
    if (v.shortName === "PSV") keywords.push("platform supply vessel");
    if (v.shortName === "AHTS") keywords.push("anchor handling tug");
    if (v.shortName === "LNG Carrier") keywords.push("LNG carrier", "LNG vessel");
    if (v.shortName === "LPG Carrier") keywords.push("LPG carrier", "VLGC");

    targets.push({
      url: `/vessels/${v.slug}`,
      label: v.name,
      type: "vessel",
      keywords: [...new Set(keywords)],
      isPublished: v.isPublished,
    });
  }

  // Locations: just the city name
  for (const l of locations) {
    targets.push({
      url: `/suppliers/${l.slug}`,
      label: `${l.name} suppliers`,
      type: "location",
      keywords: [l.name],
      isPublished: true,
    });
  }

  // Part categories
  for (const c of categories) {
    targets.push({
      url: `/parts/${c.slug}`,
      label: c.name,
      type: "category",
      keywords: [c.name, c.name.toLowerCase()],
      isPublished: true,
    });
  }

  // OEMs
  for (const o of oems) {
    const keywords = [o.name];
    // Common OEM aliases
    if (o.name === "MAN Energy Solutions") keywords.push("MAN B&W", "MAN ME-C", "MAN ME-GI");
    if (o.name === "Wartsila" || o.name === "Wärtsilä") keywords.push("Wartsila", "Wärtsilä");
    if (o.name === "Alfa Laval") keywords.push("Alfa-Laval");

    targets.push({
      url: `/oem/${o.slug}`,
      label: o.name,
      type: "oem",
      keywords: [...new Set(keywords)],
      isPublished: true,
    });
  }

  // Other articles
  for (const a of articles) {
    const keywords = [a.title];
    if (a.seoKeyword) keywords.push(a.seoKeyword);
    targets.push({
      url: `/articles/${a.slug}`,
      label: a.title,
      type: "article",
      keywords,
      isPublished: true,
    });
  }

  return NextResponse.json({ targets });
}
