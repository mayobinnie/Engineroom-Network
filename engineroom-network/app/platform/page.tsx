import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "How EngineRoom Network works. Knowledge sharing, parts marketplace, and crew finder. Three integrated pillars built for marine engineering teams.",
};

export default function PlatformPage() {
  const scenarios = [
    {
      num: "01",
      title: "A fault at sea",
      time: "0300 hrs / South China Sea",
      body: "A 2nd Engineer sees RPM hunting on a Wartsila auxiliary under load. They search the platform: 'Wartsila auxiliary RPM hunting load'. They find seven existing threads. The top thread, marked 'best answer', describes a fuel injector calibration issue, the diagnostic steps, and the corrective procedure. The 2nd Engineer follows the steps, confirms the diagnosis, and resolves the fault.",
      result: "22 minutes. Without the platform: a wait until morning, a call to the Chief, possibly an OEM service request.",
    },
    {
      num: "02",
      title: "An urgent part",
      time: "Rotterdam / 48-hour window",
      body: "A bulk carrier needs a replacement turbocharger oil seal before the next port departure. The Chief Engineer creates an RFQ on the platform: part specification, delivery port, deadline. The system broadcasts to qualified suppliers. Within four hours, six suppliers have responded with price, lead time, and availability. The Chief picks the best option. The part arrives in time. The vessel sails.",
      result: "Four hours. Without the platform: a half-day of phone calls and email chasing across multiple regions.",
    },
    {
      num: "03",
      title: "A specialist needed",
      time: "Gulf of Mexico / 7-day mobilisation",
      body: "A drilling vessel needs a specialist with Rolls-Royce dynamic positioning experience for a 14-day commissioning project. The Crewing Manager filters the platform's verified engineer directory: rank, specialism, availability, location. Eight matches surface. Three are immediately available. Direct contact, contract, mobilisation.",
      result: "Same day. Without the platform: calls to recruitment agencies, sub-optimal hire under time pressure.",
    },
  ];

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="bg-hull text-sail py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            THE PLATFORM
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tightest leading-[0.95]">
            How it{" "}
            <span className="text-signal italic font-light">actually works.</span>
          </h1>
          <p className="mt-8 text-xl text-mist leading-relaxed max-w-2xl">
            Three small examples of the platform doing its job. Each scenario currently takes hours, days, or weeks. On EngineRoom Network, it takes minutes.
          </p>
        </div>
      </section>

      {/* SCENARIOS */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-24">
        <div className="space-y-16">
          {scenarios.map((scenario) => (
            <div key={scenario.num} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <p className="font-mono text-6xl font-bold text-signal/30 leading-none mb-4">
                  {scenario.num}
                </p>
                <p className="font-mono text-xs tracking-widest text-steel uppercase">
                  {scenario.time}
                </p>
              </div>
              <div className="md:col-span-9">
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-hull mb-6 tracking-tight leading-tight">
                  {scenario.title}
                </h2>
                <p className="text-lg text-char leading-relaxed mb-6">{scenario.body}</p>
                <div className="border-l-4 border-signal pl-6 py-2">
                  <p className="text-steel italic">{scenario.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S IN IT */}
      <section className="bg-white py-24 border-y border-mist">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs tracking-widest text-signal mb-4">
              FEATURES
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-hull leading-tight">
              Everything a working engineer needs. In one place.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Discussion forums",
                body: "Threaded technical discussions organised by system, vessel type, and OEM. Search the collective experience of every engineer on the platform.",
              },
              {
                title: "Troubleshooting Q&A",
                body: "Structured fault questions with templated context: vessel type, OEM, system, operating conditions. Get answers from peers who have seen the same issue.",
              },
              {
                title: "Technical knowledge base",
                body: "Curated articles, maintenance guides, case studies and lessons learned. Searchable, attributable, and contributed to by the community.",
              },
              {
                title: "OEM channels",
                body: "Dedicated discussion channels for major engine and equipment manufacturers: MAN B&W, Wartsila, Caterpillar, Cummins, ABB, Siemens and more.",
              },
              {
                title: "Parts marketplace",
                body: "Verified global supplier network with parts availability search, OEM compatibility filtering, and direct supplier contact.",
              },
              {
                title: "Multi-supplier RFQ",
                body: "Submit a single request, broadcast to qualified suppliers, compare responses side by side. Procurement that moves at the pace of operations.",
              },
              {
                title: "Engineer profiles",
                body: "Verified profiles with rank, specialism, vessel-type experience, certifications and availability. Searchable by fleet operators globally.",
              },
              {
                title: "Specialist finder",
                body: "Filter the verified engineer directory by rank, specialism, location, availability and credentials. Find the right person, fast.",
              },
              {
                title: "Industry news",
                body: "Curated industry updates focused on engineering implications: regulations, fuel transitions, technology, major incidents and lessons.",
              },
            ].map((feat) => (
              <div key={feat.title} className="bg-pale border border-mist p-6 lg:p-8 rounded-sm">
                <h3 className="font-display font-bold text-xl text-hull mb-3 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-steel leading-relaxed">{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-24 text-center">
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-hull mb-6 leading-tight">
          Be among the first to join.
        </h2>
        <p className="text-xl text-steel mb-8 max-w-2xl mx-auto leading-relaxed">
          Add your name to the early-access list. We&apos;ll keep you informed as the platform comes together.
        </p>
        <Link
          href="/#join"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-hull text-white font-semibold rounded-sm hover:bg-signal transition-colors"
        >
          Join the waitlist
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
      </section>

      <Footer />
    </>
  );
}
