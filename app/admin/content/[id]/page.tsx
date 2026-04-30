import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArticleEditForm } from "@/components/ArticleEditForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Content | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Content / Edit
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-2 break-words">
              {article.title}
            </h1>
            <p className="text-steel mb-8">
              <span className="font-mono uppercase text-xs">
                {article.type} · {article.status}
              </span>
              {article.generatedByAI && (
                <span className="ml-2 text-xs">· AI-generated draft, review carefully</span>
              )}
            </p>

            <ArticleEditForm
              article={{
                id: article.id,
                slug: article.slug,
                type: article.type,
                status: article.status,
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                seoKeyword: article.seoKeyword,
                sourceTitle: article.sourceTitle,
                sourceUrl: article.sourceUrl,
                sourceName: article.sourceName,
                authorName: article.authorName,
                reviewedBy: article.reviewedBy,
                metaTitle: article.metaTitle,
                metaDescription: article.metaDescription,
                tags: article.tags,
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
