import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SupplierCard, DirectoryEmptyState } from "@/components/SupplierCard";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await prisma.partCategory.findUnique({ where: { slug: categorySlug } });

  if (!category) return { title: "Category not found" };

  const title = category.metaTitle ?? `${category.name} Suppliers | EngineRoom Network`;
  const description = category.metaDescription ?? `Curated directory of ${category.name.toLowerCase()} suppliers, manufacturers, and service providers for marine engineering.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://engineroomnetwork.com/parts/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = await prisma.partCategory.findUnique({
    where: { slug: categorySlug },
    include: {
      suppliers: {
        where: { supplier: { isPublished: true } },
        include: { supplier: true },
        orderBy: { supplier: { name: "asc" } },
      },
    },
  });

  if (!category) notFound();

  const locations = await prisma.location.findMany({
    where: { isMajorHub: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const suppliers = category.suppliers.map((sc) => sc.supplier);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Suppliers`,
    description: category.description,
    url: `https://engineroomnetwork.com/parts/${category.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Marine Engineering Directory
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {category.name} Suppliers
            </h1>
            {category.description && (
              <p className="text-lg text-mist max-w-3xl leading-relaxed">{category.description}</p>
            )}
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-hull mb-8">
              {suppliers.length > 0
                ? `${suppliers.length} ${suppliers.length === 1 ? "supplier" : "suppliers"}`
                : "Suppliers"}
            </h2>

            {suppliers.length === 0 ? (
              <DirectoryEmptyState pageType="category" pageName={category.name} />
            ) : (
              <div className="grid gap-6">
                {suppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    name={supplier.name}
                    slug={supplier.slug}
                    servicesSummary={supplier.servicesSummary}
                    headquarters={supplier.headquarters}
                    website={supplier.website}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 px-6 border-t border-mist">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-xl text-hull mb-6">
              Find {category.name.toLowerCase()} suppliers by location
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/suppliers/${loc.slug}/${category.slug}`}
                  className="text-steel hover:text-signal text-sm py-2 border-b border-mist hover:border-signal transition-colors"
                >
                  {category.name} in {loc.name} →
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
