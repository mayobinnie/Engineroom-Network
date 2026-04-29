import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SupplierCard, DirectoryEmptyState } from "@/components/SupplierCard";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const oems = await prisma.oEM.findMany({ select: { slug: true } });
  return oems.map((oem) => ({ manufacturer: oem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manufacturer: string }>;
}): Promise<Metadata> {
  const { manufacturer: oemSlug } = await params;
  const oem = await prisma.oEM.findUnique({ where: { slug: oemSlug } });

  if (!oem) return { title: "OEM not found" };

  const title = oem.metaTitle ?? `${oem.name} Parts & Service Suppliers | EngineRoom Network`;
  const description = oem.metaDescription ?? `Curated directory of ${oem.name} parts suppliers, authorised service providers, and aftermarket specialists for marine engineering.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://engineroomnetwork.com/oem/${oem.slug}` },
  };
}

export default async function OEMPage({
  params,
}: {
  params: Promise<{ manufacturer: string }>;
}) {
  const { manufacturer: oemSlug } = await params;

  const oem = await prisma.oEM.findUnique({
    where: { slug: oemSlug },
    include: {
      suppliers: {
        where: { supplier: { isPublished: true } },
        include: { supplier: true },
        orderBy: { supplier: { name: "asc" } },
      },
    },
  });

  if (!oem) notFound();

  const locations = await prisma.location.findMany({
    where: { isMajorHub: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const suppliers = oem.suppliers.map((so) => so.supplier);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${oem.name} Parts & Service Suppliers`,
    description: oem.description,
    url: `https://engineroomnetwork.com/oem/${oem.slug}`,
    about: {
      "@type": "Organization",
      name: oem.name,
      ...(oem.headquarters && {
        address: { "@type": "PostalAddress", addressLocality: oem.headquarters },
      }),
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
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              OEM · {oem.headquarters ?? "Marine Equipment Manufacturer"}
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {oem.name} Parts & Service Suppliers
            </h1>
            {oem.description && (
              <p className="text-lg text-mist max-w-3xl leading-relaxed">{oem.description}</p>
            )}
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-hull mb-8">
              {suppliers.length > 0
                ? `${suppliers.length} ${suppliers.length === 1 ? "supplier" : "suppliers"} for ${oem.name}`
                : "Suppliers"}
            </h2>

            {suppliers.length === 0 ? (
              <DirectoryEmptyState pageType="oem" pageName={oem.name} />
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
              Find {oem.name} suppliers by location
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/oem/${oem.slug}/${loc.slug}`}
                  className="text-steel hover:text-signal text-sm py-2 border-b border-mist hover:border-signal transition-colors"
                >
                  {oem.name} in {loc.name} →
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
