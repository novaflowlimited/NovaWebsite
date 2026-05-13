import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { clipDescription, canonicalUrl, routeMetadata, SITE_NAME } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site-url";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

const FALLBACK_ENTITY = SITE_NAME;

/** Legal / brand suffix for `<title>` template (`%s | …`). */
export function siteTitleEntity(settings: SiteSettingsPayload): string {
  const e = settings.copyrightEntity?.trim();
  if (e) return e;
  const c = settings.companyName?.trim();
  if (c) return c;
  return FALLBACK_ENTITY;
}

export function defaultSeoDescription(settings: SiteSettingsPayload): string {
  const custom = settings.seo.metaDescription?.trim();
  if (custom) return clipDescription(custom, 160);
  const hero = settings.hero.subtitle?.trim();
  if (hero) return clipDescription(hero, 160);
  const blurb = settings.footer.blurb?.trim();
  if (blurb) return clipDescription(blurb, 160);
  return clipDescription(
    "Connect. Build. Innovate. — Technology for Kenyan businesses and rural communities.",
    160,
  );
}

export function defaultSeoKeywords(settings: SiteSettingsPayload): string[] {
  const k = settings.seo.keywords?.filter(Boolean);
  if (k?.length) return k.slice(0, 40);
  const base = [settings.companyName, "Kenya"].filter(Boolean) as string[];
  return Array.from(new Set(base));
}

export function homeDocumentTitle(settings: SiteSettingsPayload): string {
  const t = settings.seo.homeTitle?.trim();
  if (t) return t;
  const sub = clipDescription(settings.hero.subtitle, 100);
  return `${settings.companyName} — ${sub}`;
}

/** Default `<title>` / OG title for the marketing shell (not the absolute home title). */
export function siteDefaultTitleLine(settings: SiteSettingsPayload): string {
  return homeDocumentTitle(settings);
}

export function buildSiteLayoutMetadata(settings: SiteSettingsPayload): Metadata {
  const base = getSiteOrigin().replace(/\/$/, "");
  const entity = siteTitleEntity(settings);
  const desc = defaultSeoDescription(settings);
  const defaultTitle = siteDefaultTitleLine(settings);
  const keywords = defaultSeoKeywords(settings);

  return {
    title: { default: defaultTitle, template: `%s | ${entity}` },
    description: desc,
    applicationName: settings.companyName,
    keywords,
    authors: [{ name: entity, url: base }],
    creator: settings.companyName,
    publisher: entity,
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: `${base}/`,
      siteName: settings.companyName,
      title: defaultTitle,
      description: desc,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: desc,
    },
  };
}

export function homePageMetadata(settings: SiteSettingsPayload): Metadata {
  const titleAbs = homeDocumentTitle(settings);
  const desc = defaultSeoDescription(settings);
  const url = canonicalUrl("/");
  const entity = siteTitleEntity(settings);
  const keywords = defaultSeoKeywords(settings);
  return {
    title: { absolute: titleAbs },
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: { url, title: titleAbs, description: desc, siteName: settings.companyName },
    twitter: { title: titleAbs, description: desc },
    authors: [{ name: entity, url: getSiteOrigin().replace(/\/$/, "") }],
  };
}

export async function resolvedRouteMetadata(
  segmentTitle: string,
  description: string,
  path: string,
): Promise<Metadata> {
  const settings = await getSiteSettings();
  return routeMetadata(segmentTitle, description, path, siteTitleEntity(settings));
}
