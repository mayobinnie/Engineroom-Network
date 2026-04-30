import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContentGenerator } from "@/components/ContentGenerator";
import { ContentQueueList } from "@/components/ContentQueueList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Content Queue | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

interface SearchParams {
  status?: string;
  type?: string;
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  // Build where clause from filters
  const where: Record<string, unknown> = {};
  if (sp.status && ["DRAFT", "APPROVED", "PUBLISHED", "REJECTED"].includes(sp.status)) {
    where.status = sp.status;
  }
  if (sp.type && ["ARTICLE", "COMMENTARY", "LINKEDIN", "EMAIL"].includes(sp.type)) {
    where.type = sp.type;
  }

  const [articles, draftCount, approvedCount, publishedCount, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "APPROVED" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count(),
  ]);

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Content Queue
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-2">
              Content Queue
            </h1>
            <p className="text-steel mb-8">
              {totalCount} total · {draftCount} draft · {approvedCount} approved · {publishedCount} published
            </p>

            <ContentGenerator />

            <div className="mt-10">
              <ContentQueueList
                articles={articles.map((a) => ({
                  id: a.id,
                  slug: a.slug,
                  type: a.type,
                  status: a.status,
                  title: a.title,
                  excerpt: a.excerpt,
                  createdAt: a.createdAt.toISOString(),
                  publishedAt: a.publishedAt?.toISOString() ?? null,
                  generatedByAI: a.generatedByAI,
                  sourceName: a.sourceName,
                }))}
                currentStatus={sp.status}
                currentType={sp.type}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
