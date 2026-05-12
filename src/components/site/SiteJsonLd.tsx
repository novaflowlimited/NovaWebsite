import { canonicalUrl, DEFAULT_DESCRIPTION } from "@/lib/seo";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

/** Organization + WebSite JSON-LD for the public layout. */
export function SiteJsonLd({ settings }: { settings: SiteSettingsPayload }) {
  const url = canonicalUrl("/");
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url,
    description: DEFAULT_DESCRIPTION,
  };
  const logo = settings.brand.logoUrl?.trim();
  if (logo?.startsWith("http")) org.logo = logo;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.companyName,
    url,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: settings.companyName, url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([org, website]) }}
    />
  );
}
