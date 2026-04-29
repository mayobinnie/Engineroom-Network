import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SupplierForm } from "@/components/SupplierForm";

export const metadata = {
  title: "Add Supplier | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function NewSupplierPage() {
  await requireAdmin();

  const [locations, categories, oems] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.partCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.oEM.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Suppliers
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-8">Add Supplier</h1>

            <SupplierForm
              locations={locations.map((l) => ({ id: l.id, name: l.name, country: l.country }))}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              oems={oems.map((o) => ({ id: o.id, name: o.name }))}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
