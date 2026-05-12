import { Suspense } from "react";
import type { Metadata } from "next";
import { ClientLogosSection } from "@/components/home/ClientLogosSection";
import { CTABanner } from "@/components/home/CTABanner";
import { Hero } from "@/components/home/Hero";
import { ImpactBanner } from "@/components/home/ImpactBanner";
import { ImpactTeaser } from "@/components/home/ImpactTeaser";
import { PowerfulSolutionsRow } from "@/components/home/PowerfulSolutionsRow";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyNovaflow } from "@/components/home/WhyNovaflow";
import { Skeleton } from "@/components/ui/Skeleton";
import { getSiteSettings } from "@/lib/site-settings";
import { canonicalUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE_ABSOLUTE } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE_ABSOLUTE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: canonicalUrl("/") },
  openGraph: { url: canonicalUrl("/"), title: DEFAULT_TITLE_ABSOLUTE, description: DEFAULT_DESCRIPTION },
  twitter: { title: DEFAULT_TITLE_ABSOLUTE, description: DEFAULT_DESCRIPTION },
};

function SectionFallback({ className }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-6xl px-4 py-12 md:px-6 ${className ?? ""}`}>
      <Skeleton className="mx-auto mb-4 h-8 w-64" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <Hero settings={settings} />
      <Suspense fallback={<SectionFallback />}>
        <ImpactBanner statsStrip={settings.statsStrip ?? { eyebrow: "" }} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ClientLogosSection settings={settings} variant="trusted" />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ClientLogosSection settings={settings} variant="softwareCustomers" />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PowerfulSolutionsRow settings={settings} />
      </Suspense>
      <ImpactTeaser settings={settings} />
      <WhyNovaflow settings={settings} />
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection settings={settings} />
      </Suspense>
      <CTABanner settings={settings} />
    </>
  );
}
