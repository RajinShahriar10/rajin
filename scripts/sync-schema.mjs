import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const canonical = resolve(root, "prisma", "schema.prisma");
const postgres = resolve(root, "prisma", "schema.postgres.prisma");

const schema = readFileSync(canonical, "utf8");
const sqliteProvider = /provider\s*=\s*"sqlite"/;
if (!sqliteProvider.test(schema)) {
  console.error("schema.prisma does not contain a sqlite provider. Aborting.");
  process.exit(1);
}

const postgresSchema = schema.replace(
  /provider\s*=\s*"sqlite"/,
  'provider = "postgresql"',
);

writeFileSync(postgres, postgresSchema, "utf8");
console.log("Synced prisma/schema.postgres.prisma from prisma/schema.prisma");
