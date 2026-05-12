import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse } from "@/types";
import type { ImpactStat } from "@/types";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ImpactBannerClient } from "./ImpactBannerClient";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

export async function ImpactBanner({ statsStrip }: { statsStrip?: SiteSettingsPayload["statsStrip"] }) {
  let stats: ImpactStat[] | null = null;
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ImpactStat>>("/api/impact/stats", {
      next: { tags: [CACHE_TAGS.impactStats] },
    });
    stats = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load stats (${e.status}).` : "Unable to load stats.";
  }
  if (err) {
    return (
      <section className="bg-cream/60 py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <ErrorRetry message={err} />
        </div>
      </section>
    );
  }
  return <ImpactBannerClient stats={stats ?? []} statsStripEyebrow={statsStrip?.eyebrow ?? ""} />;
}
