import { ErrorRetry } from "@/components/site/ErrorRetry";
import { CoverageMap } from "@/components/impact/CoverageMap";
import { ImpactHero } from "@/components/impact/ImpactHero";
import { ImpactPartnerCTA } from "@/components/impact/ImpactPartnerCTA";
import { ImpactStatsCards } from "@/components/impact/ImpactStatsCards";
import { ImpactStories } from "@/components/impact/ImpactStories";
import { InfrastructureProcess } from "@/components/impact/InfrastructureProcess";
import { PublicWifiSection } from "@/components/impact/PublicWifiSection";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import { getSiteSettings } from "@/lib/site-settings";
import type { ApiListResponse, CommunityStory, ImpactStat } from "@/types";

export const metadata = {
  title: "Impact & Connectivity — Novaflow",
  description:
    "We bring internet infrastructure and free public WiFi to underserved communities across Kenya.",
};

export default async function ImpactPage() {
  const site = await getSiteSettings();
  let stats: ImpactStat[] = [];
  let stories: CommunityStory[] = [];
  let err: string | null = null;
  try {
    const [statsRes, storiesRes] = await Promise.all([
      publicFetch<ApiListResponse<ImpactStat>>("/api/impact/stats"),
      publicFetch<ApiListResponse<CommunityStory>>("/api/impact/stories"),
    ]);
    stats = statsRes.data;
    stories = storiesRes.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load impact data (${e.status}).` : "Unable to load impact data.";
  }

  return (
    <>
      <ImpactHero impact={site.impact} />
      {err ? (
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <ErrorRetry message={err} />
        </div>
      ) : (
        <>
          <ImpactStatsCards stats={stats} />
          <CoverageMap />
          <ImpactStories stories={stories} />
          <PublicWifiSection />
          <InfrastructureProcess impact={site.impact} />
          <ImpactPartnerCTA impact={site.impact} />
        </>
      )}
    </>
  );
}
