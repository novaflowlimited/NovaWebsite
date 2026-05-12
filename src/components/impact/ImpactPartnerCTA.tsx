import Image from "next/image";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

const partners = ["NGOs", "County Governments", "Donors", "Schools", "Community Groups"];

export function ImpactPartnerCTA({ impact }: { impact: SiteSettingsPayload["impact"] }) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-xl shadow-navy/10">
          <div className="absolute inset-0">
            <Image
              src={impact.partnerCtaBgUrl}
              alt={impact.partnerCtaBgAlt}
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
          </div>

          <div className="relative grid items-center gap-8 px-6 py-10 md:grid-cols-[1.3fr,0.7fr] md:px-12 md:py-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Get Involved</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Partner with us to
                <br />
                expand digital access.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/80 md:text-base">
                We work with NGOs, county governments, donors and organizations to bring connectivity
                where it&apos;s needed most.
              </p>
              <Link
                href="/contact"
                className={buttonClassName(
                  "primary",
                  "mt-7 inline-flex rounded-full px-6 py-3 text-sm shadow-lg shadow-orange/30",
                )}
              >
                Become a Partner
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative border-t border-white/15 px-6 py-5 md:px-12">
            <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wider text-white/75 md:text-sm">
              {partners.map((p) => (
                <li key={p} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
