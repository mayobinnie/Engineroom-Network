import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VesselTypeForm } from "@/components/VesselTypeForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Vessel Type | Admin | EngineRoom Network",
  robots: { index: false, follow: false },
};

export default async function AdminVesselEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  const vesselType = await prisma.vesselClass.findUnique({ where: { slug } });
  if (!vesselType) notFound();

  return (
    <>
      <Nav />
      <main className="bg-sail min-h-screen">
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-signal font-mono text-sm uppercase tracking-wide mb-1">
              Admin / Vessel Types
            </p>
            <h1 className="font-display font-bold text-3xl text-hull mb-2">{vesselType.name}</h1>
            <p className="text-steel mb-8">
              Status:{" "}
              {vesselType.isPublished ? (
                <span className="text-signal font-semibold">Published</span>
              ) : (
                <span className="text-brass font-semibold">Draft (not visible publicly)</span>
              )}
            </p>

            <VesselTypeForm
              vesselType={{
                id: vesselType.id,
                slug: vesselType.slug,
                name: vesselType.name,
                shortName: vesselType.shortName,
                summary: vesselType.summary,
                description: vesselType.description,
                typicalSize: vesselType.typicalSize,
                propulsionNotes: vesselType.propulsionNotes,
                auxiliaryNotes: vesselType.auxiliaryNotes,
                cargoSystemNotes: vesselType.cargoSystemNotes,
                commonOEMs: vesselType.commonOEMs,
                engineeringChallenges: vesselType.engineeringChallenges,
                sourcingNotes: vesselType.sourcingNotes,
                isPublished: vesselType.isPublished,
                reviewedBy: vesselType.reviewedBy,
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
