import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CommentItem } from "@/components/CommentItem";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Comments | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

interface SearchParams {
  filter?: string;
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const filter = sp.filter || "all";
  const where: Record<string, unknown> = {};
  if (filter === "reported") where.isReported = true;
  if (filter === "hidden") where.isHidden = true;
  if (filter === "visible") where.isHidden = false;

  const [comments, allCount, reportedCount, hiddenCount] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: [{ isReported: "desc" }, { createdAt: "desc" }],
      take: 100,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            commentsBanned: true,
            profile: { select: { displayName: true, rank: true } },
          },
        },
      },
    }),
    prisma.comment.count(),
    prisma.comment.count({ where: { isReported: true } }),
    prisma.comment.count({ where: { isHidden: true } }),
  ]);

  // For each comment, look up its target's title for context
  const articleIds = comments
    .filter((c) => c.targetType === "ARTICLE")
    .map((c) => c.targetId);
  const vesselIds = comments
    .filter((c) => c.targetType === "VESSEL_CLASS")
    .map((c) => c.targetId);

  const [articles, vessels] = await Promise.all([
    prisma.article.findMany({
      where: { id: { in: articleIds } },
      select: { id: true, title: true, slug: true },
    }),
    prisma.vesselClass.findMany({
      where: { id: { in: vesselIds } },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const targetMap = new Map<string, { title: string; url: string }>();
  for (const a of articles) {
    targetMap.set(a.id, { title: a.title, url: `/articles/${a.slug}` });
  }
  for (const v of vessels) {
    targetMap.set(v.id, { title: v.name, url: `/vessels/${v.slug}` });
  }

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Comments
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-2">
              Comment Moderation
            </h1>
            <p className="text-steel mb-6">
              {allCount} total · {reportedCount} reported · {hiddenCount} hidden
            </p>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { value: "all", label: "All" },
                { value: "reported", label: `Reported (${reportedCount})` },
                { value: "hidden", label: "Hidden" },
                { value: "visible", label: "Visible" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={`/admin/comments?filter=${opt.value}`}
                  className={`px-3 py-1 text-xs font-mono uppercase rounded-sm border ${
                    filter === opt.value
                      ? "bg-hull text-sail border-hull"
                      : "bg-white text-hull border-mist hover:border-signal"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            {comments.length === 0 ? (
              <div className="border border-mist rounded-sm p-8 bg-white text-center text-steel">
                No comments to show.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => {
                  const target = targetMap.get(c.targetId);
                  return (
                    <div key={c.id}>
                      <p className="text-xs text-steel mb-1">
                        On:{" "}
                        {target ? (
                          <Link href={target.url} className="text-signal hover:underline">
                            {target.title}
                          </Link>
                        ) : (
                          <span className="italic">deleted target</span>
                        )}
                      </p>
                      <CommentItem
                        comment={{
                          id: c.id,
                          content: c.content,
                          createdAt: c.createdAt.toISOString(),
                          isEdited: c.isEdited,
                          isHidden: c.isHidden,
                          isPinned: c.isPinned,
                          isReported: c.isReported,
                          reportCount: c.reportCount,
                          authorName:
                            c.author.profile?.displayName ?? c.author.email.split("@")[0],
                          authorRank: c.author.profile?.rank ?? null,
                        }}
                        targetType={c.targetType}
                        targetId={c.targetId}
                        isAuthor={false}
                        isAdmin
                        isAuthenticated
                        canReply={false}
                      />
                      {c.author.commentsBanned && (
                        <p className="text-xs text-red-600 mt-1">
                          Author is banned from commenting.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
