import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiItemResponse, PaginatedPosts, PostDto } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: PostDto;
  try {
    const res = await publicFetch<ApiItemResponse<PostDto>>(`/api/posts/${slug}`);
    post = res.data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const list = await publicFetch<PaginatedPosts>("/api/posts?limit=20&page=1");
  const related = list.data.filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))).slice(0, 3);

  return (
    <article>
      <div className="relative aspect-[21/9] bg-navy">
        {post.coverImage ? (
          <Image src={post.coverImage} alt="" fill className="object-cover opacity-90" priority sizes="100vw" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-10 text-white md:px-6">
          <Badge tone="orange">{post.category}</Badge>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">{post.title}</h1>
          <p className="mt-2 text-sm text-white/75">
            {new Date(post.createdAt).toLocaleDateString("en-KE", { dateStyle: "long" })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <p className="text-lg text-navy/80">{post.excerpt}</p>
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-navy/90">{post.content}</div>
        {post.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-navy">
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="border-t border-navy/10 bg-cream py-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-xl font-bold text-navy">Related posts</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <Card className="h-full hover:border-orange/30">
                    <h3 className="font-semibold text-navy">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-navy/65">{p.excerpt}</p>
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
