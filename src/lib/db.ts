import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Generated client must include this delegate (e.g. after `prisma generate` added `SiteSettings`). */
function hasSiteSettingsDelegate(client: PrismaClient | undefined): boolean {
  if (client == null) return false;
  const d = (client as unknown as { siteSettings?: { findUnique?: unknown } }).siteSettings;
  return typeof d?.findUnique === "function";
}

function getPrisma(): PrismaClient {
  const cur = globalForPrisma.prisma;
  // Replace singleton if it predates the current schema (missing `siteSettings` or broken delegate).
  if (!hasSiteSettingsDelegate(cur)) {
    if (cur) void cur.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }
  globalForPrisma.prisma ??= createPrisma();
  return globalForPrisma.prisma;
}

export const prisma = getPrisma();
