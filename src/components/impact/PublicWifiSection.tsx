import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconSchool, IconCross, IconShield, IconUsers, IconArrowRight } from "@/components/ui/Icons";

const items = [
  {
    icon: IconSchool,
    title: "Schools",
    body: "Free internet for learning and growth.",
    count: "24 Connected",
  },
  {
    icon: IconCross,
    title: "Dispensaries",
    body: "Better healthcare connectivity.",
    count: "12 Connected",
  },
  {
    icon: IconShield,
    title: "Police Stations",
    body: "Improving coordination and communication.",
    count: "8 Connected",
  },
  {
    icon: IconUsers,
    title: "Community Centres",
    body: "Digital access for everyone.",
    count: "16 Connected",
  },
];

export function PublicWifiSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Free WiFi for Public Institutions"
            title={
              <>
                Internet access for the places
                <br />
                that serve our communities.
              </>
            }
            className="md:max-w-2xl"
          />
          <Link
            href="#stories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition hover:gap-2.5"
          >
            View All Locations
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div
              key={i.title}
              className="group rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange/30 hover:shadow-xl hover:shadow-navy/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-white">
                <i.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-navy">{i.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy/65">{i.body}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {i.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
