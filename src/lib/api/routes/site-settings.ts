import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { mergeSiteSettingsPayload } from "@/lib/site-settings-merge";
import { siteSettingsPayloadSchema } from "@/lib/site-settings-schema";
import { requireAuth } from "../middleware/auth";

const siteSettings = new Hono();

siteSettings.get("/", async (c) => {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  let stored: unknown = {};
  if (row?.payload) {
    try {
      stored = JSON.parse(row.payload) as unknown;
    } catch {
      stored = {};
    }
  }
  const data = mergeSiteSettingsPayload(stored);
  return c.json({ data });
});

siteSettings.put("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  const raw =
    body && typeof body === "object" && "data" in body ? (body as { data: unknown }).data : body;

  const parsed = siteSettingsPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "Invalid payload", issues: parsed.error.flatten() }, 400);
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", payload: JSON.stringify(parsed.data) },
    update: { payload: JSON.stringify(parsed.data) },
  });

  revalidateTag(CACHE_TAGS.siteSettings, "max");
  return c.json({ data: parsed.data });
});

export { siteSettings as siteSettingsRoutes };
