import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiItemResponse, MapFeaturedCounty } from "@/types";
import { KENYA_MAP_DOTS, KENYA_OUTLINE_D } from "./kenya-map-geometry";

const COLORS: Record<string, string> = {
  connected: "#FF6B00",
  "in-progress": "#1B2A7A",
  planned: "#94A3B8",
};

const FALLBACK = {
  id: "__local_fallback__",
  countyName: "Nakuru County",
  statusLabel: "Connected",
  description:
    "An active operating county with free WiFi at schools, dispensaries and community hotspots — and an expanding rollout.",
  schoolsCount: 5,
  dispensariesCount: 2,
  communityHotspots: 3,
  createdAt: new Date(0),
  updatedAt: new Date(0),
} as MapFeaturedCounty;

export async function CoverageMap() {
  let featured: MapFeaturedCounty = FALLBACK;
  try {
    const res = await publicFetch<ApiItemResponse<MapFeaturedCounty | null>>("/api/impact/map-feature", {
      next: { tags: [CACHE_TAGS.impactMapFeature] },
    });
    if (res.data) featured = res.data;
  } catch {
    // Keep FALLBACK if API is unavailable during build or offline.
  }

  const stats = [
    { value: String(featured.schoolsCount), label: "Schools" },
    { value: String(featured.dispensariesCount), label: "Dispensaries" },
    { value: String(featured.communityHotspots), label: "Community Hotspots" },
  ];

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Where we operate"
          title="Expanding connectivity across Kenya"
          className="mb-12"
        />

        <div className="grid items-start gap-10 md:grid-cols-[1.1fr,0.9fr]">
            {/* Kenya map */}
            <div className="rounded-3xl border border-navy/10 bg-cream/30 p-6 shadow-sm md:p-8">
              <div className="mx-auto max-w-sm">
                <svg viewBox="0 0 220 260" className="h-auto w-full" role="img" aria-label="Map of Kenya">
                  <defs>
                    <linearGradient id="kenyaFill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF4EC" />
                      <stop offset="100%" stopColor="#FFE8DC" />
                    </linearGradient>
                  </defs>
                  <path
                    d={KENYA_OUTLINE_D}
                    fill="url(#kenyaFill)"
                    stroke="#1B2A7A"
                    strokeOpacity="0.35"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d={KENYA_OUTLINE_D}
                    fill="none"
                    stroke="#FF6B00"
                    strokeOpacity="0.12"
                    strokeWidth="8"
                  />
                  {KENYA_MAP_DOTS.map((d, i) => (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r="9" fill={COLORS[d.status]} fillOpacity="0.2" />
                      <circle cx={d.x} cy={d.y} r="3.8" fill={COLORS[d.status]} />
                    </g>
                  ))}
                </svg>
              </div>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-navy/75">
                <LegendDot color={COLORS.connected!} label="Connected" />
                <LegendDot color={COLORS["in-progress"]!} label="In Progress" />
                <LegendDot color={COLORS.planned!} label="Planned" />
              </ul>
            </div>

            {/* Featured county — copy from CMS */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-orange">{featured.statusLabel}</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">{featured.countyName}</h3>
              <p className="mt-2 text-sm text-navy/65">{featured.description}</p>

              <ul className="mt-6 space-y-3">
                {stats.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center justify-between rounded-xl bg-cream/40 px-4 py-3 ring-1 ring-navy/5"
                  >
                    <span className="text-sm font-semibold text-navy/80">{s.label}</span>
                    <span className="text-lg font-extrabold text-navy">{s.value}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/impact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition hover:gap-2.5"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: color }} />
      {label}
    </li>
  );
}
