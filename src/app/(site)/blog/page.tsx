import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { resolvedRouteMetadata } from "@/lib/seo-from-settings";
import { publicFetch } from "@/lib/public-fetch";
import type { PaginatedPosts } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolvedRouteMetadata(
    "Blog",
    "Updates on products, connectivity programs, and policy from Novaflow.",
    "/blog",
  );
}

type Props = { searchParams?: Promise<{ page?: string; category?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const page = Math.max(Number(sp.page ?? "1"), 1);
  const category = sp.category;

  let res: PaginatedPosts;
  let allForCats: PaginatedPosts;
  try {
    const qs = new URLSearchParams();
    qs.set("limit", "9");
    qs.set("page", String(page));
    if (category) qs.set("category", category);
    const postsTag = { next: { tags: [CACHE_TAGS.posts] } };
    [res, allForCats] = await Promise.all([
      publicFetch<PaginatedPosts>(`/api/posts?${qs.toString()}`, postsTag),
      publicFetch<PaginatedPosts>("/api/posts?limit=100&page=1", postsTag),
    ]);
  } catch (e) {
    const msg = e instanceof ApiError ? `Unable to load posts (${e.status}).` : "Unable to load posts.";
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <ErrorRetry message={msg} />
      </div>
    );
  }

  const categories = Array.from(new Set(allForCats.data.map((p) => p.category))).sort();

  return (
    <div className="bg-cream">
      <section className="border-b border-navy/10 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="text-4xl font-bold text-navy">Blog</h1>
          <p className="mt-3 max-w-2xl text-navy/70">Updates on products, connectivity programs, and policy.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              !category ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                category === c ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {res.data.length === 0 ? (
          <p className="mt-12 text-center text-navy/60">No posts match this filter.</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {res.data.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <Card className="h-full overflow-hidden p-0 hover:border-orange/30">
                  <div className="relative aspect-[16/10] bg-white">
                    {p.coverImage ? (
                      <Image src={p.coverImage} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <Badge tone="neutral">{p.category}</Badge>
                    <h2 className="mt-2 text-lg font-bold text-navy">{p.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-navy/70">{p.excerpt}</p>
                    <p className="mt-3 text-xs text-navy/50">
                      {new Date(p.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <span className="mt-3 inline-block text-sm font-semibold text-orange">Read more →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center gap-4">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy ring-1 ring-navy/15"
            >
              Previous
            </Link>
          ) : null}
          {res.hasMore ? (
            <Link
              href={`/blog?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
              className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white"
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
