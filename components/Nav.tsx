import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="border-b border-mist bg-sail/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" aria-label="EngineRoom Network home" className="flex items-center">
          <Logo variant="horizontal" width={180} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-hull">
          <Link href="/about" className="hover:text-signal transition-colors">
            About
          </Link>
          <Link href="/platform" className="hover:text-signal transition-colors">
            Platform
          </Link>
          <Link href="/community" className="hover:text-signal transition-colors">
            Community
          </Link>
          <Link href="/contact" className="hover:text-signal transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-hull hover:text-signal transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-hull text-white text-sm font-semibold rounded-sm hover:bg-signal transition-colors"
            >
              Join
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7H13M13 7L7 1M13 7L7 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-hull hover:text-signal transition-colors"
            >
              Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
