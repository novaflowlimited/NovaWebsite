import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

/**
 * Next.js serves this at `/robots.txt`. If you use Cloudflare “AI Crawlers” / managed robots,
 * Cloudflare may prepend its own directives so you see two `User-agent: *` sections in the
 * final file—that merge is edge/CDN config, not duplicate rules in this file.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
