import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import { formatKes } from "@/lib/format";
import type { ApiItemResponse, ServiceDto } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  let res: ApiItemResponse<ServiceDto>;
  try {
    res = await publicFetch<ApiItemResponse<ServiceDto>>(`/api/services/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  const s = res.data;
  const isCustom = s.pricingType === "CUSTOM";

  return (
    <article className="bg-cream">
      <section className="border-b border-navy/10 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Badge tone="navy">{s.category}</Badge>
          <h1 className="mt-4 text-4xl font-bold text-navy md:text-5xl">{s.name}</h1>
          <p className="mt-4 text-xl text-navy/75">{s.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 md:px-6">
        <section>
          <h2 className="text-xl font-bold text-navy">Overview</h2>
          <p className="mt-3 text-navy/80">{s.description}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">Features</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {s.features.map((f) => (
              <li key={f} className="flex gap-2 rounded-xl bg-white px-4 py-3 text-sm text-navy ring-1 ring-navy/10">
                <span className="text-orange">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">Pricing</h2>
          {isCustom ? (
            <Card className="mt-4">
              <p className="text-navy/80">This solution uses custom pricing based on your footprint and integrations.</p>
              <Link href="/contact" className={buttonClassName("primary", "mt-6 inline-flex rounded-full")}>
                Contact Sales
              </Link>
            </Card>
          ) : s.plans.length === 0 ? (
            <p className="mt-4 text-navy/65">No public plans listed. Contact us for a quote.</p>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {s.plans.map((p) => (
                <Card
                  key={p.id}
                  className={p.isPopular ? "border-2 border-orange shadow-lg ring-2 ring-orange/20" : ""}
                >
                  {p.isPopular ? (
                    <span className="mb-2 inline-block rounded-full bg-orange px-3 py-0.5 text-xs font-bold text-white">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                  <p className="mt-2 text-2xl font-black text-orange">{formatKes(p.priceKes)}</p>
                  <p className="text-xs uppercase tracking-wide text-navy/50">
                    {p.interval === "ANNUAL" ? "per year" : "per month"}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-navy/75">
                    {p.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className={buttonClassName("primary", "mt-6 block w-full rounded-full text-center")}>
                    Get Started
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
