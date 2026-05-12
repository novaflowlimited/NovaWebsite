import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { requireAuth } from "../middleware/auth";

const posts = new Hono();

function parseTags(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

posts.get("/", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? "10"), 50);
  const page = Math.max(Number(c.req.query("page") ?? "1"), 1);
  const category = c.req.query("category");
  const where = {
    published: true,
    ...(category ? { category } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where }),
  ]);
  return c.json({
    data: rows.map((p) => ({ ...p, tags: parseTags(p.tags) })),
    page,
    total,
    hasMore: page * limit < total,
  });
});

posts.get("/admin/all", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const rows = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
  return c.json({ data: rows.map((p) => ({ ...p, tags: parseTags(p.tags) })) });
});

posts.get("/admin/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const row = await prisma.post.findUnique({ where: { id: c.req.param("id") } });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ data: { ...row, tags: parseTags(row.tags) } });
});

posts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json({ data: { ...post, tags: parseTags(post.tags) } });
});

posts.post("/", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json<{
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    category: string;
    tags?: string[];
    published?: boolean;
  }>();
  const slug =
    body.slug ??
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const created = await prisma.post.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage ?? null,
      category: body.category,
      tags: JSON.stringify(body.tags ?? []),
      published: Boolean(body.published),
    },
  });
  revalidateTag(CACHE_TAGS.posts, "max");
  return c.json({ data: { ...created, tags: parseTags(created.tags) } });
});

posts.put("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const body = await c.req.json<{
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string | null;
    category?: string;
    tags?: string[];
    published?: boolean;
  }>();
  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.coverImage !== undefined ? { coverImage: body.coverImage } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.tags !== undefined ? { tags: JSON.stringify(body.tags) } : {}),
      ...(body.published !== undefined ? { published: body.published } : {}),
    },
  });
  revalidateTag(CACHE_TAGS.posts, "max");
  return c.json({ data: { ...updated, tags: parseTags(updated.tags) } });
});

posts.delete("/:id", async (c) => {
  const user = await requireAuth(c.req.header("authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  await prisma.post.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.posts, "max");
  return c.json({ success: true });
});

export { posts as postsRoutes };
