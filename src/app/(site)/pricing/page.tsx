import type { Metadata } from "next";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { PricingClient } from "@/components/home/Pricing";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, ServiceDto } from "@/types";
import { routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata(
  "Pricing",
  "Simple, transparent pricing. No hidden fees. Kenya Shilling pricing.",
  "/pricing",
);

export default async function PricingPage() {
  let services: ServiceDto[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ServiceDto>>("/api/services", {
      next: { tags: [CACHE_TAGS.services] },
    });
    services = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load pricing (${e.status}).` : "Unable to load pricing.";
  }

  if (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <ErrorRetry message={err} />
      </div>
    );
  }

  return <PricingClient services={services} />;
}
