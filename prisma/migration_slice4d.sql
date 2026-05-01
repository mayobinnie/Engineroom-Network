-- ============================================================================
-- EngineRoom Network: Slice 4d (Comments) — Schema Migration
-- ============================================================================

-- 1. Add commentsBanned flag to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "commentsBanned" BOOLEAN NOT NULL DEFAULT false;

-- 2. Comment target type enum
CREATE TYPE "CommentTargetType" AS ENUM (
  'ARTICLE',
  'VESSEL_CLASS'
);

-- 3. Comment table
CREATE TABLE "Comment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "targetType" "CommentTargetType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "authorUserId" TEXT NOT NULL,
  "parentCommentId" TEXT,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "hiddenAt" TIMESTAMP(3),
  "hiddenBy" TEXT,
  "isPinned" BOOLEAN NOT NULL DEFAULT false,
  "isReported" BOOLEAN NOT NULL DEFAULT false,
  "reportCount" INTEGER NOT NULL DEFAULT 0,
  "isEdited" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Comment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE
);

CREATE INDEX "Comment_targetType_targetId_idx" ON "Comment"("targetType", "targetId");
CREATE INDEX "Comment_authorUserId_idx" ON "Comment"("authorUserId");
CREATE INDEX "Comment_parentCommentId_idx" ON "Comment"("parentCommentId");
CREATE INDEX "Comment_isHidden_idx" ON "Comment"("isHidden");
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");
