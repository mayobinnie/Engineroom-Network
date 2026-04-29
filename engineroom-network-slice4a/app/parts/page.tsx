import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine Parts Categories | EngineRoom Network",
  description: "Browse marine engineering parts and equipment by category. Find suppliers for turbochargers, fuel injection, electrical equipment, pumps, and more.",
  alternates: { canonical: "https://engineroomnetwork.com/parts" },
};

export default async function PartsIndexPage() {
  const categories = await prisma.partCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Marine Engineering Directory
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              Marine Parts by Category
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              Browse marine engineering parts and equipment by category. Find suppliers, manufacturers, and service providers organised by what you actually need to source.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/parts/${cat.slug}`}
                  className="border border-mist rounded-sm p-5 bg-white hover:border-signal transition-colors"
                >
                  <h3 className="font-display font-bold text-lg text-hull mb-2">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm text-steel leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
