import Image from "next/image";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

export function ImpactHero({ impact }: { impact: SiteSettingsPayload["impact"] }) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      <div className="absolute inset-0">
        <Image
          src={impact.heroBgUrl}
          alt={impact.heroBgAlt}
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/55" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Our Impact</p>
          <h1 className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Connecting communities.
            <br />
            <span className="text-orange">Changing lives.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            We bring internet infrastructure and free public WiFi to underserved communities across
            Kenya.
          </p>
          <div className="mt-8">
            <Link
              href="#stories"
              className={buttonClassName(
                "primary",
                "rounded-full px-7 py-3 text-sm shadow-lg shadow-orange/30",
              )}
            >
              Explore Stories
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
