import Image from "next/image";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/Icons";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

export function ImpactTeaser({ settings }: { settings: SiteSettingsPayload }) {
  const { mission } = settings;
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">{mission.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
            {mission.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy/75">{mission.body}</p>
          <ul className="mt-7 space-y-3.5">
            {mission.points.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                  <IconCheck className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm text-navy/80 md:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <Link
            href={mission.ctaHref}
            className={buttonClassName("primary", "mt-9 inline-flex rounded-full px-7 py-3 text-sm shadow-lg shadow-orange/25")}
          >
            {mission.ctaLabel}
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-navy/5 shadow-xl shadow-navy/10">
            <Image
              src={mission.imageUrl}
              alt={mission.imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/15 via-transparent" />
          </div>

          <div className="absolute -right-3 top-6 hidden flex-col gap-2 md:flex">
            {mission.tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-md shadow-navy/10"
              >
                <span className="h-2 w-2 rounded-full bg-orange" />
                {t}
              </span>
            ))}
          </div>
          <span className="absolute -left-3 bottom-6 hidden items-center gap-2 rounded-full bg-orange px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange/30 md:inline-flex">
            {mission.badgeLine}
          </span>
        </div>
      </div>
    </section>
  );
}
