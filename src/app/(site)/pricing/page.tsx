import { ErrorRetry } from "@/components/site/ErrorRetry";
import { PricingClient } from "@/components/home/Pricing";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, ServiceDto } from "@/types";

export const metadata = {
  title: "Pricing — Novaflow",
  description: "Simple, transparent pricing. No hidden fees. Kenya Shilling pricing.",
};

export default async function PricingPage() {
  let services: ServiceDto[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ServiceDto>>("/api/services");
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
