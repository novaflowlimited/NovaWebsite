import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";
import type { PricingType, ServiceCategory } from "@prisma/client";

const services = new Hono();

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

services.get("/", async (c) => {
  const rows = await prisma.service.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    include: { plans: { orderBy: { sortOrder: "asc" } } },
  });
  return c.json({
    data: rows.map((s) => ({
      ...s,
      features: parseJsonArray(s.features),
      plans: s.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    })),
  });
});

services.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.service.findMany({
    orderBy: { name: "asc" },
    include: { plans: { orderBy: { sortOrder: "asc" } } },
  });
  return c.json({
    data: rows.map((s) => ({
      ...s,
      features: parseJsonArray(s.features),
      plans: s.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    })),
  });
});

services.get("/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.service.findUnique({
    where: { id: c.req.param("id") },
    include: { plans: { orderBy: { sortOrder: "asc" } } },
  });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({
    data: {
      ...row,
      features: parseJsonArray(row.features),
      plans: row.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    },
  });
});

services.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await prisma.service.findFirst({
    where: { slug, published: true },
    include: { plans: { orderBy: { sortOrder: "asc" } } },
  });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({
    data: {
      ...row,
      features: parseJsonArray(row.features),
      plans: row.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    },
  });
});

services.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    name: string;
    slug?: string;
    tagline: string;
    description: string;
    icon?: string;
    category: ServiceCategory;
    features?: string[];
    pricingType?: PricingType;
    published?: boolean;
    plans?: Array<{
      name: string;
      priceKes: number;
      interval?: "MONTHLY" | "ANNUAL";
      features?: string[];
      isPopular?: boolean;
      sortOrder?: number;
    }>;
  }>();
  const slug =
    body.slug ??
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const created = await prisma.service.create({
    data: {
      name: body.name,
      slug,
      tagline: body.tagline,
      description: body.description,
      icon: body.icon ?? "layers",
      category: body.category,
      features: JSON.stringify(body.features ?? []),
      pricingType: body.pricingType ?? "FIXED",
      published: body.published ?? true,
      plans: body.plans?.length
        ? {
            create: body.plans.map((p, i) => ({
              name: p.name,
              priceKes: p.priceKes,
              interval: p.interval ?? "MONTHLY",
              features: JSON.stringify(p.features ?? []),
              isPopular: p.isPopular ?? false,
              sortOrder: p.sortOrder ?? i,
            })),
          }
        : undefined,
    },
    include: { plans: true },
  });
  revalidateTag(CACHE_TAGS.services, "max");
  return c.json({
    data: {
      ...created,
      features: parseJsonArray(created.features),
      plans: created.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    },
  });
});

services.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const body = await c.req.json<{
    name?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    icon?: string;
    category?: ServiceCategory;
    features?: string[];
    pricingType?: PricingType;
    published?: boolean;
    plans?: Array<{
      id?: string;
      name: string;
      priceKes: number;
      interval?: "MONTHLY" | "ANNUAL";
      features?: string[];
      isPopular?: boolean;
      sortOrder?: number;
    }>;
  }>();

  await prisma.$transaction(async (tx) => {
    await tx.service.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.tagline !== undefined ? { tagline: body.tagline } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.icon !== undefined ? { icon: body.icon } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.features !== undefined ? { features: JSON.stringify(body.features) } : {}),
        ...(body.pricingType !== undefined ? { pricingType: body.pricingType } : {}),
        ...(body.published !== undefined ? { published: body.published } : {}),
      },
    });
    if (body.plans) {
      await tx.plan.deleteMany({ where: { serviceId: id } });
      if (body.plans.length) {
        await tx.plan.createMany({
          data: body.plans.map((p, i) => ({
            serviceId: id,
            name: p.name,
            priceKes: p.priceKes,
            interval: p.interval ?? "MONTHLY",
            features: JSON.stringify(p.features ?? []),
            isPopular: p.isPopular ?? false,
            sortOrder: p.sortOrder ?? i,
          })),
        });
      }
    }
  });
  const row = await prisma.service.findUniqueOrThrow({
    where: { id },
    include: { plans: { orderBy: { sortOrder: "asc" } } },
  });
  revalidateTag(CACHE_TAGS.services, "max");
  return c.json({
    data: {
      ...row,
      features: parseJsonArray(row.features),
      plans: row.plans.map((p) => ({ ...p, features: parseJsonArray(p.features) })),
    },
  });
});

services.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.service.delete({ where: { id: c.req.param("id") } });
  revalidateTag(CACHE_TAGS.services, "max");
  return c.json({ success: true });
});

export { services as servicesRoutes };
