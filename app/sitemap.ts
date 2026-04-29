import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://engineroomnetwork.com";
  const now = new Date();

  // Static marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1.0 },
    { url: `${base}/about`, lastModified: now, priority: 0.8 },
    { url: `${base}/platform`, lastModified: now, priority: 0.8 },
    { url: `${base}/community`, lastModified: now, priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, priority: 0.3 },
    // Directory hubs
    { url: `${base}/suppliers`, lastModified: now, priority: 0.9 },
    { url: `${base}/parts`, lastModified: now, priority: 0.9 },
    { url: `${base}/oem`, lastModified: now, priority: 0.9 },
  ];

  // Pull all directory data for dynamic URLs
  const [locations, categories, oems] = await Promise.all([
    prisma.location.findMany({ select: { slug: true, updatedAt: true, isMajorHub: true } }),
    prisma.partCategory.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.oEM.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${base}/suppliers/${loc.slug}`,
    lastModified: loc.updatedAt,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/parts/${cat.slug}`,
    lastModified: cat.updatedAt,
    priority: 0.7,
  }));

  const oemPages: MetadataRoute.Sitemap = oems.map((oem) => ({
    url: `${base}/oem/${oem.slug}`,
    lastModified: oem.updatedAt,
    priority: 0.7,
  }));

  // Combination pages: location × category (limited to major hubs to avoid bloat)
  const majorHubs = locations.filter((l) => l.isMajorHub);
  const locationCategoryPages: MetadataRoute.Sitemap = [];
  for (const loc of majorHubs) {
    for (const cat of categories) {
      locationCategoryPages.push({
        url: `${base}/suppliers/${loc.slug}/${cat.slug}`,
        lastModified: now,
        priority: 0.6,
      });
    }
  }

  // Combination pages: oem × location
  const oemLocationPages: MetadataRoute.Sitemap = [];
  for (const oem of oems) {
    for (const loc of majorHubs) {
      oemLocationPages.push({
        url: `${base}/oem/${oem.slug}/${loc.slug}`,
        lastModified: now,
        priority: 0.6,
      });
    }
  }

  return [
    ...staticPages,
    ...locationPages,
    ...categoryPages,
    ...oemPages,
    ...locationCategoryPages,
    ...oemLocationPages,
  ];
}
