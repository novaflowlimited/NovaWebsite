import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";

const team = new Hono();

team.get("/", async (c) => {
  const rows = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ data: rows });
});

team.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ data: rows });
});

team.get("/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.teamMember.findUnique({ where: { id: c.req.param("id") } });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ data: row });
});

team.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    name: string;
    role: string;
    bio: string;
    photo?: string | null;
    email?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    sortOrder?: number;
  }>();
  const row = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio,
      photo: body.photo ?? null,
      email: body.email ?? null,
      linkedin: body.linkedin ?? null,
      twitter: body.twitter ?? null,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  revalidateTag(CACHE_TAGS.team, "max");
  return c.json({ data: row });
});

team.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<
    Partial<{
      name: string;
      role: string;
      bio: string;
      photo: string | null;
      email: string | null;
      linkedin: string | null;
      twitter: string | null;
      sortOrder: number;
    }>
  >();
  const row = await prisma.teamMember.update({
    where: { id: c.req.param("id") },
    data: body,
  });
  revalidateTag(CACHE_TAGS.team, "max");
  return c.json({ data: row });
});

team.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.teamMember.delete({ where: { id: c.req.param("id") } });
  revalidateTag(CACHE_TAGS.team, "max");
  return c.json({ success: true });
});

export { team as teamRoutes };
