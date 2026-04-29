import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for EngineRoom Network.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
        <p className="font-mono text-xs tracking-widest text-signal mb-4">
          TERMS
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-hull mb-12 tracking-tighter">
          Terms of Use
        </h1>
        <div className="prose prose-lg max-w-none text-char space-y-6">
          <p className="text-steel italic">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Pre-launch site</h2>
          <p>
            This site is the pre-launch presence for EngineRoom Network. The platform itself is in development, and these terms cover the use of this site only. Comprehensive terms will be published with the platform launch.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Acceptable use</h2>
          <p>
            You agree to use this site lawfully and not to attempt to disrupt its operation, exploit security vulnerabilities, or use automated systems to harvest information.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Intellectual property</h2>
          <p>
            The EngineRoom Network name, logo, branding, content and design are the property of EngineRoom Network. You may not reproduce them without permission.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Liability</h2>
          <p>
            This site is provided on an as-is basis. We do not guarantee uninterrupted access or accuracy of content. To the extent permitted by law, we are not liable for any losses arising from your use of the site.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Contact</h2>
          <p>
            For any terms-related questions, contact{" "}
            <a href="mailto:hello@engineroomnetwork.com" className="text-signal underline">
              hello@engineroomnetwork.com
            </a>
            .
          </p>

          <div className="border-l-4 border-signal bg-pale p-6 mt-12 rounded-sm">
            <p className="text-sm text-steel">
              <strong className="text-hull">Note:</strong> This is a placeholder terms-of-use document for our pre-launch site. Full terms of service will be published with the platform launch.
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
