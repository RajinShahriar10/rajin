-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactMessage" ("createdAt", "email", "id", "message", "name", "read", "subject", "updatedAt") SELECT "createdAt", "email", "id", "message", "name", "read", "subject", "updatedAt" FROM "ContactMessage";
DROP TABLE "ContactMessage";
ALTER TABLE "new_ContactMessage" RENAME TO "ContactMessage";
CREATE INDEX "ContactMessage_read_idx" ON "ContactMessage"("read");
CREATE INDEX "ContactMessage_archived_idx" ON "ContactMessage"("archived");
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
