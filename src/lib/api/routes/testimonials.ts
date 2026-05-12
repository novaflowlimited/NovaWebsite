import { Hono } from "hono";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";

const testimonials = new Hono();

testimonials.get("/", async (c) => {
  const featured = c.req.query("featured");
  const where = {
    published: true,
    ...(featured === "true" ? { featured: true } : {}),
  };
  const rows = await prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: rows });
});

testimonials.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return c.json({ data: rows });
});

testimonials.get("/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.testimonial.findUnique({ where: { id: c.req.param("id") } });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ data: row });
});

testimonials.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    clientName: string;
    clientRole: string;
    company: string;
    companyLogo?: string | null;
    content: string;
    rating?: number;
    featured?: boolean;
    published?: boolean;
  }>();
  const row = await prisma.testimonial.create({
    data: {
      clientName: body.clientName,
      clientRole: body.clientRole,
      company: body.company,
      companyLogo: body.companyLogo ?? null,
      content: body.content,
      rating: body.rating ?? 5,
      featured: body.featured ?? false,
      published: body.published ?? true,
    },
  });
  return c.json({ data: row });
});

testimonials.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<
    Partial<{
      clientName: string;
      clientRole: string;
      company: string;
      companyLogo: string | null;
      content: string;
      rating: number;
      featured: boolean;
      published: boolean;
    }>
  >();
  const row = await prisma.testimonial.update({
    where: { id: c.req.param("id") },
    data: body,
  });
  return c.json({ data: row });
});

testimonials.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await prisma.testimonial.delete({ where: { id: c.req.param("id") } });
  return c.json({ success: true });
});

export { testimonials as testimonialsRoutes };
