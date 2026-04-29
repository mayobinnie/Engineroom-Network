import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marine Vessel Types | Engineering Reference | EngineRoom Network",
  description: "Reference guides for marine engineers on major commercial vessel types: tankers, container ships, bulk carriers, gas carriers, offshore vessels, and more.",
  alternates: { canonical: "https://engineroomnetwork.com/vessels" },
};

const CATEGORY_LABELS: Record<string, string> = {
  TANKER: "Tankers",
  GAS_CARRIER: "Gas Carriers",
  CONTAINER: "Container Ships",
  BULK_CARRIER: "Bulk Carriers",
  GENERAL_CARGO: "General Cargo",
  RO_RO: "Ro-Ro",
  PASSENGER: "Passenger Vessels",
  OFFSHORE: "Offshore Vessels",
  SPECIALIZED: "Specialised Vessels",
  NAVAL: "Naval",
  WORKBOAT: "Workboats",
};

export default async function VesselsIndexPage() {
  const vesselTypes = await prisma.vesselType.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Group by category
  const byCategory = vesselTypes.reduce<Record<string, typeof vesselTypes>>((acc, vt) => {
    if (!acc[vt.category]) acc[vt.category] = [];
    acc[vt.category].push(vt);
    return acc;
  }, {});

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="bg-hull text-sail py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-4">
              Engineering Reference
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-6">
              Marine Vessel Types
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              Reference guides for marine engineers on major commercial vessel types. Each guide covers typical equipment, common engineering challenges, and considerations for parts sourcing.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {vesselTypes.length === 0 ? (
              <div className="border border-mist rounded-sm p-8 bg-white text-center">
                <p className="text-steel mb-4">
                  Vessel reference guides are being prepared by domain experts.
                </p>
                <p className="text-sm text-steel">
                  Check back soon, or{" "}
                  <Link href="/sign-up" className="text-signal font-semibold hover:underline">
                    sign up
                  </Link>{" "}
                  to be notified when guides go live.
                </p>
              </div>
            ) : (
              Object.entries(byCategory).map(([category, types]) => (
                <div key={category} className="mb-10">
                  <h2 className="font-display font-bold text-2xl text-hull mb-4 pb-2 border-b border-mist">
                    {CATEGORY_LABELS[category] ?? category}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {types.map((vt) => (
                      <Link
                        key={vt.slug}
                        href={`/vessels/${vt.slug}`}
                        className="border border-mist rounded-sm p-5 bg-white hover:border-signal transition-colors"
                      >
                        <h3 className="font-display font-bold text-lg text-hull mb-2">
                          {vt.name}
                        </h3>
                        {vt.summary && (
                          <p className="text-sm text-steel leading-relaxed line-clamp-3">
                            {vt.summary}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
