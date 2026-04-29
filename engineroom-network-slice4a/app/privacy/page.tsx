import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EngineRoom Network handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
        <p className="font-mono text-xs tracking-widest text-signal mb-4">
          PRIVACY
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-hull mb-12 tracking-tighter">
          Privacy Policy
        </h1>
        <div className="prose prose-lg max-w-none text-char space-y-6">
          <p className="text-steel italic">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
          </p>
          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">What we collect</h2>
          <p>
            When you join our waitlist, we collect your email address and any additional information you choose to share, such as your name, professional rank, and vessel type experience.
          </p>
          <p>
            We may collect basic technical information when you visit the site, including your IP address, browser type, and pages visited. This is used to maintain the service and detect abuse.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">How we use it</h2>
          <p>
            We use your information solely to keep you informed about EngineRoom Network and to contact you when early access becomes available. We do not share your information with third parties for marketing purposes.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Your rights</h2>
          <p>
            You have the right to access, correct, or delete your data at any time. You can also request that we stop contacting you. To exercise any of these rights, email{" "}
            <a href="mailto:privacy@engineroomnetwork.com" className="text-signal underline">
              privacy@engineroomnetwork.com
            </a>
            .
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Data retention</h2>
          <p>
            We retain waitlist signup information until you ask us to delete it, or until the platform launches and you decide whether to create an account.
          </p>

          <h2 className="font-display font-bold text-2xl text-hull mt-12 mb-4">Contact</h2>
          <p>
            For any privacy-related questions, contact{" "}
            <a href="mailto:privacy@engineroomnetwork.com" className="text-signal underline">
              privacy@engineroomnetwork.com
            </a>
            .
          </p>

          <div className="border-l-4 border-signal bg-pale p-6 mt-12 rounded-sm">
            <p className="text-sm text-steel">
              <strong className="text-hull">Note:</strong> This is a placeholder privacy policy for our pre-launch site. A comprehensive privacy policy and terms of service will be published with the full platform launch.
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
