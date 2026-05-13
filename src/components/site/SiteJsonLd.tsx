import { canonicalUrl, clipDescription } from "@/lib/seo";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

/** Organization + WebSite JSON-LD for the public layout (address/phone from CMS footer). */
export function SiteJsonLd({ settings }: { settings: SiteSettingsPayload }) {
  const url = canonicalUrl("/");
  const desc = clipDescription(
    settings.seo.metaDescription?.trim() ||
      settings.hero.subtitle?.trim() ||
      settings.footer.blurb?.trim() ||
      "Technology for Kenyan businesses and rural communities.",
    200,
  );

  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url,
    description: desc,
  };
  const logo = settings.brand.logoUrl?.trim();
  if (logo?.startsWith("http")) org.logo = logo;

  const addr = settings.footer.address?.trim();
  if (addr) {
    org.address = {
      "@type": "PostalAddress",
      streetAddress: addr,
      addressCountry: "KE",
    };
  }

  const tel = settings.footer.phone?.trim();
  if (tel) {
    org.contactPoint = {
      "@type": "ContactPoint",
      telephone: tel,
      contactType: "customer support",
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    };
  }

  org.areaServed = { "@type": "Country", name: "Kenya" };

  const sameAs = settings.footer.social
    .map((s) => s.href.trim())
    .filter((h) => h.startsWith("http"));
  if (sameAs.length) org.sameAs = sameAs;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.companyName,
    url,
    description: desc,
    publisher: { "@type": "Organization", name: settings.companyName, url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([org, website]) }}
    />
  );
}
