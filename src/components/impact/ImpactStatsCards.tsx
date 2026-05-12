import { IconSchool, IconCross, IconWifi, IconUsers } from "@/components/ui/Icons";
import type { ImpactStat } from "@/types";

const PRESETS = [
  { match: ["school"], icon: IconSchool, label: "Schools Connected" },
  { match: ["dispens", "health"], icon: IconCross, label: "Dispensaries Online" },
  { match: ["community", "hotspot"], icon: IconWifi, label: "Community Hotspots" },
  { match: ["people", "reached", "businesses"], icon: IconUsers, label: "People Reached" },
];

const FALLBACK = [
  { value: "47", label: "Schools Connected", icon: IconSchool },
  { value: "12", label: "Dispensaries Online", icon: IconCross },
  { value: "25+", label: "Community Hotspots", icon: IconWifi },
  { value: "15,000+", label: "People Reached", icon: IconUsers },
];

function formatStat(label: string, value: number) {
  const l = label.toLowerCase();
  if (l.includes("uptime")) return `${value}.9%`;
  if (value >= 1000) return `${value.toLocaleString("en-KE")}+`;
  if (value >= 25) return `${value}+`;
  return `${value}`;
}

export function ImpactStatsCards({ stats }: { stats: ImpactStat[] }) {
  // Try to map known labels to nice icons; otherwise fall back to the four canonical cards.
  const mapped = PRESETS.map((p) => {
    const found = stats.find((s) =>
      p.match.some((m) => s.label.toLowerCase().includes(m)),
    );
    if (!found) return null;
    return {
      value: formatStat(found.label, found.value),
      label: p.label,
      icon: p.icon,
    };
  }).filter(Boolean) as { value: string; label: string; icon: typeof IconSchool }[];

  // Add a final “People Reached” card if not present in DB
  if (!mapped.find((m) => m.label === "People Reached")) {
    mapped.push(FALLBACK[3]!);
  }

  const final = mapped.length === 4 ? mapped : FALLBACK;

  return (
    <section className="bg-cream/40 pb-12 pt-10 md:pb-16 md:pt-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {final.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-2xl font-black text-navy md:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-navy/60 md:text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
