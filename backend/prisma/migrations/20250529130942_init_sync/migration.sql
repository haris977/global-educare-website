-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctEndings" JSONB,
ADD COLUMN     "correctHeadings" JSONB,
ADD COLUMN     "diagramAnswers" JSONB,
ADD COLUMN     "diagramImage" TEXT,
ADD COLUMN     "fillBlankAnswers" JSONB,
ADD COLUMN     "headings" JSONB,
ADD COLUMN     "mapLabels" TEXT,
ADD COLUMN     "sentenceBeginnings" JSONB,
ADD COLUMN     "sentenceEndings" JSONB,
ADD COLUMN     "wordLimit" TEXT;
