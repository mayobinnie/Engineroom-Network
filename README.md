# EngineRoom Network

The pre-launch site and emerging platform for EngineRoom Network, the global professional network for marine engineering teams.

Built with Next.js 15, Tailwind CSS, Prisma, Supabase Postgres, and Clerk authentication. Deployed on Vercel.

---

## What's in here (Slice 1)

This codebase contains:

- **Marketing site:** Home, About, Platform, Community, Contact, Privacy, Terms.
- **Working waitlist form** that writes signups to a Postgres database.
- **Authentication:** Clerk-powered sign-up, sign-in, email verification.
- **Member dashboard:** placeholder home for authenticated users.
- **Database schema:** User and Profile models ready for the platform features in coming slices.
- **Brand identity:** typography, colour palette, the Meridian logo as a reusable React component.
- **SEO foundations:** meta tags, Open Graph, sitemap.xml, robots.txt, favicons.

---

## Local development

### Prerequisites

- Node.js 18.18 or later
- A Supabase account with a Postgres project (free tier works)
- A Clerk account with an application set up (free tier works)

### Setup

```bash
# Install dependencies
npm install

# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your DATABASE_URL, DIRECT_URL,
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, and CLERK_SECRET_KEY

# Push the database schema to your Supabase project
npm run db:push

# Run the development server
npm run dev
```

The site will be available at http://localhost:3000.

### Database

The Prisma schema in `prisma/schema.prisma` defines:

- `User` and `Profile` for member accounts (linked to Clerk via `clerkId`)
- `WaitlistSignup` for pre-launch signups

To inspect the database:

```bash
npm run db:studio
```

---

## Deployment to Vercel

### Step 1: Push to GitHub

If not already pushed:

```bash
git add .
git commit -m "Slice 1: Clerk auth + Supabase migration"
git push
```

If you're updating an already-deployed repo, Vercel will auto-deploy on push.

### Step 2: Set environment variables in Vercel

In your Vercel project: **Settings → Environment Variables**. Add the four required variables:

- `DATABASE_URL` (Supabase pooler URL with password filled in)
- `DIRECT_URL` (Supabase direct URL with password filled in)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Apply each to **Production**, **Preview**, and **Development** environments.

### Step 3: Push the database schema to Supabase

From your local machine, with `.env.local` populated with the production values:

```bash
npm run db:push
```

This applies the schema to your Supabase database.

### Step 4: Trigger a redeploy

In Vercel: **Deployments → ⋯ → Redeploy** on the latest. With env vars in place and database ready, the build will succeed.

---

## File structure

```
engineroom-app/
├── app/
│   ├── api/waitlist/route.ts             # Waitlist signup API
│   ├── about/page.tsx                    # Public marketing pages
│   ├── community/page.tsx
│   ├── contact/page.tsx
│   ├── platform/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── dashboard/page.tsx                # Authenticated home
│   ├── sign-in/[[...sign-in]]/page.tsx   # Clerk sign-in
│   ├── sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up
│   ├── globals.css
│   ├── icon.svg
│   ├── apple-icon.svg
│   ├── layout.tsx                        # Root layout (ClerkProvider, fonts)
│   ├── page.tsx                          # Homepage
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── Footer.tsx
│   ├── Logo.tsx                          # Meridian logo (3 variants)
│   ├── Nav.tsx                           # Auth-aware navigation
│   └── WaitlistForm.tsx
├── lib/
│   ├── auth.ts                           # User sync helpers
│   ├── prisma.ts                         # Prisma client singleton
│   └── validation.ts                     # Zod schemas
├── prisma/
│   └── schema.prisma                     # User, Profile, WaitlistSignup
├── public/                               # Static assets
├── middleware.ts                         # Clerk route protection
├── .env.example                          # Env var template
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Brand standards

- **Colours:** Hull (#0D1B2A), Signal (#1B6CFF), Steel (#5C6B7A), Brass (#B98A3D), Sail (#F4F1EA), Mist (#DCE6F0).
- **Typography:** Bricolage Grotesque (display), Manrope (body), JetBrains Mono (technical labels).
- **Logo:** The Meridian mark in horizontal, stacked, and mark-only variants.
- **Voice:** Technical, practical, confident, global. No em-dashes anywhere.

---

## Roadmap

This is Slice 1 of a multi-slice build. Each slice is shipped independently.

- **Slice 1 (this):** Auth foundation, Supabase migration, member accounts ✓
- **Slice 2:** Member profiles (rank, vessel type, specialism)
- **Slice 3:** Discussion forums (categories, posts, replies, voting)
- **Slice 4:** Knowledge base (articles, attribution, search)
- **Slice 5:** Supplier directory and basic marketplace
- **Slice 6:** Crew and specialist finder
- **Slice 7:** Monetisation (Stripe, Pro and Enterprise tiers)

Each slice adds working features without breaking what came before.

---

## Contact

For questions about this codebase, contact the development team.

For everything else: hello@engineroomnetwork.com. 
