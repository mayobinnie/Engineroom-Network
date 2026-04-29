import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Suppliers | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function AdminSuppliersPage() {
  await requireAdmin();

  const suppliers = await prisma.supplier.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      locations: { include: { location: true } },
      categories: { include: { category: true } },
    },
  });

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
                  Admin / Suppliers
                </p>
                <h1 className="font-display font-bold text-3xl text-hull">All Suppliers</h1>
              </div>
              <Link
                href="/admin/suppliers/new"
                className="bg-signal text-sail font-semibold px-5 py-3 rounded-sm hover:bg-signal/90 transition-colors"
              >
                + Add Supplier
              </Link>
            </div>

            {suppliers.length === 0 ? (
              <div className="border border-mist rounded-sm p-8 bg-white text-center">
                <p className="text-steel mb-4">No suppliers yet.</p>
                <Link
                  href="/admin/suppliers/new"
                  className="text-signal font-semibold hover:underline"
                >
                  Add the first one →
                </Link>
              </div>
            ) : (
              <div className="border border-mist rounded-sm bg-white overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-mist/50 border-b border-mist">
                    <tr>
                      <th className="p-3 font-mono uppercase text-xs">Name</th>
                      <th className="p-3 font-mono uppercase text-xs">Locations</th>
                      <th className="p-3 font-mono uppercase text-xs">Categories</th>
                      <th className="p-3 font-mono uppercase text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((s) => (
                      <tr key={s.id} className="border-b border-mist last:border-0">
                        <td className="p-3 font-semibold text-hull">{s.name}</td>
                        <td className="p-3 text-steel">
                          {s.locations.map((l) => l.location.name).join(", ") || "—"}
                        </td>
                        <td className="p-3 text-steel">
                          {s.categories.map((c) => c.category.name).join(", ") || "—"}
                        </td>
                        <td className="p-3">
                          {s.isPublished ? (
                            <span className="text-xs font-mono uppercase text-signal">
                              Published
                            </span>
                          ) : (
                            <span className="text-xs font-mono uppercase text-brass">Draft</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
