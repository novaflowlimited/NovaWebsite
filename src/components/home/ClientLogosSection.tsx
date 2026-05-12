import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ClientLogoDisplay } from "@/components/site/ClientLogoDisplay";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";
import type { ApiListResponse } from "@/types";
import type { ClientLogo, LogoStripKind } from "@/types";

const STRIP_QUERY: Record<LogoStripSectionVariant, LogoStripKind> = {
  trusted: "TRUSTED_BY",
  softwareCustomers: "SOFTWARE_CUSTOMERS",
};

export type LogoStripSectionVariant = "trusted" | "softwareCustomers";

export async function ClientLogosSection({
  settings,
  variant = "trusted",
}: {
  settings: SiteSettingsPayload;
  variant?: LogoStripSectionVariant;
}) {
  const copy = variant === "trusted" ? settings.clientLogos : settings.softwareCustomersLogos;
  const stripKind = STRIP_QUERY[variant];
  let logos: ClientLogo[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ClientLogo>>(`/api/client-logos?strip=${stripKind}`, {
      next: { tags: [CACHE_TAGS.clientLogos] },
    });
    logos = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load logos (${e.status}).` : "Unable to load logos.";
  }

  if (variant === "softwareCustomers" && !err && logos.length === 0) {
    return null;
  }

  const sectionClass =
    variant === "trusted" ? "bg-cream/60 pb-12" : "border-t border-navy/10 bg-cream/40 py-12";

  return (
    <section className={sectionClass}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-navy/55">{copy.eyebrow}</p>
        {err ? (
          <ErrorRetry message={err} />
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <ClientLogoDisplay key={logo.id} logo={logo} />
            ))}
            <span className="text-sm font-medium text-navy/50">{copy.andMoreLabel}</span>
          </div>
        )}
      </div>
    </section>
  );
}
