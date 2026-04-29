import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vessel Types | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function AdminVesselsPage() {
  await requireAdmin();

  const vesselTypes = await prisma.vesselType.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const publishedCount = vesselTypes.filter((vt) => vt.isPublished).length;
  const draftCount = vesselTypes.length - publishedCount;

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Vessel Types
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-2">
              Vessel Type Reference Guides
            </h1>
            <p className="text-steel mb-8">
              {publishedCount} published · {draftCount} draft
              {draftCount > 0 && (
                <>
                  {" "}
                  · <span className="text-brass">drafts not visible publicly</span>
                </>
              )}
            </p>

            <div className="bg-brass/10 border border-brass/30 rounded-sm p-4 mb-8">
              <p className="text-sm text-hull">
                <strong>Important:</strong> All seed entries contain general industry guidance that may include inaccuracies. Each entry must be reviewed by a marine engineering domain expert and corrected before publishing. Click an entry to review and edit.
              </p>
            </div>

            <div className="border border-mist rounded-sm bg-white overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist/50 border-b border-mist">
                  <tr>
                    <th className="p-3 font-mono uppercase text-xs">Name</th>
                    <th className="p-3 font-mono uppercase text-xs">Category</th>
                    <th className="p-3 font-mono uppercase text-xs">Status</th>
                    <th className="p-3 font-mono uppercase text-xs">Reviewed</th>
                  </tr>
                </thead>
                <tbody>
                  {vesselTypes.map((vt) => (
                    <tr key={vt.id} className="border-b border-mist last:border-0 hover:bg-mist/20">
                      <td className="p-3">
                        <Link
                          href={`/admin/vessels/${vt.slug}`}
                          className="font-semibold text-hull hover:text-signal"
                        >
                          {vt.name}
                        </Link>
                      </td>
                      <td className="p-3 text-steel">{vt.category}</td>
                      <td className="p-3">
                        {vt.isPublished ? (
                          <span className="text-xs font-mono uppercase text-signal">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs font-mono uppercase text-brass">Draft</span>
                        )}
                      </td>
                      <td className="p-3 text-steel">
                        {vt.reviewedBy ? (
                          <>
                            {vt.reviewedBy}
                            {vt.reviewedAt && (
                              <span className="text-xs"> ({vt.reviewedAt.toLocaleDateString()})</span>
                            )}
                          </>
                        ) : (
                          <span className="text-steel/60">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
