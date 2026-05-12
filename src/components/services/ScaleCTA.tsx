import Link from "next/link";
import { IconArrowRight } from "@/components/ui/Icons";

export function ScaleCTA() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange via-orange to-orange-soft px-8 py-12 text-white shadow-xl shadow-orange/20 md:px-12 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-navy/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                Scale your business with modern infrastructure.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
                Powerful software. Reliable connectivity. Real results.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-navy shadow-lg ring-2 ring-white/90 transition-colors duration-200 hover:bg-navy hover:text-white hover:ring-navy"
            >
              Book a Demo
              <IconArrowRight
                className="h-4 w-4 shrink-0 text-navy transition-colors group-hover:text-white"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
