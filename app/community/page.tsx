import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The EngineRoom Network community: every rank, every vessel type, every engineering discipline. Built on technical credibility.",
};

export default function CommunityPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="bg-hull text-sail py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            THE COMMUNITY
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tightest leading-[0.95]">
            Every rank.{" "}
            <span className="text-signal italic font-light">Every vessel.</span>{" "}
            Every discipline.
          </h1>
          <p className="mt-8 text-xl text-mist leading-relaxed max-w-2xl">
            EngineRoom Network is structured around how marine engineering actually works. Not how a software designer thinks it works.
          </p>
        </div>
      </section>

      {/* RANKS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="max-w-3xl mb-12">
          <p className="font-mono text-xs tracking-widest text-signal mb-4">
            01 / RANKS REPRESENTED
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tighter text-hull leading-tight">
            From Cadet to Marine Superintendent. Every rank in the engineering hierarchy.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-mist rounded-sm overflow-hidden border border-mist">
          {[
            "Cadet / Junior Engineer",
            "4th Engineer",
            "3rd Engineer",
            "2nd Engineer",
            "Chief Engineer",
            "Marine Superintendent",
            "Shipyard Engineer",
            "Offshore Engineer",
            "Electro-Technical Officer",
            "Surveyor / Class",
          ].map((rank) => (
            <div key={rank} className="bg-white p-5">
              <p className="font-display font-semibold text-hull text-sm leading-snug">
                {rank}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VESSEL TYPES */}
      <section className="bg-white py-20 sm:py-24 border-y border-mist">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs tracking-widest text-signal mb-4">
              02 / VESSEL TYPES
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tighter text-hull leading-tight">
              Every vessel type and trade. Discussion organised around the realities of the work.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { type: "Tankers", desc: "Crude, Product, Chemical, LNG, LPG, Bunkering" },
              { type: "Container ships", desc: "Feeder, Panamax, Post-Panamax, Ultra Large" },
              { type: "Bulk carriers", desc: "Handysize, Handymax, Panamax, Capesize, VLOC" },
              { type: "Offshore vessels", desc: "PSV, AHTS, OSV, ROV Support, Drilling" },
              { type: "Cruise & passenger", desc: "Cruise, Ferries, Expedition, Yacht" },
              { type: "Specialised", desc: "RoRo, Heavy Lift, Cable Layer, Research, Naval" },
            ].map((vessel) => (
              <div key={vessel.type} className="border border-mist bg-pale p-6 rounded-sm">
                <h3 className="font-display font-bold text-xl text-hull mb-2 tracking-tight">
                  {vessel.type}
                </h3>
                <p className="text-sm text-steel leading-relaxed">{vessel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCIPLINES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="max-w-3xl mb-12">
          <p className="font-mono text-xs tracking-widest text-signal mb-4">
            03 / ENGINEERING DISCIPLINES
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tighter text-hull leading-tight">
            Every system, every discipline. Organised the way engineers actually think about their work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { area: "Engine Systems", items: ["Main engines", "Auxiliary engines", "Fuel systems", "Lubrication", "Cooling", "Turbochargers"] },
            { area: "Electrical Systems", items: ["Generators", "Switchboards", "Automation", "PLC systems", "Alarms", "Motors & drives"] },
            { area: "Auxiliary Systems", items: ["Boilers", "Compressors", "Purifiers", "Pumps", "Heat exchangers", "Steering gear"] },
            { area: "Maintenance", items: ["Planned maintenance", "Major overhauls", "Troubleshooting", "Spare parts", "Drydocking", "Surveys"] },
          ].map((discipline) => (
            <div key={discipline.area} className="border border-mist p-6 rounded-sm">
              <h3 className="font-display font-bold text-lg text-hull mb-4 tracking-tight">
                {discipline.area}
              </h3>
              <ul className="space-y-2">
                {discipline.items.map((item) => (
                  <li key={item} className="text-sm text-steel">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="bg-hull text-sail py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            THE COMMUNITY PRINCIPLE
          </p>
          <p className="font-display font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            EngineRoom Network is built by engineers, for engineers. Technical accuracy and peer credibility are the platform&apos;s core values.{" "}
            <span className="text-signal italic">That makes it the resource maritime professionals actually trust and return to.</span>
          </p>

          <div className="mt-12">
            <Link
              href="/#join"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-signal text-white font-semibold rounded-sm hover:bg-white hover:text-hull transition-colors"
            >
              Be a founding member
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
