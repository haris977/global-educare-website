-- Add the missing sentences column to the Question table
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "sentences" TEXT;

-- Add missing columns for other specific question types
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "followUpQuestions" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "matchingPairs" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "paragraphs" JSONB; 