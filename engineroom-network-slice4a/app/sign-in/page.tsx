import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-sail flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-10" aria-label="EngineRoom Network home">
        <Logo variant="horizontal" width={220} />
      </Link>

      <div className="mb-6 text-center">
        <h1 className="font-display font-bold text-3xl text-hull tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-steel">Sign in to your EngineRoom Network account</p>
      </div>

      <SignIn
        routing="hash"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg border border-mist rounded-sm",
          },
        }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />

      <p className="mt-8 text-sm text-steel">
        Not a member yet?{" "}
        <Link href="/sign-up" className="text-signal font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
