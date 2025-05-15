-- Drop totalMarks field and add clbScore field
ALTER TABLE "Test" DROP COLUMN IF EXISTS "totalMarks";
ALTER TABLE "Test" ADD COLUMN IF NOT EXISTS "clbScore" INTEGER NOT NULL DEFAULT 1;

-- Update existing test records to have a default CLB score
UPDATE "Test" SET "clbScore" = 1 WHERE "clbScore" IS NULL;

-- Change Question.paragraphs to JSONB type
ALTER TABLE "Question" DROP COLUMN IF EXISTS "paragraphs";
ALTER TABLE "Question" ADD COLUMN "paragraphs" JSONB; 