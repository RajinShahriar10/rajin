-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN "category" TEXT;
ALTER TABLE "Achievement" ADD COLUMN "imageAlt" TEXT;
ALTER TABLE "Achievement" ADD COLUMN "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Research" ADD COLUMN "authorPosition" TEXT;
ALTER TABLE "Research" ADD COLUMN "conference" TEXT;
ALTER TABLE "Research" ADD COLUMN "institution" TEXT;

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "Achievement"("category");
