import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      type: { in: ["ARTICLE", "COMMENTARY"] },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const baseUrl = "https://engineroomnetwork.com";
  const buildDate = new Date().toUTCString();

  const items = articles
    .map((a) => {
      const url = `${baseUrl}/articles/${a.slug}`;
      const pubDate = a.publishedAt ? a.publishedAt.toUTCString() : buildDate;
      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.excerpt ?? "")}</description>
      <category>${a.type === "ARTICLE" ? "Article" : "Commentary"}</category>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EngineRoom Network</title>
    <link>${baseUrl}/articles</link>
    <atom:link href="${baseUrl}/articles/feed.xml" rel="self" type="application/rss+xml" />
    <description>Articles, analysis and commentary for marine engineers.</description>
    <language>en-gb</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
