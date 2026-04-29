-- ============================================================================
-- EngineRoom Network: Slice 4a (Supplier Directory) — Schema Migration
-- ============================================================================
-- Run this in Supabase SQL Editor BEFORE deploying the new code.
-- This adds Supplier, Location, PartCategory, OEM, and join tables.
-- The User, Profile, and WaitlistSignup tables from Slice 1 remain untouched.

-- ─── Enums ──────────────────────────────────────────────────────────────────

CREATE TYPE "SupplierTier" AS ENUM ('BASIC', 'ENHANCED', 'PREMIUM');
CREATE TYPE "Region" AS ENUM ('EUROPE', 'ASIA_PACIFIC', 'MIDDLE_EAST', 'AFRICA', 'NORTH_AMERICA', 'SOUTH_AMERICA', 'OCEANIA');

-- ─── Supplier ───────────────────────────────────────────────────────────────

CREATE TABLE "Supplier" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "website" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "founded" INTEGER,
  "headquarters" TEXT,
  "servicesSummary" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "tier" "SupplierTier" NOT NULL DEFAULT 'BASIC',
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Supplier_slug_idx" ON "Supplier"("slug");
CREATE INDEX "Supplier_isPublished_idx" ON "Supplier"("isPublished");
CREATE INDEX "Supplier_tier_idx" ON "Supplier"("tier");

-- ─── Location ───────────────────────────────────────────────────────────────

CREATE TABLE "Location" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "region" "Region" NOT NULL,
  "description" TEXT,
  "isMajorHub" BOOLEAN NOT NULL DEFAULT false,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Location_slug_idx" ON "Location"("slug");
CREATE INDEX "Location_region_idx" ON "Location"("region");

-- ─── PartCategory ───────────────────────────────────────────────────────────

CREATE TABLE "PartCategory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "parentId" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("parentId") REFERENCES "PartCategory"("id") ON DELETE SET NULL
);

CREATE INDEX "PartCategory_slug_idx" ON "PartCategory"("slug");
CREATE INDEX "PartCategory_parentId_idx" ON "PartCategory"("parentId");

-- ─── OEM ────────────────────────────────────────────────────────────────────

CREATE TABLE "OEM" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "founded" INTEGER,
  "headquarters" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "OEM_slug_idx" ON "OEM"("slug");

-- ─── Join Tables ────────────────────────────────────────────────────────────

CREATE TABLE "SupplierLocation" (
  "supplierId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY ("supplierId", "locationId"),
  FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE,
  FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE
);
CREATE INDEX "SupplierLocation_locationId_idx" ON "SupplierLocation"("locationId");

CREATE TABLE "SupplierCategory" (
  "supplierId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  PRIMARY KEY ("supplierId", "categoryId"),
  FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE,
  FOREIGN KEY ("categoryId") REFERENCES "PartCategory"("id") ON DELETE CASCADE
);
CREATE INDEX "SupplierCategory_categoryId_idx" ON "SupplierCategory"("categoryId");

CREATE TABLE "SupplierOEM" (
  "supplierId" TEXT NOT NULL,
  "oemId" TEXT NOT NULL,
  PRIMARY KEY ("supplierId", "oemId"),
  FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE,
  FOREIGN KEY ("oemId") REFERENCES "OEM"("id") ON DELETE CASCADE
);
CREATE INDEX "SupplierOEM_oemId_idx" ON "SupplierOEM"("oemId");

-- ============================================================================
-- Migration complete. Next: run `npm run db:seed` locally to populate
-- locations, categories, and OEMs (no suppliers yet).
-- ============================================================================
