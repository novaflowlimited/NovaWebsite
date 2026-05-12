import type { LogoStripKind } from "@prisma/client";
import { Hono } from "hono";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";

const logos = new Hono();

function parseStripQuery(raw: string | undefined): LogoStripKind {
  return raw === "SOFTWARE_CUSTOMERS" ? "SOFTWARE_CUSTOMERS" : "TRUSTED_BY";
}

logos.get("/", async (c) => {
  const stripKind = parseStripQuery(c.req.query("strip"));
  const rows = await prisma.clientLogo.findMany({
    where: { stripKind },
    orderBy: { sortOrder: "asc" },
  });
  return c.json({ data: rows });
});

logos.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const stripKind = parseStripQuery(c.req.query("strip"));
  const rows = await prisma.clientLogo.findMany({
    where: { stripKind },
    orderBy: { sortOrder: "asc" },
  });
  return c.json({ data: rows });
});

logos.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    name: string;
    logoUrl: string;
    sortOrder?: number;
    stripKind?: LogoStripKind;
  }>();
  const stripKind = body.stripKind === "SOFTWARE_CUSTOMERS" ? "SOFTWARE_CUSTOMERS" : "TRUSTED_BY";
  const row = await prisma.clientLogo.create({
    data: {
      name: body.name,
      logoUrl: body.logoUrl,
      sortOrder: body.sortOrder ?? 0,
      stripKind,
    },
  });
  return c.json({ data: row });
});

logos.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<
    Partial<{ name: string; logoUrl: string; sortOrder: number; stripKind: LogoStripKind }>
  >();
  const data = { ...body };
  if (data.stripKind != null && data.stripKind !== "TRUSTED_BY" && data.stripKind !== "SOFTWARE_CUSTOMERS") {
    delete data.stripKind;
  }
  const row = await prisma.clientLogo.update({
    where: { id: c.req.param("id") },
    data,
  });
  return c.json({ data: row });
});

logos.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.clientLogo.delete({ where: { id: c.req.param("id") } });
  return c.json({ success: true });
});

export { logos as clientLogosRoutes };
