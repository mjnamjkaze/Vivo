-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("createdAt", "id", "isCorrect", "questionId", "sessionId", "userAnswer") SELECT "createdAt", "id", "isCorrect", "questionId", "sessionId", "userAnswer" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "questionImageUrl" TEXT,
    "optionA" TEXT NOT NULL,
    "optionAImageUrl" TEXT,
    "optionB" TEXT NOT NULL,
    "optionBImageUrl" TEXT,
    "optionC" TEXT NOT NULL,
    "optionCImageUrl" TEXT,
    "optionD" TEXT NOT NULL,
    "optionDImageUrl" TEXT,
    "correctAnswer" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'Cơ Bản',
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("categoryId", "correctAnswer", "createdAt", "id", "optionA", "optionAImageUrl", "optionB", "optionBImageUrl", "optionC", "optionCImageUrl", "optionD", "optionDImageUrl", "question", "questionImageUrl") SELECT "categoryId", "correctAnswer", "createdAt", "id", "optionA", "optionAImageUrl", "optionB", "optionBImageUrl", "optionC", "optionCImageUrl", "optionD", "optionDImageUrl", "question", "questionImageUrl" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
