/*
  Warnings:

  - The values [SPEAKING_SHORT_ANSWER,SPEAKING_LONG_ANSWER,SPEAKING_CUE_CARD,SPEAKING_DISCUSSION] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ModuleType" ADD VALUE 'IELTS_GENERAL';
ALTER TYPE "ModuleType" ADD VALUE 'IELTS_ACADEMIC';
ALTER TYPE "ModuleType" ADD VALUE 'COMBINED';

-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER', 'ESSAY', 'MATCHING', 'GAP_FILLING', 'NOTE_COMPLETION', 'FLOW_CHART', 'TABLE_COMPLETION', 'DIAGRAM_LABELLING', 'SUMMARY_COMPLETION', 'SENTENCE_COMPLETION', 'MAP_LABELLING', 'PROCESS_DIAGRAM', 'YES_NO_NOT_GIVEN', 'TRUE_FALSE_NOT_GIVEN', 'HEADING_MATCHING', 'INFORMATION_MATCHING', 'FEATURES_MATCHING', 'SPEAKING_TASK_1', 'SPEAKING_TASK_2', 'SPEAKING_TASK_3');
ALTER TABLE "Question" ALTER COLUMN "questionType" TYPE "QuestionType_new" USING ("questionType"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "bandDescriptors" JSONB,
ADD COLUMN     "cueCard" TEXT,
ADD COLUMN     "passage" TEXT,
ADD COLUMN     "sampleAnswer" TEXT,
ADD COLUMN     "speakingPrompts" JSONB;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "testCategory" TEXT;
