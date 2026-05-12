import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, JobDto, JobType } from "@/types";

type Props = { searchParams?: Promise<{ dept?: string; type?: string }> };

export default async function CareersPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const dept = sp.dept;
  const type = sp.type as JobType | undefined;

  let jobs: JobDto[] = [];
  try {
    const res = await publicFetch<ApiListResponse<JobDto>>("/api/jobs");
    jobs = res.data;
  } catch (e) {
    const msg = e instanceof ApiError ? `Unable to load jobs (${e.status}).` : "Unable to load jobs.";
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <ErrorRetry message={msg} />
      </div>
    );
  }

  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const types = Array.from(new Set(jobs.map((j) => j.type))) as JobType[];

  const filtered = jobs.filter((j) => {
    if (dept && j.department !== dept) return false;
    if (type && j.type !== type) return false;
    return true;
  });

  return (
    <div className="bg-cream">
      <section className="border-b border-navy/10 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-4xl font-bold text-navy md:text-5xl">Join the Team Building Kenya&apos;s Digital Future</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy/75">
            Engineers, field technicians, and customer champions—help us ship products and connectivity that matter.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
          <span className="text-sm font-semibold text-navy">Department:</span>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/careers"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                !dept ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
              }`}
            >
              All
            </Link>
            {departments.map((d) => (
              <Link
                key={d}
                href={`/careers?dept=${encodeURIComponent(d)}${type ? `&type=${type}` : ""}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  dept === d ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
                }`}
              >
                {d}
              </Link>
            ))}
          </div>
          <span className="text-sm font-semibold text-navy md:ml-6">Type:</span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/careers${dept ? `?dept=${encodeURIComponent(dept)}` : ""}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                !type ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
              }`}
            >
              All
            </Link>
            {types.map((t) => (
              <Link
                key={t}
                href={`/careers?${new URLSearchParams({ ...(dept ? { dept } : {}), type: t }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  type === t ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
                }`}
              >
                {t.replaceAll("_", " ")}
              </Link>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-12 text-center">
            <h2 className="text-lg font-bold text-navy">No open roles match these filters</h2>
            <p className="mt-2 text-sm text-navy/70">
              We are always meeting exceptional people. Send your CV and a short note to{" "}
              <a href="mailto:careers@novaflow.co.ke" className="font-semibold text-orange underline">
                careers@novaflow.co.ke
              </a>{" "}
              and we will get back to you when a fit opens.
            </p>
          </Card>
        ) : (
          <div className="mt-10 grid gap-6">
            {filtered.map((j) => (
              <Link key={j.id} href={`/careers/${j.slug}`}>
                <Card className="transition hover:border-orange/40">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="navy">{j.department}</Badge>
                    <Badge tone="neutral">{j.type.replaceAll("_", " ")}</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-navy">{j.title}</h2>
                  <p className="mt-1 text-sm text-navy/65">{j.location}</p>
                  {j.closingDate ? (
                    <p className="mt-2 text-xs text-navy/50">
                      Closes {new Date(j.closingDate).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-block text-sm font-semibold text-orange">View role →</span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
