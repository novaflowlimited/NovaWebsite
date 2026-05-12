import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import { canonicalUrl, clipDescription, SITE_NAME } from "@/lib/seo";
import type { ApiItemResponse, JobDto } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await publicFetch<ApiItemResponse<JobDto>>(`/api/jobs/${slug}`, {
      next: { tags: [CACHE_TAGS.jobs] },
    });
    const job = res.data;
    const description = clipDescription(`${job.title} — ${job.department}, ${job.location}. ${job.description}`);
    const url = canonicalUrl(`/careers/${job.slug}`);
    const fullTitle = `${job.title} | ${SITE_NAME}`;
    return {
      title: job.title,
      description,
      alternates: { canonical: url },
      openGraph: { url, title: fullTitle, description },
      twitter: { title: fullTitle, description },
    };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return { title: "Not found", robots: { index: false, follow: false } };
    }
    throw e;
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  let job: JobDto;
  try {
    const res = await publicFetch<ApiItemResponse<JobDto>>(`/api/jobs/${slug}`, {
      next: { tags: [CACHE_TAGS.jobs] },
    });
    job = res.data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const mail = `mailto:careers@novaflow.co.ke?subject=${encodeURIComponent(`Application: ${job.title}`)}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="flex flex-wrap gap-2">
        <Badge tone="navy">{job.department}</Badge>
        <Badge tone="neutral">{job.type.replaceAll("_", " ")}</Badge>
        <Badge tone="orange">{job.location}</Badge>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-navy md:text-4xl">{job.title}</h1>
      {job.salary ? <p className="mt-2 text-sm text-navy/65">Compensation: {job.salary}</p> : null}
      {job.closingDate ? (
        <p className="mt-1 text-xs text-navy/50">
          Closing date: {new Date(job.closingDate).toLocaleDateString("en-KE", { dateStyle: "long" })}
        </p>
      ) : null}

      <a href={mail} className={buttonClassName("primary", "mt-8 inline-flex rounded-full px-8")}>
        Apply
      </a>

      <Card className="mt-10">
        <h2 className="font-bold text-navy">About the role</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-navy/80">{job.description}</p>
      </Card>

      <Card className="mt-6">
        <h2 className="font-bold text-navy">Requirements</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-navy/80">
          {job.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="font-bold text-navy">Benefits</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-navy/80">
          {job.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Card>

      <p className="mt-10 text-sm text-navy/65">
        <Link href="/careers" className="text-orange hover:underline">
          ← All openings
        </Link>
      </p>
    </article>
  );
}
