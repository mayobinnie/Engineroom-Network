import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative bg-hull text-sail overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-signal/15 blur-3xl rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brass/10 blur-3xl rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32 lg:py-40">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            COMING SOON / 2026
          </p>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tightest leading-[0.95] max-w-5xl">
            The professional network{" "}
            <span className="text-signal italic font-light">marine engineering</span>{" "}
            has always needed.
          </h1>

          <p className="mt-10 max-w-2xl text-xl sm:text-2xl text-mist leading-relaxed font-light">
            Knowledge, parts and people in one platform. Built by engineers, for engineers. Connecting marine engineering professionals worldwide for the first time.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="#join"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-signal text-white font-semibold rounded-sm hover:bg-white hover:text-hull transition-colors"
            >
              Join the early-access list
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-mist/30 text-mist font-semibold rounded-sm hover:bg-white/10 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="font-mono text-xs tracking-widest text-signal mb-4">
            01 / THE PROBLEM
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-hull leading-tight">
            Marine engineering runs the world economy. The infrastructure those engineers depend on is broken.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-mist mt-16 rounded-sm overflow-hidden border border-mist">
          {[
            {
              num: "01",
              title: "Knowledge is tribal",
              body: "There is no global, searchable, credible technical resource for marine engineering. Manuals are fragmented. Forums are unmoderated. The expertise that matters lives in personal networks built over careers.",
            },
            {
              num: "02",
              title: "Parts procurement is broken",
              body: "Sourcing replacement parts under time pressure means working through chains of brokers, agents and middlemen, each adding cost, delay and uncertainty. Vessels sit idle while procurement teams chase quotes.",
            },
            {
              num: "03",
              title: "Specialist sourcing is luck-based",
              body: "Finding a qualified specialist engineer at a specific port within 24 hours depends entirely on who you happen to know in that part of the world.",
            },
          ].map((item) => (
            <div key={item.num} className="bg-white p-8 lg:p-10">
              <p className="font-mono text-xs tracking-widest text-signal mb-4">
                {item.num}
              </p>
              <h3 className="font-display font-bold text-2xl text-hull mb-4 tracking-tight">
                {item.title}
              </h3>
              <p className="text-steel leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-l-4 border-signal bg-pale p-8 rounded-sm">
          <p className="text-xl text-hull leading-relaxed max-w-4xl">
            Unplanned vessel downtime costs the maritime industry an estimated{" "}
            <strong>$38 to $50 billion</strong> per year. A meaningful proportion is prolonged by avoidable delays in accessing the right knowledge, the right part, or the right specialist.
          </p>
        </div>
      </section>

      {/* THE PLATFORM */}
      <section className="bg-white py-24 sm:py-32 border-y border-mist">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-widest text-signal mb-4">
              02 / THE PLATFORM
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-hull leading-tight">
              Three pillars. One platform. Built around how marine engineers actually work.
            </h2>
            <p className="mt-6 text-xl text-steel leading-relaxed">
              Each pillar can stand alone. Together, they form a flywheel where engineers, suppliers and operators reinforce each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                tag: "PILLAR 01",
                title: "Knowledge Hub",
                body: "Discussion forums, troubleshooting Q&A, technical knowledge base and OEM-specific channels. The community engine, where engineers go daily to ask, learn and share.",
                features: [
                  "Searchable technical library",
                  "Peer troubleshooting Q&A",
                  "OEM-specific channels",
                  "Vessel-type discussions",
                ],
              },
              {
                tag: "PILLAR 02",
                title: "Parts Marketplace",
                body: "Verified global supplier network, parts availability search, multi-supplier RFQ workflow, supplier ratings. Procurement that actually works under pressure.",
                features: [
                  "Verified supplier network",
                  "Multi-supplier RFQ workflow",
                  "Live availability search",
                  "Supplier ratings & reviews",
                ],
              },
              {
                tag: "PILLAR 03",
                title: "Crew & Specialists",
                body: "Verified engineer profiles searchable by rank, specialism, vessel-type and availability. Direct engagement between fleet operators and individual professionals.",
                features: [
                  "Verified engineer profiles",
                  "Filter by rank & specialism",
                  "Availability indicators",
                  "Direct messaging",
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.tag}
                className="bg-pale border border-mist rounded-sm p-8 lg:p-10 hover:border-signal transition-colors"
              >
                <p className="font-mono text-xs tracking-widest text-signal mb-3">
                  {pillar.tag}
                </p>
                <h3 className="font-display font-bold text-3xl text-hull mb-4 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-steel leading-relaxed mb-6">{pillar.body}</p>
                <ul className="space-y-2 pt-6 border-t border-mist">
                  {pillar.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-char">
                      <span className="text-signal font-bold mt-0.5">→</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT SERVES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="font-mono text-xs tracking-widest text-signal mb-4">
            03 / WHO IT SERVES
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-hull leading-tight">
            The whole maritime engineering profession. From Cadet to Marine Superintendent.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-mist mt-16 rounded-sm overflow-hidden border border-mist">
          {[
            { title: "Marine Engineers", desc: "From cadet to Chief, ETO to Superintendent" },
            { title: "Fleet Operators", desc: "Technical Managers, Crewing, Procurement" },
            { title: "Suppliers", desc: "Parts and equipment vendors worldwide" },
            { title: "Industry Partners", desc: "OEMs, training providers, classification" },
          ].map((aud) => (
            <div key={aud.title} className="bg-white p-6 lg:p-8">
              <h3 className="font-display font-bold text-lg text-hull mb-2 tracking-tight">
                {aud.title}
              </h3>
              <p className="text-sm text-steel leading-relaxed">{aud.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN / WAITLIST */}
      <section id="join" className="bg-hull text-sail py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-signal/10 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest text-signal mb-4">
              04 / JOIN US
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-tight max-w-3xl mx-auto">
              Be among the first to join the network.
            </h2>
            <p className="mt-6 text-xl text-mist leading-relaxed max-w-2xl mx-auto">
              Add your name to the early-access list. We&apos;ll keep you informed as the platform comes together, and reach out directly when access opens.
            </p>
          </div>

          <div className="bg-sail text-hull p-8 lg:p-12 rounded-sm">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
