import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconArrowRight } from "@/components/ui/Icons";
import type { CommunityStory, StoryCategory } from "@/types";

const CAT_BADGE: Record<StoryCategory, { label: string; bg: string; text: string }> = {
  SCHOOLS: { label: "Education", bg: "bg-orange/15", text: "text-orange" },
  DISPENSARIES: { label: "Healthcare", bg: "bg-emerald-100", text: "text-emerald-700" },
  POLICE_STATIONS: { label: "Safety", bg: "bg-navy/10", text: "text-navy" },
  COMMUNITY_CENTERS: { label: "Opportunity", bg: "bg-sky-100", text: "text-sky-700" },
  OTHER: { label: "Impact", bg: "bg-cream", text: "text-navy" },
};

export function ImpactStories({ stories }: { stories: CommunityStory[] }) {
  if (!stories.length) return null;
  return (
    <section id="stories" className="bg-cream/30 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Community Impact Stories"
            title="Real stories. Real impact."
            className="md:max-w-xl"
          />
          <Link
            href="/impact"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition hover:gap-2.5"
          >
            View All Stories <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.slice(0, 3).map((s) => {
            const cat = CAT_BADGE[s.category];
            return (
              <Link
                key={s.id}
                href={`/impact/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                  {s.coverImage ? (
                    <Image
                      src={s.coverImage}
                      alt=""
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cat.bg} ${cat.text}`}
                  >
                    {cat.label}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-snug text-navy">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-navy/65">{s.excerpt}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-orange">Read story →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
