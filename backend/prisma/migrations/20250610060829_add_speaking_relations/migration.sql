-- CreateTable
CREATE TABLE "part1_responses" (
    "id" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "band" TEXT,
    "feedback" TEXT,

    CONSTRAINT "part1_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part1_questions" (
    "id" TEXT NOT NULL,
    "part1ResponseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "askedAt" TIMESTAMP(3) NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,

    CONSTRAINT "part1_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part2_responses" (
    "id" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "topicCard" JSONB NOT NULL,
    "preparationStart" TIMESTAMP(3) NOT NULL,
    "preparationEnd" TIMESTAMP(3),
    "speakingStart" TIMESTAMP(3),
    "speakingEnd" TIMESTAMP(3),
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "band" TEXT,
    "feedback" TEXT,
    "notes" TEXT,

    CONSTRAINT "part2_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part2_followup" (
    "id" TEXT NOT NULL,
    "part2ResponseId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "askedAt" TIMESTAMP(3) NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,

    CONSTRAINT "part2_followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part3_responses" (
    "id" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "band" TEXT,
    "feedback" TEXT,

    CONSTRAINT "part3_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part3_questions" (
    "id" TEXT NOT NULL,
    "part3ResponseId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "askedAt" TIMESTAMP(3) NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,

    CONSTRAINT "part3_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part1_question_bank" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "part1_question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part2_topic_bank" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "part2_topic_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part3_question_bank" (
    "id" TEXT NOT NULL,
    "topicArea" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "part3_question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "part1_responses_testAttemptId_key" ON "part1_responses"("testAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "part2_responses_testAttemptId_key" ON "part2_responses"("testAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "part3_responses_testAttemptId_key" ON "part3_responses"("testAttemptId");

-- AddForeignKey
ALTER TABLE "part1_responses" ADD CONSTRAINT "part1_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part1_questions" ADD CONSTRAINT "part1_questions_part1ResponseId_fkey" FOREIGN KEY ("part1ResponseId") REFERENCES "part1_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part2_responses" ADD CONSTRAINT "part2_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part2_followup" ADD CONSTRAINT "part2_followup_part2ResponseId_fkey" FOREIGN KEY ("part2ResponseId") REFERENCES "part2_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part3_responses" ADD CONSTRAINT "part3_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part3_questions" ADD CONSTRAINT "part3_questions_part3ResponseId_fkey" FOREIGN KEY ("part3ResponseId") REFERENCES "part3_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
