import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-hull text-mist mt-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Logo variant="horizontal" reverse width={220} />
            <p className="mt-6 text-sm leading-relaxed max-w-md text-mist/80">
              The global professional network for marine engineering teams.
              Built by engineers, for engineers.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/platform" className="hover:text-white transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/#join" className="hover:text-white transition-colors">
                  Early access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Get in touch
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@engineroomnetwork.com"
                  className="hover:text-white transition-colors"
                >
                  hello@engineroomnetwork.com
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-mist/60 font-mono tracking-wider">
          <span>&copy; {year} ENGINEROOM NETWORK. ALL RIGHTS RESERVED.</span>
          <span>BUILT BY ENGINEERS, FOR ENGINEERS.</span>
        </div>
      </div>
    </footer>
  );
}
