import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-sail flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-10" aria-label="EngineRoom Network home">
        <Logo variant="horizontal" width={220} />
      </Link>

      <div className="mb-6 text-center max-w-md">
        <h1 className="font-display font-bold text-3xl text-hull tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-steel">
          Join the global professional network for marine engineers.
        </p>
      </div>

      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg border border-mist rounded-sm",
          },
        }}
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />

      <p className="mt-8 text-sm text-steel">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-signal font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
