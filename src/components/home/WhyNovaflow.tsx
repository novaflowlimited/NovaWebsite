import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconShield, IconCpu, IconChart, IconSparkle } from "@/components/ui/Icons";
import type { SiteSettingsPayload, WhyIconKey } from "@/lib/site-settings-payload";

const ICONS: Record<WhyIconKey, typeof IconChart> = {
  chart: IconChart,
  cpu: IconCpu,
  shield: IconShield,
  sparkle: IconSparkle,
};

export function WhyNovaflow({ settings }: { settings: SiteSettingsPayload }) {
  const { why } = settings;
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader eyebrow={why.eyebrow} title={why.title} align="center" className="mb-12" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.cards.map((i) => {
            const Icon = ICONS[i.icon] ?? IconChart;
            return (
              <div
                key={i.title}
                className="group rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange/30 hover:shadow-xl hover:shadow-navy/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-orange transition group-hover:bg-orange group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-base font-bold text-navy">{i.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/65">{i.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
