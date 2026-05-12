import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { PaginatedPosts, PostDto } from "@/types";

export async function BlogTeaserSection() {
  let res: PaginatedPosts;
  try {
    res = await publicFetch<PaginatedPosts>("/api/posts?limit=3", {
      next: { tags: [CACHE_TAGS.posts] },
    });
  } catch (e) {
    const msg = e instanceof ApiError ? `Unable to load posts (${e.status}).` : "Unable to load posts.";
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <ErrorRetry message={msg} />
      </section>
    );
  }
  const posts = res.data as PostDto[];
  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader eyebrow="Insights" title="Latest from our blog" className="mb-10" />
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((p) => (
          <Card key={p.id} className="overflow-hidden p-0">
            <div className="relative aspect-[16/10] bg-cream">
              {p.coverImage ? (
                <Image src={p.coverImage} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              ) : null}
            </div>
            <div className="p-6">
              <Badge tone="neutral">{p.category}</Badge>
              <h3 className="mt-3 text-lg font-bold text-navy">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-navy/70">{p.excerpt}</p>
              <Link href={`/blog/${p.slug}`} className="mt-4 inline-block text-sm font-semibold text-orange">
                Read more →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
