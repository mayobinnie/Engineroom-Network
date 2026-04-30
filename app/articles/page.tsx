import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge | Marine Engineering Articles | EngineRoom Network",
  description:
    "Articles, analysis, and commentary for marine engineers. Technical content from working engineers, news commentary, and industry insight.",
  alternates: { canonical: "https://engineroomnetwork.com/articles" },
};

export default async function ArticlesIndexPage() {
  // Public-facing articles only: ARTICLE and COMMENTARY types, status PUBLISHED
  // LinkedIn and Email types are internal-only.
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      type: { in: ["ARTICLE", "COMMENTARY"] },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Knowledge
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              Articles & Analysis
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              Technical content for marine engineers. Original articles on equipment, sourcing, and engineering practice. Commentary on industry developments from an engineer's perspective.
            </p>
            <div className="mt-6 flex gap-4 text-sm">
              <a href="/articles/feed.xml" className="text-signal hover:underline">
                RSS feed →
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {articles.length === 0 ? (
              <div className="border border-mist rounded-sm p-8 bg-white text-center">
                <p className="text-steel mb-4">
                  We're preparing the first articles. Check back soon.
                </p>
                <p className="text-sm text-steel">
                  In the meantime,{" "}
                  <Link href="/sign-up" className="text-signal font-semibold hover:underline">
                    sign up
                  </Link>{" "}
                  to be notified when articles go live.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((a) => (
                  <article
                    key={a.id}
                    className="border border-mist bg-white rounded-sm p-6 hover:border-signal transition-colors"
                  >
                    <Link href={`/articles/${a.slug}`} className="block">
                      <div className="flex items-center gap-3 mb-2 text-xs font-mono uppercase">
                        <span
                          className={
                            a.type === "ARTICLE"
                              ? "text-signal"
                              : "text-brass"
                          }
                        >
                          {a.type === "ARTICLE" ? "Article" : "Commentary"}
                        </span>
                        {a.publishedAt && (
                          <span className="text-steel">
                            {a.publishedAt.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display font-bold text-2xl text-hull mb-3">
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p className="text-steel leading-relaxed mb-3">{a.excerpt}</p>
                      )}
                      {a.type === "COMMENTARY" && a.sourceName && (
                        <p className="text-xs text-steel italic">
                          Commentary on coverage from {a.sourceName}
                        </p>
                      )}
                      {a.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {a.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-mist/50 text-steel rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
