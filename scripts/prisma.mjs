import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function loadDotEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env"), "utf8");
    const vars = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        value.startsWith('"') &&
        value.endsWith('"') &&
        value.length >= 2
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
    return vars;
  } catch {
    return {};
  }
}

const dotEnv = loadDotEnv();
const databaseUrl =
  process.env.DATABASE_URL ?? dotEnv.DATABASE_URL ?? "";
const isPostgres = databaseUrl.startsWith("postgresql");
const schema = isPostgres
  ? "prisma/schema.postgres.prisma"
  : "prisma/schema.prisma";

const prismaCli = resolve(root, "node_modules", "prisma", "build", "index.js");
const args = process.argv.slice(2);

const result = spawnSync(
  process.execPath,
  [prismaCli, ...args, "--schema", schema],
  { cwd: root, stdio: "inherit" },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
