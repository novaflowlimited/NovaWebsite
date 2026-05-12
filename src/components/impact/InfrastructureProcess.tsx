import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconMapPin, IconLayers, IconWifi, IconShield } from "@/components/ui/Icons";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

const steps = [
  {
    icon: IconMapPin,
    title: "Site Survey",
    body: "We assess community needs and site conditions.",
  },
  {
    icon: IconLayers,
    title: "Infrastructure Deployment",
    body: "We build and deploy reliable internet infrastructure.",
  },
  {
    icon: IconWifi,
    title: "WiFi Installation",
    body: "We install free WiFi for public institutions.",
  },
  {
    icon: IconShield,
    title: "Ongoing Support",
    body: "We provide continuous monitoring and maintenance.",
  },
];

export function InfrastructureProcess({ impact }: { impact: SiteSettingsPayload["impact"] }) {
  return (
    <section className="bg-cream/30 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Our Infrastructure Process"
          title="From planning to impact."
          className="mb-12"
        />
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr,0.8fr]">
          <ol className="relative space-y-6 md:space-y-7">
            <span
              aria-hidden
              className="absolute left-5 top-2 bottom-2 hidden w-px bg-orange/20 md:block"
            />
            {steps.map((s, idx) => (
              <li key={s.title} className="relative flex gap-4">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-md shadow-orange/30">
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange">
                    Step {idx + 1}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/65">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-navy/5 shadow-xl shadow-navy/10">
            <Image
              src={impact.infrastructurePhotoUrl}
              alt={impact.infrastructurePhotoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 text-sm shadow backdrop-blur">
              <p className="font-bold text-navy">Field-tested infrastructure</p>
              <p className="text-xs text-navy/65">
                Built for harsh conditions and remote operation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
