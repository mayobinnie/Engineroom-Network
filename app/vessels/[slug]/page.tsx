import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vesselType = await prisma.vesselType.findUnique({ where: { slug } });
  if (!vesselType || !vesselType.isPublished) return { title: "Vessel type not found" };

  const title = vesselType.metaTitle ?? `${vesselType.name} | Engineering Reference | EngineRoom Network`;
  const description = vesselType.metaDescription ?? vesselType.summary;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    alternates: { canonical: `https://engineroomnetwork.com/vessels/${vesselType.slug}` },
  };
}

export default async function VesselTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vesselType = await prisma.vesselType.findUnique({ where: { slug } });

  if (!vesselType || !vesselType.isPublished) notFound();

  // Schema.org TechArticle structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: vesselType.name,
    description: vesselType.summary,
    url: `https://engineroomnetwork.com/vessels/${vesselType.slug}`,
    dateModified: vesselType.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "EngineRoom Network",
      url: "https://engineroomnetwork.com",
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
          <div className="max-w-4xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              <Link href="/vessels" className="hover:underline">
                Engineering Reference
              </Link>
              {" / "}
              {vesselType.shortName}
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {vesselType.name}
            </h1>
            <p className="text-lg text-mist leading-relaxed">{vesselType.summary}</p>
          </div>
        </section>

        {/* Content disclaimer */}
        <section className="bg-brass/10 border-y border-brass/30 py-4 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-hull">
              <strong className="font-semibold">Editorial guidance, not vessel-specific specification.</strong>{" "}
              Equipment fits vary by yard, build year, and owner preference. Always refer to vessel-specific documentation for authoritative information.
              {vesselType.reviewedBy && (
                <> Reviewed by {vesselType.reviewedBy}.</>
              )}
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto prose prose-sm max-w-none text-steel leading-relaxed">
            {/* Description */}
            <div className="whitespace-pre-line mb-10">{vesselType.description}</div>

            {/* Typical Size */}
            {vesselType.typicalSize && (
              <Section title="Typical size">
                <p>{vesselType.typicalSize}</p>
              </Section>
            )}

            {/* Propulsion */}
            {vesselType.propulsionNotes && (
              <Section title="Propulsion">
                <p className="whitespace-pre-line">{vesselType.propulsionNotes}</p>
              </Section>
            )}

            {/* Auxiliary */}
            {vesselType.auxiliaryNotes && (
              <Section title="Auxiliary plant">
                <p className="whitespace-pre-line">{vesselType.auxiliaryNotes}</p>
              </Section>
            )}

            {/* Cargo systems */}
            {vesselType.cargoSystemNotes && (
              <Section title="Cargo systems">
                <p className="whitespace-pre-line">{vesselType.cargoSystemNotes}</p>
              </Section>
            )}

            {/* Common OEMs */}
            {vesselType.commonOEMs && (
              <Section title="Commonly seen OEMs">
                <p className="whitespace-pre-line">{vesselType.commonOEMs}</p>
              </Section>
            )}

            {/* Engineering challenges */}
            {vesselType.engineeringChallenges && (
              <Section title="Common engineering challenges">
                <p className="whitespace-pre-line">{vesselType.engineeringChallenges}</p>
              </Section>
            )}

            {/* Sourcing notes */}
            {vesselType.sourcingNotes && (
              <Section title="Sourcing considerations">
                <p className="whitespace-pre-line">{vesselType.sourcingNotes}</p>
              </Section>
            )}

            {/* Correction CTA */}
            <div className="mt-12 p-6 bg-mist/30 border border-mist rounded-sm">
              <h3 className="font-display font-bold text-lg text-hull mb-2 not-prose">
                Correction or improvement?
              </h3>
              <p className="text-sm text-steel mb-4 not-prose">
                We rely on the marine engineering community to keep these guides accurate. If you spot something that doesn't match real-world experience or want to add detail from your own work, please get in touch.
              </p>
              <Link
                href="/contact"
                className="inline-block text-signal font-semibold hover:underline text-sm not-prose"
              >
                Contact us →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-xl text-hull mb-3 not-prose">{title}</h2>
      {children}
    </section>
  );
}
