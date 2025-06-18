-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "profilePicture" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subscriptionStatus" TEXT DEFAULT 'INACTIVE',
    "subscriptionPlan" TEXT,
    "subscriptionStartDate" DATETIME,
    "subscriptionEndDate" DATETIME,
    "freeTrialUsed" BOOLEAN NOT NULL DEFAULT false,
    "refundRequested" BOOLEAN NOT NULL DEFAULT false,
    "refundStatus" TEXT DEFAULT 'NONE',
    "refundRequestDate" DATETIME,
    "refundProcessedDate" DATETIME,
    "lastLoginAt" DATETIME,
    "progressData" JSONB
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "moduleType" TEXT NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "testCategory" TEXT,
    "clbScore" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "order" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    CONSTRAINT "Section_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionImage" TEXT,
    "audioFile" TEXT,
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

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "lastSavedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScore" REAL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentSection" INTEGER NOT NULL DEFAULT 0,
    "timeRemaining" INTEGER,
    CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part1_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testAttemptId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "score" REAL,
    "band" TEXT,
    "feedback" TEXT,
    CONSTRAINT "part1_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part1_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "part1ResponseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "askedAt" DATETIME NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" REAL,
    "feedback" TEXT,
    CONSTRAINT "part1_questions_part1ResponseId_fkey" FOREIGN KEY ("part1ResponseId") REFERENCES "part1_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part2_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testAttemptId" TEXT NOT NULL,
    "topicCard" JSONB NOT NULL,
    "preparationStart" DATETIME NOT NULL,
    "preparationEnd" DATETIME,
    "speakingStart" DATETIME,
    "speakingEnd" DATETIME,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" REAL,
    "band" TEXT,
    "feedback" TEXT,
    "notes" TEXT,
    CONSTRAINT "part2_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part2_followup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "part2ResponseId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "askedAt" DATETIME NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" REAL,
    "feedback" TEXT,
    CONSTRAINT "part2_followup_part2ResponseId_fkey" FOREIGN KEY ("part2ResponseId") REFERENCES "part2_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part3_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testAttemptId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "score" REAL,
    "band" TEXT,
    "feedback" TEXT,
    CONSTRAINT "part3_responses_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part3_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "part3ResponseId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "askedAt" DATETIME NOT NULL,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "score" REAL,
    "feedback" TEXT,
    CONSTRAINT "part3_questions_part3ResponseId_fkey" FOREIGN KEY ("part3ResponseId") REFERENCES "part3_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "part1_question_bank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "part2_topic_bank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "part3_question_bank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicArea" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT,
    "audioRecording" TEXT,
    "isCorrect" BOOLEAN,
    "marksAwarded" REAL,
    "feedback" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Response_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "TestAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "testScore" REAL,
    "completedAt" DATETIME,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PracticeTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "moduleType" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UsersOnInstitutions" (
    "userId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "institutionId"),
    CONSTRAINT "UsersOnInstitutions_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnInstitutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "part1_responses_testAttemptId_key" ON "part1_responses"("testAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "part2_responses_testAttemptId_key" ON "part2_responses"("testAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "part3_responses_testAttemptId_key" ON "part3_responses"("testAttemptId");
