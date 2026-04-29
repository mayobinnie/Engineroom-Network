import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

/**
 * Get the local User record for the currently authenticated Clerk user.
 * If no local record exists yet, create one (lazy provisioning on first use).
 *
 * Returns null if no user is signed in.
 */
export async function getOrCreateUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Check if local user already exists
  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (existing) return existing;

  // Pull full user details from Clerk to populate the local record
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) return null;

  // Create the local user. Profile is created lazily when the user first
  // visits their profile page or completes onboarding.
  return prisma.user.create({
    data: {
      clerkId: userId,
      email: primaryEmail.toLowerCase(),
    },
  });
}

/**
 * Get the currently authenticated user, throwing if not signed in.
 * Use in protected routes where authentication has already been enforced.
 */
export async function requireUser(): Promise<User> {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthenticated");
  return user;
}
