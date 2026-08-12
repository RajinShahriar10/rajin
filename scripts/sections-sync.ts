/**
 * Idempotent dev utility: registers every homepage section in SectionSetting
 * and canonicalizes the section order so admins can reorder/hide each one.
 * Existing visibility is preserved; orders are reset to the canonical list
 * (run before the site goes live, or any time you want to restore defaults).
 *
 * Run: npx tsx scripts/sections-sync.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECTION_ORDER = [
  "hero",
  "projects",
  "marquee",
  "about",
  "skills",
  "experience",
  "education",
  "research",
  "certificates",
  "achievements",
  "contact",
] as const;

const label = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

async function main() {
  const existing = await prisma.sectionSetting.findMany({
    select: { key: true },
  });
  const known = new Set(existing.map((s) => s.key));

  for (const [order, key] of SECTION_ORDER.entries()) {
    if (known.has(key)) {
      await prisma.sectionSetting.update({
        where: { key },
        data: { label: label(key), order },
      });
    } else {
      await prisma.sectionSetting.create({
        data: { key, label: label(key), visible: true, order },
      });
      console.log(`+ ${key}`);
    }
  }

  console.log("Sections synced.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
