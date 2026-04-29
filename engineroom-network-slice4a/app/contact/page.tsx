import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WaitlistForm } from "@/components/WaitlistForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EngineRoom Network team.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      <section className="bg-hull text-sail py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-signal mb-6">
            GET IN TOUCH
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tightest leading-[0.95]">
            Let&apos;s{" "}
            <span className="text-signal italic font-light">talk.</span>
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border-l-4 border-signal pl-6 py-2">
            <p className="font-mono text-xs tracking-widest text-signal mb-2">
              GENERAL ENQUIRIES
            </p>
            <a
              href="mailto:hello@engineroomnetwork.com"
              className="font-display font-semibold text-hull hover:text-signal transition-colors"
            >
              hello@engineroomnetwork.com
            </a>
          </div>

          <div className="border-l-4 border-signal pl-6 py-2">
            <p className="font-mono text-xs tracking-widest text-signal mb-2">
              FOUNDING PARTNERS
            </p>
            <a
              href="mailto:partners@engineroomnetwork.com"
              className="font-display font-semibold text-hull hover:text-signal transition-colors"
            >
              partners@engineroomnetwork.com
            </a>
          </div>

          <div className="border-l-4 border-signal pl-6 py-2">
            <p className="font-mono text-xs tracking-widest text-signal mb-2">
              MEDIA
            </p>
            <a
              href="mailto:press@engineroomnetwork.com"
              className="font-display font-semibold text-hull hover:text-signal transition-colors"
            >
              press@engineroomnetwork.com
            </a>
          </div>
        </div>

        <div className="bg-pale border border-mist rounded-sm p-8 lg:p-12">
          <h2 className="font-display font-bold text-3xl text-hull mb-3 tracking-tight">
            Or join the waitlist directly.
          </h2>
          <p className="text-steel leading-relaxed mb-8">
            We&apos;ll keep you informed as the platform comes together, and reach out directly when early access opens.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
