import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SupplierCard, DirectoryEmptyState } from "@/components/SupplierCard";
import Link from "next/link";
import type { Metadata } from "next";

// Force dynamic rendering: ensures pages always reflect current data
// and new locations added via seed/admin appear without redeploy
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = await prisma.location.findUnique({
    where: { slug: locationSlug },
  });

  if (!location) return { title: "Location not found" };

  const title = location.metaTitle ?? `Marine Parts Suppliers in ${location.name} | EngineRoom Network`;
  const description = location.metaDescription ?? `Curated directory of marine engineering parts suppliers, ship chandlers, and technical service providers in ${location.name}, ${location.country}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://engineroomnetwork.com/suppliers/${location.slug}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location: locationSlug } = await params;

  const location = await prisma.location.findUnique({
    where: { slug: locationSlug },
    include: {
      suppliers: {
        where: { supplier: { isPublished: true } },
        include: { supplier: true },
        orderBy: { supplier: { name: "asc" } },
      },
    },
  });

  if (!location) notFound();

  // Get all part categories so we can build cross-filter links
  const categories = await prisma.partCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  const suppliers = location.suppliers.map((sl) => sl.supplier);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Marine Parts Suppliers in ${location.name}`,
    description: location.description,
    url: `https://engineroomnetwork.com/suppliers/${location.slug}`,
    about: {
      "@type": "Place",
      name: location.name,
      address: { "@type": "PostalAddress", addressCountry: location.country },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <main className="bg-sail min-h-screen">
        {/* Hero */}
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Marine Engineering Directory
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              Marine Parts Suppliers in {location.name}
            </h1>
            {location.description && (
              <p className="text-lg text-mist max-w-3xl leading-relaxed">{location.description}</p>
            )}
          </div>
        </section>

        {/* Suppliers */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-bold text-2xl text-hull">
                {suppliers.length > 0
                  ? `${suppliers.length} ${suppliers.length === 1 ? "supplier" : "suppliers"}`
                  : "Suppliers"}
              </h2>
            </div>

            {suppliers.length === 0 ? (
              <DirectoryEmptyState pageType="location" pageName={location.name} />
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

        {/* Cross-filter: by category in this location */}
        <section className="py-12 px-6 border-t border-mist">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-xl text-hull mb-6">
              Browse by part category in {location.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/suppliers/${location.slug}/${cat.slug}`}
                  className="text-steel hover:text-signal text-sm py-2 border-b border-mist hover:border-signal transition-colors"
                >
                  {cat.name} in {location.name} →
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
