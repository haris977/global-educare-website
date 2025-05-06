-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER', 'ESSAY', 'MATCHING', 'GAP_FILLING', 'NOTE_COMPLETION', 'FLOW_CHART', 'TABLE_COMPLETION', 'DIAGRAM_LABELLING', 'SUMMARY_COMPLETION', 'SENTENCE_COMPLETION', 'SPEAKING_SHORT_ANSWER', 'SPEAKING_LONG_ANSWER', 'SPEAKING_CUE_CARD', 'SPEAKING_DISCUSSION');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'EXPIRED', 'EVALUATED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'REVIEWED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "TestDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD');

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "TestDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "moduleType" "ModuleType" NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "order" INTEGER NOT NULL,
    "timeLimit" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "questionImage" TEXT,
    "audioFile" TEXT,
    "additionalInfo" TEXT,
    "order" INTEGER NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "options" JSONB,
    "correctAnswer" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastSavedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScore" DOUBLE PRECISION,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "currentSection" INTEGER NOT NULL DEFAULT 0,
    "timeRemaining" INTEGER,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT,
    "audioRecording" TEXT,
    "isCorrect" BOOLEAN,
    "marksAwarded" DOUBLE PRECISION,
    "feedback" TEXT,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
