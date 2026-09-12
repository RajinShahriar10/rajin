import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Neon's pooled endpoint (`-pooler`) funnels all clients through PgBouncer,
 * so during static-generation bursts any slow read can blow past Prisma's
 * default 10s pool-checkout timeout. Give the pool more time to acquire a
 * connection instead of failing the whole build.
 */
function buildDatasourceUrl(): string | undefined {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return undefined;
  const url = new URL(raw.replace(/^"+|"+$/g, ""));
  if (!url.searchParams.has("pool_timeout")) {
    url.searchParams.set("pool_timeout", "60");
  }
  return url.toString();
}

const datasourceUrl = buildDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;