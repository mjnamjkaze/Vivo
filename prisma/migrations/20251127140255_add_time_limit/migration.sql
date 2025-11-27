-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomExam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "questionCount" INTEGER NOT NULL DEFAULT 20,
    "basicPercentage" INTEGER NOT NULL DEFAULT 60,
    "advancedPercentage" INTEGER NOT NULL DEFAULT 30,
    "masteryPercentage" INTEGER NOT NULL DEFAULT 10,
    "timeLimit" INTEGER NOT NULL DEFAULT 600,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomExam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CustomExam" ("advancedPercentage", "basicPercentage", "categoryId", "createdAt", "description", "id", "isActive", "masteryPercentage", "name", "questionCount", "updatedAt") SELECT "advancedPercentage", "basicPercentage", "categoryId", "createdAt", "description", "id", "isActive", "masteryPercentage", "name", "questionCount", "updatedAt" FROM "CustomExam";
DROP TABLE "CustomExam";
ALTER TABLE "new_CustomExam" RENAME TO "CustomExam";
CREATE TABLE "new_QuizConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionCount" INTEGER NOT NULL DEFAULT 20,
    "basicPercentage" INTEGER NOT NULL DEFAULT 60,
    "advancedPercentage" INTEGER NOT NULL DEFAULT 30,
    "masteryPercentage" INTEGER NOT NULL DEFAULT 10,
    "timeLimit" INTEGER NOT NULL DEFAULT 600,
    "homepageMode" TEXT NOT NULL DEFAULT 'categories',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_QuizConfig" ("advancedPercentage", "basicPercentage", "createdAt", "homepageMode", "id", "masteryPercentage", "questionCount", "updatedAt") SELECT "advancedPercentage", "basicPercentage", "createdAt", "homepageMode", "id", "masteryPercentage", "questionCount", "updatedAt" FROM "QuizConfig";
DROP TABLE "QuizConfig";
ALTER TABLE "new_QuizConfig" RENAME TO "QuizConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
