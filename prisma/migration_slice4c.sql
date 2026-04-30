-- ============================================================================
-- EngineRoom Network: Slice 4c (Content System) — Schema Migration
-- ============================================================================
-- Run this AFTER previous migrations.
-- Adds Article table for AI-assisted content queue and public blog.

-- ─── Enums ─────────────────────────────────────────────────────────────────

CREATE TYPE "ContentType" AS ENUM (
  'ARTICLE',
  'COMMENTARY',
  'LINKEDIN',
  'EMAIL'
);

CREATE TYPE "ContentStatus" AS ENUM (
  'DRAFT',
  'APPROVED',
  'PUBLISHED',
  'REJECTED'
);

-- ─── Article ───────────────────────────────────────────────────────────────

CREATE TABLE "Article" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "type" "ContentType" NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "seoKeyword" TEXT,
  "sourceTitle" TEXT,
  "sourceUrl" TEXT,
  "sourceName" TEXT,
  "authorName" TEXT,
  "generatedByAI" BOOLEAN NOT NULL DEFAULT false,
  "reviewedBy" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT '{}',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Article_slug_idx" ON "Article"("slug");
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE INDEX "Article_type_idx" ON "Article"("type");
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");
