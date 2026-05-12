import type { Metadata } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export const SITE_NAME = "Novaflow Limited";

export const DEFAULT_DESCRIPTION =
  "Connect. Build. Innovate. — Technology for Kenyan businesses and rural communities.";

/** Home page title (not run through `title.template`). */
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
export function routeMetadata(segmentTitle: string, description: string, path: string): Metadata {
  const url = canonicalUrl(path);
  const fullTitle = `${segmentTitle} | ${SITE_NAME}`;
  return {
    title: segmentTitle,
    description,
    alternates: { canonical: url },
    openGraph: { url, title: fullTitle, description },
    twitter: { title: fullTitle, description },
  };
}

export function rootMetadata(): Metadata {
  const base = getSiteOrigin();
  const url = base.endsWith("/") ? base.slice(0, -1) : base;
  return {
    metadataBase: new URL(url),
    title: { default: DEFAULT_TITLE_ABSOLUTE, template: `%s | ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    referrer: "origin-when-cross-origin",
    keywords: [
      "Novaflow",
      "Kenya",
      "ISP billing",
      "retail POS",
      "pharmacy POS",
      "public WiFi",
      "digital inclusion",
      "enterprise software",
      "AI automation",
    ],
    authors: [{ name: SITE_NAME, url: url }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: `${url}/`,
      siteName: SITE_NAME,
      title: DEFAULT_TITLE_ABSOLUTE,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE_ABSOLUTE,
      description: DEFAULT_DESCRIPTION,
    },
    category: "technology",
  };
}
