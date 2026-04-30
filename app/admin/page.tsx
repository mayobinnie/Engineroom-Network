import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  await requireAdmin();

  const [supplierCount, publishedCount, locationCount, categoryCount, oemCount, userCount, vesselCount, publishedVesselCount, articleCount, draftArticleCount] =
    await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.count({ where: { isPublished: true } }),
      prisma.location.count(),
      prisma.partCategory.count(),
      prisma.oEM.count(),
      prisma.user.count(),
      prisma.vesselClass.count(),
      prisma.vesselClass.count({ where: { isPublished: true } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
    ]);

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Admin
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-8">Directory Admin</h1>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Stat label="Suppliers (total)" value={supplierCount} />
              <Stat label="Published suppliers" value={publishedCount} />
              <Stat label="Members" value={userCount} />
              <Stat label="Vessel types (total)" value={vesselCount} />
              <Stat label="Published vessels" value={publishedVesselCount} />
              <Stat label="Published articles" value={articleCount} />
              <Stat label="Draft articles" value={draftArticleCount} />
              <Stat label="Locations" value={locationCount} />
              <Stat label="Part Categories" value={categoryCount} />
              <Stat label="OEMs" value={oemCount} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/admin/content"
                className="block border border-mist rounded-sm p-6 bg-white hover:border-signal transition-colors md:col-span-2"
              >
                <h2 className="font-display font-bold text-lg text-hull mb-2">
                  Content Queue →
                </h2>
                <p className="text-steel text-sm">
                  Generate, review, and publish articles, commentary, LinkedIn posts and newsletters. {draftArticleCount > 0 && <span className="text-brass font-semibold">{draftArticleCount} draft{draftArticleCount === 1 ? "" : "s"} awaiting review.</span>}
                </p>
              </Link>
              <Link
                href="/admin/suppliers"
                className="block border border-mist rounded-sm p-6 bg-white hover:border-signal transition-colors"
              >
                <h2 className="font-display font-bold text-lg text-hull mb-2">
                  Manage Suppliers →
                </h2>
                <p className="text-steel text-sm">
                  Add new suppliers, edit existing ones, publish drafts.
                </p>
              </Link>
              <Link
                href="/admin/suppliers/new"
                className="block border border-mist rounded-sm p-6 bg-white hover:border-signal transition-colors"
              >
                <h2 className="font-display font-bold text-lg text-hull mb-2">Add Supplier →</h2>
                <p className="text-steel text-sm">Add a new supplier to the directory.</p>
              </Link>
              <Link
                href="/admin/vessels"
                className="block border border-mist rounded-sm p-6 bg-white hover:border-signal transition-colors md:col-span-2"
              >
                <h2 className="font-display font-bold text-lg text-hull mb-2">
                  Review Vessel Type Guides →
                </h2>
                <p className="text-steel text-sm">
                  18 draft guides ready for expert review. Each guide must be reviewed and corrected before publishing.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-mist rounded-sm p-4 bg-white">
      <p className="text-xs font-mono uppercase text-steel mb-1">{label}</p>
      <p className="font-display font-bold text-3xl text-hull">{value}</p>
    </div>
  );
}
