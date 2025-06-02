-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "fillBlankSentence" TEXT,
ADD COLUMN     "summaryBlankAnswers" JSONB,
ADD COLUMN     "summaryWords" JSONB;
