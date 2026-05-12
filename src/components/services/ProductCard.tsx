import Link from "next/link";
import { ServiceIcon, IconArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import type { ServiceCategory, ServiceDto } from "@/types";

type Accent = {
  iconBg: string;
  iconText: string;
  badge: string;
  badgeText: string;
  preview: string;
  bar: string;
};

const ACCENTS: Record<ServiceCategory, Accent> = {
  SOFTWARE: {
    iconBg: "bg-navy/10",
    iconText: "text-navy",
    badge: "bg-navy/10",
    badgeText: "text-navy",
    preview: "bg-navy/5",
    bar: "bg-navy/40",
  },
  AUTOMATION: {
    iconBg: "bg-orange/15",
    iconText: "text-orange",
    badge: "bg-orange/15",
    badgeText: "text-orange",
    preview: "bg-orange/5",
    bar: "bg-orange/50",
  },
  IOT: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-700",
    preview: "bg-emerald-50",
    bar: "bg-emerald-500/60",
  },
  CONNECTIVITY: {
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
    badge: "bg-sky-100",
    badgeText: "text-sky-700",
    preview: "bg-sky-50",
    bar: "bg-sky-500/60",
  },
};

function badgeFor(s: ServiceDto): string {
  const slug = s.slug;
  if (s.category === "AUTOMATION") return slug === "whatsapp-api" ? "Integration" : "AI Powered";
  if (s.category === "IOT") return "IoT Ready";
  if (s.category === "CONNECTIVITY") return "Field Ops";
  return "Cloud Hosted";
}

export function ProductCard({ service }: { service: ServiceDto }) {
  const a = ACCENTS[service.category];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-navy/10">
      <div className="flex items-start justify-between px-3.5 pt-3.5">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-navy/5",
            a.iconBg,
            a.iconText,
          )}
        >
          <ServiceIcon name={service.icon} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            a.badge,
            a.badgeText,
          )}
        >
          {badgeFor(service)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5">
        <h3 className="text-sm font-bold leading-snug text-navy">{service.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-navy/65">{service.tagline}</p>

        {service.features.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {service.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-1.5 text-[11px] leading-snug text-navy/75">
                <span className={cn("mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-current", a.iconText)} />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Mini dashboard preview */}
        <div className={cn("mt-2 rounded-lg p-2 ring-1 ring-navy/5", a.preview)}>
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              <span className="h-1 w-1 rounded-full bg-red-400" />
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[8px] font-semibold text-navy/40">Live</span>
          </div>
          <div className="mt-1.5 space-y-1">
            <div className={cn("h-1 w-3/4 rounded-full", a.bar, "opacity-70")} />
            <div className={cn("h-1 w-1/2 rounded-full", a.bar, "opacity-50")} />
            <PreviewSparkline accent={a.bar} />
          </div>
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-orange transition group-hover:gap-1.5"
        >
          Learn more
          <IconArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

function PreviewSparkline({ accent }: { accent: string }) {
  const stroke = accent.includes("orange")
    ? "#FF6B00"
    : accent.includes("emerald")
    ? "#059669"
    : accent.includes("sky")
    ? "#0284C7"
    : "#1B2A7A";
  return (
    <svg viewBox="0 0 120 24" className="mt-0.5 h-4 w-full">
      <path
        d="M0 16 L15 14 L30 18 L45 10 L60 12 L75 6 L90 9 L105 4 L120 7"
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
