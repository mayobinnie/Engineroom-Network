import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why EngineRoom Network exists. The founding story, the people behind it, and the principles that guide every decision.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="bg-hull text-sail py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            ABOUT ENGINEROOM NETWORK
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tightest leading-[0.95]">
            Built by an engineer.{" "}
            <span className="text-signal italic font-light">For engineers.</span>
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="prose prose-lg max-w-none">
          <p className="text-2xl text-steel leading-relaxed font-light italic mb-12">
            Marine engineering keeps the world moving. The infrastructure those engineers depend on to do their jobs has barely changed in 50 years. We are going to fix it.
          </p>

          <h2 className="font-display font-bold text-3xl text-hull tracking-tight mt-16 mb-6">
            Why this exists
          </h2>
          <p className="text-char leading-relaxed mb-6">
            Around 90% of global trade moves on ships. Those ships are kept running by marine engineers, working in conditions, time zones and physical realities that the rest of the global workforce can scarcely imagine. They are professionals at the highest level of their trade.
          </p>
          <p className="text-char leading-relaxed mb-6">
            And yet the digital infrastructure available to them, the tools they reach for when something goes wrong at 3am in the South China Sea, has barely advanced since the era of paper manuals and personal phone contacts. There is no global, credible, searchable resource for marine engineering knowledge. There is no integrated way to source parts under time pressure. There is no verified directory of qualified specialists.
          </p>
          <p className="text-char leading-relaxed mb-6">
            That gap costs the industry tens of billions of dollars per year in preventable downtime. More importantly, it costs working engineers time, sleep, and standing in their profession. We are building EngineRoom Network to close it.
          </p>

          <h2 className="font-display font-bold text-3xl text-hull tracking-tight mt-16 mb-6">
            The founding principle
          </h2>
          <p className="text-char leading-relaxed mb-6">
            EngineRoom Network is being built by a working marine engineer with 15+ years of industry experience. That single fact shapes every product decision. The platform is structured around how engineering work actually happens, around the problems engineers actually face, in the language they actually use.
          </p>
          <p className="text-char leading-relaxed mb-6">
            This is not a software platform that has identified maritime as a market opportunity. It is the platform a working engineer wishes had existed for the last 15 years, and decided to build.
          </p>
          <p className="text-char leading-relaxed mb-6">
            That distinction is the difference between a generic SaaS product applied to shipping, and a purpose-built professional infrastructure for a profession that has been waiting for one.
          </p>

          <div className="bg-pale border-l-4 border-signal p-8 my-16 rounded-sm">
            <p className="font-mono text-xs tracking-widest text-signal mb-3 font-bold">
              THE PRINCIPLE
            </p>
            <p className="text-xl text-hull leading-relaxed">
              Technical credibility is the foundation. Every feature exists to serve, or be served by, the engineering community. We do not build features that compromise the platform&apos;s standing with the engineers who use it.
            </p>
          </div>

          <h2 className="font-display font-bold text-3xl text-hull tracking-tight mt-16 mb-6">
            What we are building
          </h2>
          <p className="text-char leading-relaxed mb-6">
            Three integrated pillars in one platform. A knowledge hub where the collective intelligence of the global engineering profession is searchable and shared. A parts and equipment marketplace where verified suppliers compete for visibility on engineering terms. A crew and specialist finder where verified engineering professionals are reachable globally.
          </p>
          <p className="text-char leading-relaxed mb-6">
            Each pillar can stand alone. Together, they form a network where engineers, suppliers and operators reinforce each other. The platform becomes more useful as more engineers join, which makes more suppliers want to be listed, which funds better content for engineers.
          </p>

          <h2 className="font-display font-bold text-3xl text-hull tracking-tight mt-16 mb-6">
            Where we are now
          </h2>
          <p className="text-char leading-relaxed mb-6">
            EngineRoom Network is at concept and build stage. The product is fully specified. The brand identity is in place. The platform itself is being built now, with public launch planned for 2026.
          </p>
          <p className="text-char leading-relaxed mb-6">
            We are deliberately keeping the founding stage small. The senior maritime professionals involved at this stage shape what the platform becomes for everyone who joins later. If you are someone whose experience and standing in the industry could help build this properly, we would welcome a conversation.
          </p>

          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            <Link
              href="/#join"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-hull text-white font-semibold rounded-sm hover:bg-signal transition-colors"
            >
              Join the early-access list
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-mist text-hull font-semibold rounded-sm hover:border-signal hover:text-signal transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
