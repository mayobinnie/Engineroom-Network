import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getOrCreateUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  return (
    <>
      <Nav />

      <section className="bg-hull text-sail py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-signal mb-4">
            FOUNDING MEMBER
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter">
            Welcome to EngineRoom Network.
          </h1>
          <p className="mt-4 text-xl text-mist max-w-2xl">
            You&apos;re one of the first members. Thank you for being here at the start.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="bg-pale border-l-4 border-signal p-8 rounded-sm mb-12">
          <p className="font-mono text-xs tracking-widest text-signal font-bold mb-3">
            FOUNDING STAGE
          </p>
          <h2 className="font-display font-bold text-2xl text-hull mb-3 tracking-tight">
            The platform is being built.
          </h2>
          <p className="text-steel leading-relaxed mb-3">
            EngineRoom Network is in active development. Right now, your account is created
            and connected to the founding community. Over the coming weeks, the discussion forums,
            knowledge base, parts marketplace, and crew finder will come online here.
          </p>
          <p className="text-steel leading-relaxed">
            We will email you when major milestones go live. In the meantime, this is your
            home on the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-mist bg-white p-8 rounded-sm">
            <h3 className="font-display font-bold text-xl text-hull mb-3 tracking-tight">
              Your account
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-mono text-xs tracking-wider text-steel uppercase">Email</dt>
                <dd className="text-char font-medium mt-1">{user?.email ?? "Loading..."}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs tracking-wider text-steel uppercase">Member since</dt>
                <dd className="text-char font-medium mt-1">
                  {user
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-mist bg-white p-8 rounded-sm">
            <h3 className="font-display font-bold text-xl text-hull mb-3 tracking-tight">
              Coming soon
            </h3>
            <ul className="space-y-2 text-sm text-steel">
              <li className="flex items-center gap-2">
                <span className="text-signal">→</span> Build your engineer profile
              </li>
              <li className="flex items-center gap-2">
                <span className="text-signal">→</span> Discussion forums
              </li>
              <li className="flex items-center gap-2">
                <span className="text-signal">→</span> Technical knowledge base
              </li>
              <li className="flex items-center gap-2">
                <span className="text-signal">→</span> Parts and equipment marketplace
              </li>
              <li className="flex items-center gap-2">
                <span className="text-signal">→</span> Crew and specialist finder
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-steel hover:text-signal transition-colors font-mono tracking-wider uppercase"
          >
            ← Back to homepage
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
