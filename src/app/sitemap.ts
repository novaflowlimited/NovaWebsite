import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteOrigin } from "@/lib/site-url";

const STATIC: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] =
  [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "weekly", priority: 0.9 },
    { path: "/impact", changeFrequency: "weekly", priority: 0.9 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.85 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.75 },
  ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteOrigin();
  const now = new Date();
  const staticEntries = STATIC.map(({ path, changeFrequency, priority }) => ({
    url: path === "" ? `${base}/` : `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [services, posts, jobs, stories] = await Promise.all([
      prisma.service.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { name: "asc" },
      }),
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.job.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { closingDate: "asc" },
      }),
      prisma.communityStory.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    dynamicEntries = [
      ...services.map((x) => ({
        url: `${base}/services/${x.slug}`,
        lastModified: x.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.72,
      })),
      ...posts.map((x) => ({
        url: `${base}/blog/${x.slug}`,
        lastModified: x.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })),
      ...jobs.map((x) => ({
        url: `${base}/careers/${x.slug}`,
        lastModified: x.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.62,
      })),
      ...stories.map((x) => ({
        url: `${base}/impact/${x.slug}`,
        lastModified: x.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.62,
      })),
    ];
  } catch {
    /* DB unavailable at build time or misconfigured — static URLs only */
  }

  return [...staticEntries, ...dynamicEntries];
}
