import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import {
  IconArrowRight,
  IconBilling,
  IconCart,
  IconCpu,
  IconMessage,
  IconPill,
} from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import { cn } from "@/lib/cn";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";
import type { ApiListResponse, ServiceDto } from "@/types";

type IconComp = (props: SVGProps<SVGSVGElement>) => ReactElement;

type EcosystemLook = {
  Icon: IconComp;
  badge: string;
  outer: string;
  inner: string;
  badgePill: string;
  link: string;
  arrow: string;
  glow: string;
};

const LOOK: Record<string, EcosystemLook> = {
  "isp-billing": {
    Icon: IconBilling,
    badge: "Cloud",
    outer: "bg-sky-100/80",
    inner: "bg-navy shadow-sm",
    badgePill: "bg-sky-100 text-sky-900",
    link: "text-sky-700 group-hover:text-sky-800",
    arrow: "text-sky-700",
    glow: "shadow-sky-200/60",
  },
  "retail-pos": {
    Icon: IconCart,
    badge: "Cloud",
    outer: "bg-orange/15",
    inner: "bg-orange shadow-sm",
    badgePill: "bg-orange/20 text-orange-900",
    link: "text-orange group-hover:text-orange/90",
    arrow: "text-orange",
    glow: "shadow-orange-200/50",
  },
  "pharmacy-pos": {
    Icon: IconPill,
    badge: "Cloud",
    outer: "bg-emerald-100/80",
    inner: "bg-emerald-600 shadow-sm",
    badgePill: "bg-emerald-100 text-emerald-900",
    link: "text-emerald-700 group-hover:text-emerald-800",
    arrow: "text-emerald-700",
    glow: "shadow-emerald-200/60",
  },
  "whatsapp-api": {
    Icon: IconMessage,
    badge: "Integration",
    outer: "bg-teal-100/80",
    inner: "bg-teal-600 shadow-sm",
    badgePill: "bg-teal-100 text-teal-900",
    link: "text-teal-700 group-hover:text-teal-800",
    arrow: "text-teal-700",
    glow: "shadow-teal-200/60",
  },
  "ai-automation": {
    Icon: IconCpu,
    badge: "AI Powered",
    outer: "bg-violet-100/80",
    inner: "bg-violet-600 shadow-sm",
    badgePill: "bg-violet-100 text-violet-900",
    link: "text-violet-700 group-hover:text-violet-800",
    arrow: "text-violet-700",
    glow: "shadow-violet-200/60",
  },
};

const FALLBACK_LOOK: EcosystemLook = {
  Icon: IconCpu,
  badge: "Product",
  outer: "bg-navy/10",
  inner: "bg-navy shadow-sm",
  badgePill: "bg-navy/10 text-navy",
  link: "text-navy group-hover:text-navy/90",
  arrow: "text-navy",
  glow: "shadow-navy/10",
};

export async function PowerfulSolutionsRow({ settings }: { settings: SiteSettingsPayload }) {
  const { ecosystem } = settings;
  let services: ServiceDto[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ServiceDto>>("/api/services", {
      next: { tags: [CACHE_TAGS.services] },
    });
    services = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load services (${e.status}).` : "Unable to load services.";
  }

  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const display = ecosystem.slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as ServiceDto[];

  return (
    <section className="bg-cream/30 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow={ecosystem.eyebrow}
          title={ecosystem.title}
          subtitle={ecosystem.subtitle}
          className="mb-10 md:max-w-3xl"
        />

        {err ? (
          <ErrorRetry message={err} />
        ) : (
          <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-4 p-0 md:gap-5">
            {display.map((s) => {
              const look = LOOK[s.slug] ?? FALLBACK_LOOK;
              const Icon = look.Icon;
              return (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className={cn(
                      "group flex h-full flex-col rounded-2xl border border-navy/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition",
                      "hover:-translate-y-0.5 hover:border-navy/15 hover:shadow-lg",
                      look.glow,
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={cn("rounded-xl p-1.5 ring-1 ring-black/[0.04]", look.outer)}>
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-white",
                            look.inner,
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.2} />
                        </span>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          look.badgePill,
                        )}
                      >
                        {look.badge}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-bold leading-tight text-navy">{s.name}</h3>
                    <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-navy/60">
                      {s.tagline}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-flex items-center gap-1 text-xs font-bold transition group-hover:gap-1.5",
                        look.link,
                      )}
                    >
                      {ecosystem.learnMoreLabel}
                      <IconArrowRight className={cn("h-3 w-3", look.arrow)} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
