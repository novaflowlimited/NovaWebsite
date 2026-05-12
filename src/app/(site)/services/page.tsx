import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { EnterpriseFeatures } from "@/components/services/EnterpriseFeatures";
import { ScaleCTA } from "@/components/services/ScaleCTA";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesTabsGrid } from "@/components/services/ServicesTabsGrid";
import { TrustedByStrip } from "@/components/services/TrustedByStrip";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import { getSiteSettings } from "@/lib/site-settings";
import type { ApiListResponse, ServiceDto } from "@/types";

export const metadata = {
  title: "Products & Services — Novaflow",
  description:
    "From ISP operations to AI automation, Novaflow provides enterprise-grade tools designed for growth, reliability and scale.",
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  let services: ServiceDto[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ServiceDto>>("/api/services");
    services = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load services (${e.status}).` : "Unable to load services.";
  }

  return (
    <>
      <ServicesHero brand={settings.brand} companyName={settings.companyName} />
      <section id="products" className="bg-cream/30 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Our Products"
            title="Solutions for every industry"
            subtitle="Filter by category to find the right product for your operation."
            align="center"
            className="mb-8"
          />
          {err ? <ErrorRetry message={err} /> : <ServicesTabsGrid services={services} />}
        </div>
      </section>
      <EnterpriseFeatures />
      <TrustedByStrip />
      <TestimonialsSection settings={settings} />
      <ScaleCTA />
    </>
  );
}
