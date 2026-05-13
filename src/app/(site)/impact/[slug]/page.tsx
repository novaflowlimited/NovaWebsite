import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import { canonicalUrl, clipDescription } from "@/lib/seo";
import { siteTitleEntity } from "@/lib/seo-from-settings";
import { getSiteSettings } from "@/lib/site-settings";
import type { ApiItemResponse, ApiListResponse, CommunityStory } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await publicFetch<ApiItemResponse<CommunityStory>>(`/api/impact/stories/${slug}`, {
      next: { tags: [CACHE_TAGS.impactStories] },
    });
    const story = res.data;
    const entity = siteTitleEntity(await getSiteSettings());
    const description = clipDescription(story.excerpt || story.content);
    const url = canonicalUrl(`/impact/${story.slug}`);
    const fullTitle = `${story.title} | ${entity}`;
    return {
      title: story.title,
      description,
      alternates: { canonical: url },
      openGraph: {
        url,
        title: fullTitle,
        description,
        ...(story.coverImage ? { images: [{ url: story.coverImage }] } : {}),
      },
      twitter: { title: fullTitle, description, ...(story.coverImage ? { images: [story.coverImage] } : {}) },
    };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return { title: "Not found", robots: { index: false, follow: false } };
    }
    throw e;
  }
}

export default async function ImpactStoryPage({ params }: Props) {
  const { slug } = await params;
  let story: CommunityStory;
  try {
    const res = await publicFetch<ApiItemResponse<CommunityStory>>(`/api/impact/stories/${slug}`, {
      next: { tags: [CACHE_TAGS.impactStories] },
    });
    story = res.data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const allRes = await publicFetch<ApiListResponse<CommunityStory>>("/api/impact/stories", {
    next: { tags: [CACHE_TAGS.impactStories] },
  });
  const related = allRes.data
    .filter((s) => s.id !== story.id)
    .filter((s) => s.county === story.county || s.category === story.category)
    .slice(0, 3);

  return (
    <article>
      <div className="relative aspect-[21/9] bg-navy-dark">
        {story.coverImage ? (
          <Image src={story.coverImage} alt="" fill className="object-cover opacity-90" priority sizes="100vw" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 pb-10 text-white md:px-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="orange">{story.category.replaceAll("_", " ")}</Badge>
            <Badge tone="neutral">{story.county}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{story.title}</h1>
          <p className="mt-2 text-sm text-white/80">
            {story.location} · Beneficiary: {story.beneficiary}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <div className="whitespace-pre-wrap text-base leading-relaxed text-navy/90">{story.content}</div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-navy/10 bg-cream py-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-xl font-bold text-navy">Related stories</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((s) => (
                <Link key={s.id} href={`/impact/${s.slug}`} className="group block">
                  <Card className="h-full overflow-hidden p-0 hover:border-orange/30">
                    <div className="relative aspect-[3/2] bg-navy/5">
                      {s.coverImage ? (
                        <Image
                          src={s.coverImage}
                          alt=""
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-navy">{s.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-navy/65">{s.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
