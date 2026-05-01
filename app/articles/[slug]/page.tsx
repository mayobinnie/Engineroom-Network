import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Comments } from "@/components/Comments";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.status !== "PUBLISHED") return { title: "Not found" };
  if (article.type !== "ARTICLE" && article.type !== "COMMENTARY") {
    return { title: "Not found" };
  }

  const title = article.metaTitle ?? `${article.title} | EngineRoom Network`;
  const description = article.metaDescription ?? article.excerpt ?? undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    alternates: { canonical: `https://engineroomnetwork.com/articles/${article.slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article || article.status !== "PUBLISHED") notFound();
  if (article.type !== "ARTICLE" && article.type !== "COMMENTARY") notFound();

  // Render markdown to HTML
  const renderedHtml = marked.parse(article.content, { async: false }) as string;

  // Schema.org Article structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": article.type === "COMMENTARY" ? "OpinionNewsArticle" : "TechArticle",
    headline: article.title,
    description: article.excerpt ?? "",
    url: `https://engineroomnetwork.com/articles/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: article.authorName
      ? { "@type": "Person", name: article.authorName }
      : { "@type": "Organization", name: "EngineRoom Network" },
    publisher: {
      "@type": "Organization",
      name: "EngineRoom Network",
      url: "https://engineroomnetwork.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <main className="bg-sail min-h-screen">
        {/* Hero */}
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              <Link href="/articles" className="hover:underline">
                Knowledge
              </Link>
              {" / "}
              {article.type === "ARTICLE" ? "Article" : "Commentary"}
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-mist leading-relaxed">{article.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist">
              {article.publishedAt && (
                <span>
                  {article.publishedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {article.authorName && <span>By {article.authorName}</span>}
              {article.type === "COMMENTARY" && article.sourceName && (
                <span className="italic">
                  Commenting on coverage from {article.sourceName}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Markdown content */}
            <article
              className="prose prose-lg max-w-none text-steel leading-relaxed
                         prose-headings:font-display prose-headings:font-bold prose-headings:text-hull
                         prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                         prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                         prose-p:my-4
                         prose-a:text-signal prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-hull
                         prose-ul:my-4 prose-ol:my-4
                         prose-li:my-1
                         prose-code:text-hull prose-code:bg-mist/50 prose-code:px-1 prose-code:rounded-sm
                         prose-blockquote:border-l-signal prose-blockquote:text-steel"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            {/* Source attribution for commentary */}
            {article.type === "COMMENTARY" && article.sourceUrl && (
              <div className="mt-10 p-6 bg-mist/30 border border-mist rounded-sm">
                <p className="text-sm text-steel mb-2">
                  This commentary is based on coverage by{" "}
                  {article.sourceName ?? "an industry publication"}.
                </p>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal font-semibold hover:underline text-sm"
                >
                  Read the original article →
                </a>
              </div>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-mist flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-mist/50 text-steel rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments */}
            <Comments targetType="ARTICLE" targetId={article.id} />

            {/* Back link */}
            <div className="mt-12">
              <Link href="/articles" className="text-signal hover:underline text-sm">
                ← All articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
