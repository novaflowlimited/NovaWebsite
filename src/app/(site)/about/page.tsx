import Image from "next/image";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { resolvedRouteMetadata } from "@/lib/seo-from-settings";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, TeamMember } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolvedRouteMetadata(
    "About",
    "Meet the Novaflow team and learn how we build digital opportunity for Kenyan businesses and communities.",
    "/about",
  );
}

const values = [
  { title: "Innovation", body: "We ship pragmatic technology that solves real Kenyan problems." },
  { title: "Community", body: "Our roadmap is shaped by the people we serve—from CBD to the last mile." },
  { title: "Reliability", body: "Billing, POS, and networks have to work when the power and politics do not." },
  { title: "Integrity", body: "Transparent pricing, honest timelines, and accountable delivery." },
];

export default async function AboutPage() {
  let team: TeamMember[] = [];
  try {
    const res = await publicFetch<ApiListResponse<TeamMember>>("/api/team", {
      next: { tags: [CACHE_TAGS.team] },
    });
    team = res.data;
  } catch (e) {
    const msg = e instanceof ApiError ? `Unable to load team (${e.status}).` : "Unable to load team.";
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <ErrorRetry message={msg} />
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-navy/10 bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-4xl font-bold text-navy md:text-5xl">Built in Kenya, Built for Kenya</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy/75">
            Novaflow combines SaaS products, automation, IoT, and field connectivity with a mission to connect
            rural institutions that power daily life.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeader title="Our story" subtitle="From billing desks to community towers, we build with operators and citizens in mind." />
        <p className="mx-auto mt-6 max-w-3xl text-navy/80">
          We started by solving ISP revenue leakage and retail checkout friction. Today we also light up
          schools and clinics with connectivity—because digital transformation is incomplete if it stops at the
          town boundary.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold text-navy">Mission</h3>
            <p className="mt-2 text-sm text-navy/75">
              Deliver dependable software and networks that expand economic opportunity and public service
              delivery across Kenya.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-navy">Vision</h3>
            <p className="mt-2 text-sm text-navy/75">
              A Kenya where every business can scale digitally and every community can access the internet as
              foundational infrastructure.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeader title="Team" align="center" className="mb-10" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <Card key={m.id}>
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-navy/10">
                  {m.photo ? (
                    <Image src={m.photo} alt="" fill className="object-cover" sizes="112px" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-2xl font-bold text-navy">
                      {m.name[0]}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-center text-lg font-bold text-navy">{m.name}</h3>
                <p className="text-center text-sm text-orange">{m.role}</p>
                <p className="mt-3 line-clamp-4 text-center text-sm text-navy/70">{m.bio}</p>
                <div className="mt-4 flex justify-center gap-3 text-xs font-semibold">
                  {m.linkedin ? (
                    <a href={m.linkedin} className="text-navy-light hover:underline" target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  ) : null}
                  {m.twitter ? (
                    <a href={m.twitter} className="text-navy-light hover:underline" target="_blank" rel="noreferrer">
                      X / Twitter
                    </a>
                  ) : null}
                  {m.email ? (
                    <a href={`mailto:${m.email}`} className="text-navy-light hover:underline">
                      Email
                    </a>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeader title="Values" align="center" className="mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title}>
              <h3 className="font-bold text-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-navy/70">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
