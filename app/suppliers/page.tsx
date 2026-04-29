import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine Parts Suppliers Directory | EngineRoom Network",
  description: "Curated global directory of marine engineering parts suppliers, ship chandlers, and technical service providers. Browse by location to find suppliers in your port.",
  alternates: { canonical: "https://engineroomnetwork.com/suppliers" },
};

export default async function SuppliersIndexPage() {
  const locations = await prisma.location.findMany({
    orderBy: [{ isMajorHub: "desc" }, { name: "asc" }],
  });

  // Group by region
  const byRegion = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    if (!acc[loc.region]) acc[loc.region] = [];
    acc[loc.region].push(loc);
    return acc;
  }, {});

  const regionLabels: Record<string, string> = {
    EUROPE: "Europe",
    ASIA_PACIFIC: "Asia-Pacific",
    MIDDLE_EAST: "Middle East",
    AFRICA: "Africa",
    NORTH_AMERICA: "North America",
    SOUTH_AMERICA: "South America",
    OCEANIA: "Oceania",
  };

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
              Marine Parts Suppliers Directory
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              A curated guide for marine engineers sourcing parts, services, and technical support worldwide. Browse by port location, part category, or original equipment manufacturer (OEM).
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-hull mb-8">
              Browse by location
            </h2>
            {Object.entries(byRegion).map(([region, locs]) => (
              <div key={region} className="mb-10">
                <h3 className="font-display font-bold text-lg text-hull mb-4 pb-2 border-b border-mist">
                  {regionLabels[region]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {locs.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/suppliers/${loc.slug}`}
                      className="text-steel hover:text-signal py-2 transition-colors"
                    >
                      {loc.name}
                      {loc.isMajorHub && (
                        <span className="ml-2 text-xs font-mono uppercase text-brass">Hub</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-6 border-t border-mist">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-between">
            <Link
              href="/parts"
              className="flex-1 border border-mist rounded-sm p-6 hover:border-signal transition-colors bg-white"
            >
              <h3 className="font-display font-bold text-lg text-hull mb-2">
                Browse by part category →
              </h3>
              <p className="text-steel text-sm">
                Find suppliers specialising in turbochargers, fuel injection, electrical equipment, and more.
              </p>
            </Link>
            <Link
              href="/oem"
              className="flex-1 border border-mist rounded-sm p-6 hover:border-signal transition-colors bg-white"
            >
              <h3 className="font-display font-bold text-lg text-hull mb-2">
                Browse by OEM →
              </h3>
              <p className="text-steel text-sm">
                Find suppliers for MAN, Wärtsilä, Caterpillar, Cummins, and other major marine engine and equipment manufacturers.
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
