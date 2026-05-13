import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/site-url";

/** Fallback brand suffix when building metadata without loaded site settings. */
export const SITE_NAME = "Novaflow Limited";

export const DEFAULT_DESCRIPTION =
  "Connect. Build. Innovate. — Technology for Kenyan businesses and rural communities.";

/** Legacy home title if site settings are unavailable (should be rare). */
export const DEFAULT_TITLE_ABSOLUTE = "Novaflow Limited — Connect. Build. Innovate.";

export function canonicalUrl(pathname: string): string {
  const base = getSiteOrigin();
  if (!pathname || pathname === "/") return `${base}/`;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

/** One-line description for `<meta name="description">` / OG. */
export function clipDescription(text: string, max = 155): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Standard metadata for a top-level marketing route. */
export function routeMetadata(
  segmentTitle: string,
  description: string,
  path: string,
  brandEntity: string = SITE_NAME,
): Metadata {
  const url = canonicalUrl(path);
  const fullTitle = `${segmentTitle} | ${brandEntity}`;
  return {
    title: segmentTitle,
    description,
    alternates: { canonical: url },
    openGraph: { url, title: fullTitle, description },
    twitter: { title: fullTitle, description },
  };
}

/** Root layout: env-based base URL, icons, crawl defaults. Marketing copy lives in `(site)` `generateMetadata` + CMS. */
export function rootMetadata(): Metadata {
  const url = getSiteOrigin().replace(/\/$/, "");
  return {
    metadataBase: new URL(url),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    category: "technology",
  };
}
