import Image from "next/image";
import Link from "next/link";
import { BrandLogoMark } from "@/components/site/BrandLogoMark";
import { buttonClassName } from "@/components/ui/Button";
import { IconSparkle, IconArrowRight, IconChart } from "@/components/ui/Icons";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

export function Hero({ settings }: { settings: SiteSettingsPayload }) {
  const { hero, companyName, brand } = settings;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream/60 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-navy/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr,1fr] md:gap-10 md:px-6 md:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-xs font-semibold text-navy/80 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-orange" /> {hero.badge}
          </div>
          <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-navy md:text-5xl lg:text-6xl">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
            <br />
            <span className="text-orange">{hero.titleLine3}</span>
            <br />
            <span className="text-orange">{hero.titleLine4}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/70 md:text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={hero.primaryHref}
              className={buttonClassName("primary", "rounded-full px-7 py-3 text-sm shadow-lg shadow-orange/25")}
            >
              {hero.primaryCta}
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hero.secondaryHref}
              className={buttonClassName(
                "ghost",
                "rounded-full border border-navy/15 bg-white px-7 py-3 text-sm text-navy hover:bg-cream",
              )}
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <HeroVisual hero={hero} companyName={companyName} brand={settings.brand} />
        </div>
      </div>
    </section>
  );
}

function HeroVisual({
  hero,
  companyName,
  brand,
}: {
  hero: SiteSettingsPayload["hero"];
  companyName: string;
  brand: SiteSettingsPayload["brand"];
}) {
  return (
    <div className="relative aspect-[5/4] w-full">
      <div className="absolute left-0 top-2 w-[72%] rounded-2xl border border-navy/10 bg-white p-4 shadow-xl shadow-navy/5">
        <div className="flex items-center gap-2 pb-3">
          <BrandLogoMark logoUrl={brand.logoUrl} logoAlt={brand.logoAlt} variant="navbar" size="sm" />
          <span className="text-xs font-bold text-navy">{companyName}</span>
          <span className="ml-auto text-[10px] font-medium text-navy/40">Overview</span>
        </div>
        <div className="flex gap-3">
          <ul className="hidden flex-col gap-1.5 text-[10px] font-medium text-navy/55 sm:flex">
            {hero.visualSidebar.map((l, i) => (
              <li
                key={l}
                className={
                  i === 0 ? "rounded-md bg-cream px-2 py-1 text-navy" : "rounded-md px-2 py-1 hover:bg-cream"
                }
              >
                {l}
              </li>
            ))}
          </ul>
          <div className="flex-1 rounded-xl bg-cream/60 p-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold text-navy/55">{hero.revenueLabel}</p>
                <p className="text-lg font-extrabold text-navy">{hero.revenueValue}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {hero.revenueBadge}
              </span>
            </div>
            <p className="mt-1 text-[9px] font-medium text-navy/45">{hero.revenueTrendLabel}</p>
            <ChartSpark />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 h-[58%] w-[58%] overflow-hidden rounded-2xl border-4 border-white bg-cream shadow-xl shadow-navy/15">
        <Image
          src={hero.imageUrl}
          alt={hero.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 60vw, 320px"
          priority
        />
      </div>

      <div className="absolute bottom-3 left-2 hidden h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-navy text-white shadow-xl shadow-navy/30 sm:flex">
        <TowerGlyph />
      </div>

      <div className="absolute right-2 top-[42%] flex items-center gap-3 rounded-xl border border-navy/10 bg-white/95 px-3 py-2 shadow-xl shadow-navy/10 backdrop-blur">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-soft text-white">
          <IconSparkle className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold text-navy/55">{hero.aiCardEyebrow}</p>
          <p className="text-sm font-extrabold text-navy">
            {hero.aiCardTitle}{" "}
            <span className="text-[10px] font-medium text-emerald-600">{hero.aiCardHint}</span>
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-0 hidden items-center gap-2 rounded-full bg-navy/95 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg shadow-navy/20 md:inline-flex">
        <IconChart className="h-3.5 w-3.5 text-orange" />
        {hero.uptimeChip}
      </div>
    </div>
  );
}

function ChartSpark() {
  return (
    <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full">
      <defs>
        <linearGradient id="heroChart" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 45 L20 38 L40 42 L60 30 L80 35 L100 22 L120 25 L140 15 L160 18 L180 8 L200 12 L200 60 L0 60 Z"
        fill="url(#heroChart)"
      />
      <path
        d="M0 45 L20 38 L40 42 L60 30 L80 35 L100 22 L120 25 L140 15 L160 18 L180 8 L200 12"
        stroke="#FF6B00"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TowerGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 8 L32 56 L42 8" />
        <path d="M32 8 L32 56" />
        <path d="M24 22 H40" />
        <path d="M22 34 H42" />
        <path d="M20 46 H44" />
        <path d="M24 56 H40" />
        <path d="M14 12 q4 -6 18 -6 q14 0 18 6" strokeOpacity="0.5" />
        <path d="M10 8 q6 -8 22 -8 q16 0 22 8" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}
