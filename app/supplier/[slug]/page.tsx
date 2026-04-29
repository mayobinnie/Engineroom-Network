import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

// Force dynamic rendering so newly-published suppliers appear immediately
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { slug } });
  if (!supplier || !supplier.isPublished) return { title: "Supplier not found" };

  const title = supplier.metaTitle ?? `${supplier.name} | Marine Parts Supplier | EngineRoom Network`;
  const description = supplier.metaDescription ?? supplier.servicesSummary ?? `Profile of ${supplier.name}, a marine engineering parts supplier listed in the EngineRoom Network directory.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://engineroomnetwork.com/supplier/${supplier.slug}` },
  };
}

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  const supplier = await prisma.supplier.findUnique({
    where: { slug },
    include: {
      locations: { include: { location: true } },
      categories: { include: { category: true } },
      oems: { include: { oem: true } },
    },
  });

  if (!supplier || !supplier.isPublished) notFound();

  // Schema.org structured data, marks this page as an Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: supplier.name,
    description: supplier.servicesSummary ?? supplier.description,
    url: `https://engineroomnetwork.com/supplier/${supplier.slug}`,
    ...(supplier.website && { sameAs: [supplier.website] }),
    ...(supplier.headquarters && {
      address: { "@type": "PostalAddress", addressLocality: supplier.headquarters },
    }),
    ...(supplier.founded && { foundingDate: supplier.founded.toString() }),
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
              <Link href="/suppliers" className="hover:underline">
                Directory
              </Link>
              {supplier.headquarters && <> · {supplier.headquarters}</>}
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {supplier.name}
            </h1>
            {supplier.servicesSummary && (
              <p className="text-lg text-mist max-w-3xl leading-relaxed">
                {supplier.servicesSummary}
              </p>
            )}
          </div>
        </section>

        {/* Two column layout: description + sidebar */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2">
              <h2 className="font-display font-bold text-2xl text-hull mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-steel leading-relaxed whitespace-pre-line">
                {supplier.description}
              </div>

              {/* Categories */}
              {supplier.categories.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display font-bold text-lg text-hull mb-3">
                    Specialisms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.categories.map((sc) => (
                      <Link
                        key={sc.category.id}
                        href={`/parts/${sc.category.slug}`}
                        className="text-sm border border-mist rounded-sm px-3 py-1 text-steel hover:border-signal hover:text-signal transition-colors"
                      >
                        {sc.category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* OEMs */}
              {supplier.oems.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display font-bold text-lg text-hull mb-3">
                    OEM coverage
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.oems.map((so) => (
                      <Link
                        key={so.oem.id}
                        href={`/oem/${so.oem.slug}`}
                        className="text-sm border border-mist rounded-sm px-3 py-1 text-steel hover:border-signal hover:text-signal transition-colors"
                      >
                        {so.oem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {supplier.locations.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display font-bold text-lg text-hull mb-3">
                    Locations served
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.locations.map((sl) => (
                      <Link
                        key={sl.location.id}
                        href={`/suppliers/${sl.location.slug}`}
                        className="text-sm border border-mist rounded-sm px-3 py-1 text-steel hover:border-signal hover:text-signal transition-colors"
                      >
                        {sl.location.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: contact info, gated for non-signed-in users */}
            <aside className="md:col-span-1">
              <div className="border border-mist rounded-sm p-6 bg-white sticky top-6">
                <h3 className="font-display font-bold text-lg text-hull mb-4">
                  Contact
                </h3>

                {/* Website is always public */}
                {supplier.website && (
                  <div className="mb-4">
                    <p className="text-xs font-mono uppercase text-steel mb-1">Website</p>
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal hover:underline break-words"
                    >
                      {supplier.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}

                {/* Email and phone are gated for sign-in */}
                {isSignedIn ? (
                  <>
                    {supplier.email && (
                      <div className="mb-4">
                        <p className="text-xs font-mono uppercase text-steel mb-1">Email</p>
                        <a href={`mailto:${supplier.email}`} className="text-signal hover:underline break-words">
                          {supplier.email}
                        </a>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="mb-4">
                        <p className="text-xs font-mono uppercase text-steel mb-1">Phone</p>
                        <a href={`tel:${supplier.phone}`} className="text-signal hover:underline">
                          {supplier.phone}
                        </a>
                      </div>
                    )}
                    {!supplier.email && !supplier.phone && (
                      <p className="text-sm text-steel">
                        No additional contact details listed. Use the website to reach out.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-6 pt-6 border-t border-mist">
                    <p className="text-sm text-steel mb-4 leading-relaxed">
                      Sign in to view email, phone, and additional contact details for this supplier.
                    </p>
                    <Link
                      href={`/sign-in?redirect_url=/supplier/${supplier.slug}`}
                      className="block bg-signal text-sail font-semibold text-center px-4 py-2 rounded-sm hover:bg-signal/90 transition-colors text-sm"
                    >
                      Sign in to view contacts
                    </Link>
                    <p className="text-xs text-steel text-center mt-2">
                      Free for marine engineers
                    </p>
                  </div>
                )}

                {/* Founded */}
                {supplier.founded && (
                  <div className="mt-6 pt-6 border-t border-mist">
                    <p className="text-xs font-mono uppercase text-steel mb-1">Founded</p>
                    <p className="text-sm text-hull">{supplier.founded}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
