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

  const [supplierCount, publishedCount, locationCount, categoryCount, oemCount, userCount] =
    await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.count({ where: { isPublished: true } }),
      prisma.location.count(),
      prisma.partCategory.count(),
      prisma.oEM.count(),
      prisma.user.count(),
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
              <Stat label="Published" value={publishedCount} />
              <Stat label="Members" value={userCount} />
              <Stat label="Locations" value={locationCount} />
              <Stat label="Part Categories" value={categoryCount} />
              <Stat label="OEMs" value={oemCount} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
