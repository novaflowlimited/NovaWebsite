import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";
import type { JobType } from "@prisma/client";

const jobs = new Hono();

function parseList(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

jobs.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.job.findMany({ orderBy: { updatedAt: "desc" } });
  return c.json({
    data: rows.map((j) => ({
      ...j,
      requirements: parseList(j.requirements),
      benefits: parseList(j.benefits),
    })),
  });
});

jobs.get("/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.job.findUnique({ where: { id: c.req.param("id") } });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({
    data: {
      ...row,
      requirements: parseList(row.requirements),
      benefits: parseList(row.benefits),
    },
  });
});

jobs.get("/", async (c) => {
  const rows = await prisma.job.findMany({
    where: { published: true },
    orderBy: { closingDate: "asc" },
  });
  return c.json({
    data: rows.map((j) => ({
      ...j,
      requirements: parseList(j.requirements),
      benefits: parseList(j.benefits),
    })),
  });
});

jobs.get("/:slug", async (c) => {
  const row = await prisma.job.findFirst({
    where: { slug: c.req.param("slug"), published: true },
  });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({
    data: {
      ...row,
      requirements: parseList(row.requirements),
      benefits: parseList(row.benefits),
    },
  });
});

jobs.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    title: string;
    slug?: string;
    department: string;
    location: string;
    type: JobType;
    experience?: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    salary?: string | null;
    published?: boolean;
    closingDate?: string | null;
  }>();
  const slug =
    body.slug ??
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const row = await prisma.job.create({
    data: {
      title: body.title,
      slug,
      department: body.department,
      location: body.location,
      type: body.type,
      experience: body.experience ?? "",
      description: body.description,
      requirements: JSON.stringify(body.requirements ?? []),
      benefits: JSON.stringify(body.benefits ?? []),
      salary: body.salary ?? null,
      published: body.published ?? true,
      closingDate: body.closingDate ? new Date(body.closingDate) : null,
    },
  });
  revalidateTag(CACHE_TAGS.jobs, "max");
  return c.json({
    data: {
      ...row,
      requirements: parseList(row.requirements),
      benefits: parseList(row.benefits),
    },
  });
});

jobs.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<
    Partial<{
      title: string;
      slug: string;
      department: string;
      location: string;
      type: JobType;
      experience: string;
      description: string;
      requirements: string[];
      benefits: string[];
      salary: string | null;
      published: boolean;
      closingDate: string | null;
    }>
  >();
  const row = await prisma.job.update({
    where: { id: c.req.param("id") },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.department !== undefined ? { department: body.department } : {}),
      ...(body.location !== undefined ? { location: body.location } : {}),
      ...(body.type !== undefined ? { type: body.type } : {}),
      ...(body.experience !== undefined ? { experience: body.experience } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.requirements !== undefined ? { requirements: JSON.stringify(body.requirements) } : {}),
      ...(body.benefits !== undefined ? { benefits: JSON.stringify(body.benefits) } : {}),
      ...(body.salary !== undefined ? { salary: body.salary } : {}),
      ...(body.published !== undefined ? { published: body.published } : {}),
      ...(body.closingDate !== undefined
        ? { closingDate: body.closingDate ? new Date(body.closingDate) : null }
        : {}),
    },
  });
  revalidateTag(CACHE_TAGS.jobs, "max");
  return c.json({
    data: {
      ...row,
      requirements: parseList(row.requirements),
      benefits: parseList(row.benefits),
    },
  });
});

jobs.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.job.delete({ where: { id: c.req.param("id") } });
  revalidateTag(CACHE_TAGS.jobs, "max");
  return c.json({ success: true });
});

export { jobs as jobsRoutes };
