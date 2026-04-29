import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Admin email allowlist. Anyone in this list has admin access.
// Configure ADMIN_EMAILS as a comma-separated string in env vars.
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/dashboard");

  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(email)) {
    redirect("/dashboard");
  }

  return { userId, email };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (!email) return false;
    return getAdminEmails().includes(email);
  } catch {
    return false;
  }
}
