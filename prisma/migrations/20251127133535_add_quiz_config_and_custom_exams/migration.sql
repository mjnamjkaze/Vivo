-- AlterTable
ALTER TABLE "QuizSession" ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "QuizSession" ADD COLUMN "ipAddress" TEXT;

-- CreateTable
CREATE TABLE "QuizConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionCount" INTEGER NOT NULL DEFAULT 20,
    "basicPercentage" INTEGER NOT NULL DEFAULT 60,
    "advancedPercentage" INTEGER NOT NULL DEFAULT 30,
    "masteryPercentage" INTEGER NOT NULL DEFAULT 10,
    "homepageMode" TEXT NOT NULL DEFAULT 'categories',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CustomExam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "questionCount" INTEGER NOT NULL DEFAULT 20,
    "basicPercentage" INTEGER NOT NULL DEFAULT 60,
    "advancedPercentage" INTEGER NOT NULL DEFAULT 30,
    "masteryPercentage" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomExam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
