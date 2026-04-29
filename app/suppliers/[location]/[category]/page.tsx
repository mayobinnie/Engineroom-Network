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
  params: Promise<{ location: string; category: string }>;
}): Promise<Metadata> {
  const { location: locationSlug, category: categorySlug } = await params;

  const [location, category] = await Promise.all([
    prisma.location.findUnique({ where: { slug: locationSlug } }),
    prisma.partCategory.findUnique({ where: { slug: categorySlug } }),
  ]);

  if (!location || !category) return { title: "Page not found" };

  const title = `${category.name} Suppliers in ${location.name} | EngineRoom Network`;
  const description = `Curated directory of ${category.name.toLowerCase()} suppliers, manufacturers, and service providers in ${location.name}, ${location.country}. Marine engineering professional resource.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://engineroomnetwork.com/suppliers/${location.slug}/${category.slug}` },
  };
}

export default async function LocationCategoryPage({
  params,
}: {
  params: Promise<{ location: string; category: string }>;
}) {
  const { location: locationSlug, category: categorySlug } = await params;

  const [location, category] = await Promise.all([
    prisma.location.findUnique({ where: { slug: locationSlug } }),
    prisma.partCategory.findUnique({ where: { slug: categorySlug } }),
  ]);

  if (!location || !category) notFound();

  // Find suppliers that match BOTH this location AND this category
  const suppliers = await prisma.supplier.findMany({
    where: {
      isPublished: true,
      locations: { some: { locationId: location.id } },
      categories: { some: { categoryId: category.id } },
    },
    orderBy: { name: "asc" },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Suppliers in ${location.name}`,
    url: `https://engineroomnetwork.com/suppliers/${location.slug}/${category.slug}`,
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
              <Link href={`/suppliers/${location.slug}`} className="hover:underline">
                {location.name}
              </Link>
              {" / "}
              <Link href={`/parts/${category.slug}`} className="hover:underline">
                {category.name}
              </Link>
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {category.name} Suppliers in {location.name}
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              Marine engineering professionals sourcing {category.name.toLowerCase()} in {location.name}, {location.country}, can use this curated guide to identify suppliers and service providers.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-hull mb-8">
              {suppliers.length > 0
                ? `${suppliers.length} ${suppliers.length === 1 ? "supplier" : "suppliers"} found`
                : "Suppliers"}
            </h2>

            {suppliers.length === 0 ? (
              <DirectoryEmptyState
                pageType="combination"
                pageName={`${category.name} in ${location.name}`}
              />
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
          <div className="max-w-5xl mx-auto flex flex-wrap gap-4">
            <Link
              href={`/suppliers/${location.slug}`}
              className="text-signal font-semibold hover:underline"
            >
              ← All suppliers in {location.name}
            </Link>
            <span className="text-steel">·</span>
            <Link
              href={`/parts/${category.slug}`}
              className="text-signal font-semibold hover:underline"
            >
              All {category.name} suppliers globally →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
