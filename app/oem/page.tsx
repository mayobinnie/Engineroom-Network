import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine OEMs and Equipment Manufacturers | EngineRoom Network",
  description: "Browse marine equipment manufacturers and OEMs. Find authorised parts and service suppliers for MAN, Wärtsilä, Caterpillar, Cummins, ABB, and more.",
  alternates: { canonical: "https://engineroomnetwork.com/oem" },
};

export default async function OEMIndexPage() {
  const oems = await prisma.oEM.findMany({ orderBy: { name: "asc" } });

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
              Marine OEMs & Equipment Manufacturers
            </h1>
            <p className="text-lg text-mist max-w-3xl leading-relaxed">
              The major marine engine builders and equipment manufacturers, with curated lists of parts suppliers, authorised service providers, and aftermarket specialists for each.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {oems.map((oem) => (
                <Link
                  key={oem.slug}
                  href={`/oem/${oem.slug}`}
                  className="border border-mist rounded-sm p-5 bg-white hover:border-signal transition-colors"
                >
                  <h3 className="font-display font-bold text-lg text-hull mb-1">{oem.name}</h3>
                  {oem.headquarters && (
                    <p className="text-xs font-mono uppercase text-steel mb-2">
                      {oem.headquarters}
                    </p>
                  )}
                  {oem.description && (
                    <p className="text-sm text-steel leading-relaxed line-clamp-2">
                      {oem.description}
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
