# Slice 4a: Supplier Directory

## What this is

A curated, SEO-optimised directory of marine engineering parts suppliers, structured by location, part category, and OEM. Built into the EngineRoom Network platform but quietly indexed (no public navigation link) until populated with at least 50 suppliers.

## URL structure

Public routes (live and indexable for SEO):

- `/suppliers` — global directory hub, lists all locations
- `/suppliers/[location]` — e.g. `/suppliers/singapore`, `/suppliers/rotterdam`
- `/suppliers/[location]/[category]` — e.g. `/suppliers/singapore/turbochargers` (SEO gold)
- `/parts` — all part categories
- `/parts/[category]` — e.g. `/parts/turbochargers`, `/parts/fuel-injectors`
- `/oem` — all OEMs
- `/oem/[manufacturer]` — e.g. `/oem/man-energy-solutions`, `/oem/wartsila`
- `/oem/[manufacturer]/[location]` — e.g. `/oem/man-energy-solutions/rotterdam`

Admin routes (protected, requires admin email):

- `/admin` — admin dashboard with stats
- `/admin/suppliers` — list all suppliers (published and draft)
- `/admin/suppliers/new` — add a new supplier

## Setup steps after deploying

### 1. Run the seed script

The seed script populates Locations (30), Part Categories (25), and OEMs (20).

Locally:

```bash
npm run db:seed
```

This runs once. It uses `upsert` so it's safe to run again, it won't duplicate data.

### 2. Set ADMIN_EMAILS in Vercel

In Vercel → Settings → Environment Variables, add:

- **Key:** `ADMIN_EMAILS`
- **Value:** comma-separated list of email addresses (e.g. `mayo.binnie@gmail.com,adam@...`)
- Apply to Production, Preview, Development

Only emails on this list can access `/admin`.

### 3. Deploy

Push to GitHub and Vercel auto-deploys.

### 4. Add suppliers

Sign in with an admin email, go to `/admin/suppliers/new`, fill in the form. Tick "Publish immediately" if you want it visible right away, or leave unticked to save as draft for review.

## Adding suppliers: a workflow that scales

For each supplier:

1. Research their website, identify HQ, locations served, part categories, OEM coverage
2. Write a 1-2 sentence "services summary" (shown on cards)
3. Write a longer "description" (shown on the supplier page)
4. Identify which Locations, Categories, and OEMs they cover
5. Add via the admin form
6. Save as draft first, review on the public page (use direct URL like `/supplier/[slug]?preview=true`), then publish

## How SEO works

Every directory page has:

- Unique `<title>` and meta description
- OpenGraph tags for social sharing
- Schema.org structured data (Google rich results)
- Canonical URL
- Listed in sitemap.xml automatically

Combination pages (location × category, OEM × location) are the real SEO value, they target queries like "MAN B&W parts Singapore" that competing sites don't rank for well.

When you have 50+ suppliers, add a "Directory" link to the main navigation. Until then, the directory exists at the URLs above but isn't promoted, Google can find them via sitemap.

## What's not built yet

- Individual supplier detail pages (`/supplier/[slug]`) — currently we link to them from cards, but the page doesn't exist yet. Build this in Slice 4b.
- Edit existing suppliers (currently you can only add new ones)
- Delete suppliers
- Search within the directory
- Featured/sponsored placement (Slice 5: marketplace tier)
- Supplier reviews (Slice 5)

These are deliberate omissions, the foundation supports adding all of them without schema changes.

## Strategic positioning

The public directory is **editorial**, free, no transactions. The future marketplace (Slice 5) is **transactional**, paid, with RFQ workflow, ratings, and verified badges.

Suppliers will appear on the public directory at BASIC tier. They can upgrade to ENHANCED or PREMIUM tiers (paid) for marketplace features. The data model supports this, just need to build the marketplace UI when ready.

Don't position this as "we list everyone." Position as "we curate the best." That's the editorial line we hold to keep marketplace upgrade incentive alive.
