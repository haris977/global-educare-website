/*
  Warnings:

  - You are about to drop the column `audioFile` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN "audioFile" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
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
INSERT INTO "new_Test" ("clbScore", "createdAt", "description", "difficulty", "id", "isFeatured", "isPublished", "moduleType", "testCategory", "title", "totalQuestions", "totalTime", "updatedAt") SELECT "clbScore", "createdAt", "description", "difficulty", "id", "isFeatured", "isPublished", "moduleType", "testCategory", "title", "totalQuestions", "totalTime", "updatedAt" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
