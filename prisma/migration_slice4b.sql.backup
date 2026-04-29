-- ============================================================================
-- EngineRoom Network: Slice 4b (Vessel Types) — Schema Migration
-- ============================================================================
-- Run this AFTER migration_slice4a.sql.
-- Adds VesselType table for reference guides on commercial vessel types.

-- ─── Enum ──────────────────────────────────────────────────────────────────

CREATE TYPE "VesselCategory" AS ENUM (
  'TANKER',
  'GAS_CARRIER',
  'CONTAINER',
  'BULK_CARRIER',
  'GENERAL_CARGO',
  'RO_RO',
  'PASSENGER',
  'OFFSHORE',
  'SPECIALIZED',
  'NAVAL',
  'WORKBOAT'
);

-- ─── VesselType ────────────────────────────────────────────────────────────

CREATE TABLE "VesselClass" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "shortName" TEXT NOT NULL,
  "category" "VesselCategory" NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "typicalSize" TEXT,
  "typicalCargo" TEXT,
  "propulsionNotes" TEXT,
  "auxiliaryNotes" TEXT,
  "cargoSystemNotes" TEXT,
  "commonOEMs" TEXT,
  "engineeringChallenges" TEXT,
  "sourcingNotes" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "VesselClass_slug_idx" ON "VesselClass"("slug");
CREATE INDEX "VesselClass_category_idx" ON "VesselClass"("category");
CREATE INDEX "VesselClass_isPublished_idx" ON "VesselClass"("isPublished");
