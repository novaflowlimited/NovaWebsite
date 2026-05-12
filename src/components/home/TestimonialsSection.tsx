import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";
import type { ApiListResponse, Testimonial } from "@/types";

export async function TestimonialsSection({ settings }: { settings: SiteSettingsPayload }) {
  const { testimonials: t } = settings;
  let testimonials: Testimonial[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<Testimonial>>("/api/testimonials?featured=true");
    testimonials = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load testimonials (${e.status}).` : "Unable to load testimonials.";
  }

  if (!err && !testimonials.length) return null;

  return (
    <section className="bg-cream/40 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} align="center" className="mb-12" />
        {err ? (
          <ErrorRetry message={err} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="relative flex flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-sm md:p-7"
              >
                <span
                  aria-hidden
                  className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-white shadow"
                >
                  <QuoteGlyph />
                </span>
                <div className="flex gap-0.5 text-orange" aria-label={`Rating ${item.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} aria-hidden>
                      {i < item.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-navy/80">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-navy/5 pt-5">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-navy to-navy-light text-sm font-bold text-white">
                    {item.companyLogo ? (
                      <Image src={item.companyLogo} alt="" fill className="object-cover" sizes="44px" />
                    ) : (
                      <span>{initials(item.clientName)}</span>
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-navy">{item.clientName}</p>
                    <p className="text-xs text-navy/60">
                      {item.clientRole}
                      {item.company ? `, ${item.company}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M9 7H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3v2c2.8 0 5-2.2 5-5V7Zm12 0h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3v2c2.8 0 5-2.2 5-5V7Z" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
