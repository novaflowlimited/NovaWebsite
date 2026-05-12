import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";
import type { StoryCategory } from "@prisma/client";

const impact = new Hono();

impact.get("/stats", async (c) => {
  const stats = await prisma.impactStat.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ data: stats });
});

impact.get("/map-feature/admin", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.mapFeaturedCounty.findFirst({ orderBy: { updatedAt: "desc" } });
  return c.json({ data: row });
});

impact.get("/map-feature", async (c) => {
  const row = await prisma.mapFeaturedCounty.findFirst({ orderBy: { updatedAt: "desc" } });
  return c.json({ data: row });
});

impact.put("/map-feature", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    countyName: string;
    statusLabel?: string;
    description: string;
    schoolsCount?: number;
    dispensariesCount?: number;
    communityHotspots?: number;
  }>();
  const data = {
    countyName: body.countyName.trim(),
    statusLabel: (body.statusLabel ?? "Connected").trim() || "Connected",
    description: body.description.trim(),
    schoolsCount: Math.max(0, Math.floor(Number(body.schoolsCount ?? 0))),
    dispensariesCount: Math.max(0, Math.floor(Number(body.dispensariesCount ?? 0))),
    communityHotspots: Math.max(0, Math.floor(Number(body.communityHotspots ?? 0))),
  };
  const existing = await prisma.mapFeaturedCounty.findFirst();
  const row = existing
    ? await prisma.mapFeaturedCounty.update({ where: { id: existing.id }, data })
    : await prisma.mapFeaturedCounty.create({ data });
  revalidateTag(CACHE_TAGS.impactMapFeature, "max");
  return c.json({ data: row });
});

impact.get("/stories", async (c) => {
  const categoryParam = c.req.query("category");
  const where = {
    published: true,
    ...(categoryParam && categoryParam !== "ALL"
      ? { category: categoryParam as StoryCategory }
      : {}),
  };
  const stories = await prisma.communityStory.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: stories });
});

impact.get("/stories/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.communityStory.findMany({ orderBy: { updatedAt: "desc" } });
  return c.json({ data: rows });
});

impact.get("/stories/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.communityStory.findUnique({ where: { id: c.req.param("id") } });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ data: row });
});

impact.get("/stories/:slug", async (c) => {
  const story = await prisma.communityStory.findFirst({
    where: { slug: c.req.param("slug"), published: true },
  });
  if (!story) return c.json({ error: "Not found" }, 404);
  return c.json({ data: story });
});

impact.post("/stats", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{ label: string; value: number; icon?: string; sortOrder?: number }>();
  const row = await prisma.impactStat.create({
    data: {
      label: body.label,
      value: body.value,
      icon: body.icon ?? "activity",
      sortOrder: body.sortOrder ?? 0,
    },
  });
  revalidateTag(CACHE_TAGS.impactStats, "max");
  return c.json({ data: row });
});

impact.put("/stats/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<Partial<{ label: string; value: number; icon: string; sortOrder: number }>>();
  const row = await prisma.impactStat.update({
    where: { id: c.req.param("id") },
    data: body,
  });
  revalidateTag(CACHE_TAGS.impactStats, "max");
  return c.json({ data: row });
});

impact.delete("/stats/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.impactStat.delete({ where: { id: c.req.param("id") } });
  revalidateTag(CACHE_TAGS.impactStats, "max");
  return c.json({ success: true });
});

impact.post("/stories", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    title: string;
    slug?: string;
    location: string;
    county: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    category: StoryCategory;
    beneficiary: string;
    published?: boolean;
  }>();
  const slug =
    body.slug ??
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const row = await prisma.communityStory.create({
    data: {
      title: body.title,
      slug,
      location: body.location,
      county: body.county,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage ?? null,
      category: body.category,
      beneficiary: body.beneficiary,
      published: body.published ?? true,
    },
  });
  revalidateTag(CACHE_TAGS.impactStories, "max");
  return c.json({ data: row });
});

impact.put("/stories/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<
    Partial<{
      title: string;
      slug: string;
      location: string;
      county: string;
      excerpt: string;
      content: string;
      coverImage: string | null;
      category: StoryCategory;
      beneficiary: string;
      published: boolean;
    }>
  >();
  const row = await prisma.communityStory.update({
    where: { id: c.req.param("id") },
    data: body,
  });
  revalidateTag(CACHE_TAGS.impactStories, "max");
  return c.json({ data: row });
});

impact.delete("/stories/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.communityStory.delete({ where: { id: c.req.param("id") } });
  revalidateTag(CACHE_TAGS.impactStories, "max");
  return c.json({ success: true });
});

export { impact as impactRoutes };
