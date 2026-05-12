import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  IconShield,
  IconChart,
  IconCpu,
  IconBilling,
  IconLayers,
  IconWifi,
} from "@/components/ui/Icons";

const features = [
  { icon: IconShield, title: "Secure Infrastructure", body: "Enterprise grade security and data protection." },
  { icon: IconChart, title: "Real-time Analytics", body: "Live dashboards to drive better business decisions." },
  { icon: IconCpu, title: "AI Workflows", body: "Automate repetitive tasks across teams and tools." },
  { icon: IconBilling, title: "API Integrations", body: "Connect M-Pesa, NHIF and your existing stack." },
  { icon: IconLayers, title: "Multi-branch Management", body: "Manage all locations and terminals from one dashboard." },
  { icon: IconWifi, title: "Smart Monitoring", body: "Network and device telemetry — always-on visibility." },
];

export function EnterpriseFeatures() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Enterprise grade by design"
          title="Built for performance. Designed for scale."
          align="center"
          className="mb-12"
        />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-orange">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-navy">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy/65">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
