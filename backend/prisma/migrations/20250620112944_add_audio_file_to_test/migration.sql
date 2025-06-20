/*
  Warnings:

  - You are about to drop the column `audioFile` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" ADD COLUMN "audioFile" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionImage" TEXT,
    "additionalInfo" TEXT,
    "order" INTEGER NOT NULL,
    "marks" REAL NOT NULL DEFAULT 1.0,
    "options" JSONB,
    "correctAnswer" TEXT,
    "bandDescriptors" JSONB,
    "cueCard" TEXT,
    "passage" TEXT,
    "summaryWords" JSONB,
    "summaryBlankAnswers" JSONB,
    "fillBlankSentence" TEXT,
    "completeSentenceAnswers" JSONB,
    "tableData" JSONB,
    "headings" JSONB,
    "correctHeadings" JSONB,
    "fillBlankAnswers" JSONB,
    "sentenceBeginnings" JSONB,
    "sentenceEndings" JSONB,
    "correctEndings" JSONB,
    "diagramImage" TEXT,
    "diagramAnswers" JSONB,
    "wordLimit" TEXT,
    "sampleAnswer" TEXT,
    "speakingPrompts" JSONB,
    "paragraphs" JSONB,
    "sentences" JSONB,
    "csentences" JSONB,
    "followUpQuestions" TEXT,
    "matchingPairs" TEXT,
    "mapLabels" TEXT,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("additionalInfo", "bandDescriptors", "completeSentenceAnswers", "correctAnswer", "correctEndings", "correctHeadings", "csentences", "cueCard", "diagramAnswers", "diagramImage", "fillBlankAnswers", "fillBlankSentence", "followUpQuestions", "headings", "id", "mapLabels", "marks", "matchingPairs", "options", "order", "paragraphs", "passage", "questionImage", "questionText", "questionType", "sampleAnswer", "sectionId", "sentenceBeginnings", "sentenceEndings", "sentences", "speakingPrompts", "summaryBlankAnswers", "summaryWords", "tableData", "wordLimit") SELECT "additionalInfo", "bandDescriptors", "completeSentenceAnswers", "correctAnswer", "correctEndings", "correctHeadings", "csentences", "cueCard", "diagramAnswers", "diagramImage", "fillBlankAnswers", "fillBlankSentence", "followUpQuestions", "headings", "id", "mapLabels", "marks", "matchingPairs", "options", "order", "paragraphs", "passage", "questionImage", "questionText", "questionType", "sampleAnswer", "sectionId", "sentenceBeginnings", "sentenceEndings", "sentences", "speakingPrompts", "summaryBlankAnswers", "summaryWords", "tableData", "wordLimit" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
