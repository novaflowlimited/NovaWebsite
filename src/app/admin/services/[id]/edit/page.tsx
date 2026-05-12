"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch } from "@/lib/api-client";
import { slugifyTitle } from "@/lib/admin/upload";
import type { ApiItemResponse, PlanDto, PlanInterval, PricingType, ServiceCategory, ServiceDto } from "@/types";

const categories: ServiceCategory[] = ["SOFTWARE", "CONNECTIVITY", "AUTOMATION", "IOT"];

export default function AdminServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("layers");
  const [category, setCategory] = useState<ServiceCategory>("SOFTWARE");
  const [pricingType, setPricingType] = useState<PricingType>("FIXED");
  const [published, setPublished] = useState(true);
  const [features, setFeatures] = useState<string[]>([""]);
  const [plans, setPlans] = useState<
    { name: string; priceKes: number; interval: PlanInterval; features: string; isPopular: boolean }[]
  >([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch<ApiItemResponse<ServiceDto>>(`/api/services/admin/${id}`);
      if (cancelled) return;
      const s = res.data;
      setName(s.name);
      setSlug(s.slug);
      setTagline(s.tagline);
      setDescription(s.description);
      setIcon(s.icon);
      setCategory(s.category);
      setPricingType(s.pricingType);
      setPublished(s.published);
      setFeatures(s.features.length ? s.features : [""]);
      setPlans(
        s.plans.length
          ? s.plans.map((p: PlanDto) => ({
              name: p.name,
              priceKes: p.priceKes,
              interval: p.interval,
              features: p.features.join(", "),
              isPopular: p.isPopular,
            }))
          : [{ name: "Plan", priceKes: 0, interval: "MONTHLY" as const, features: "", isPopular: false }],
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Edit service</h1>
        <Link href="/admin/services" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Slug</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Tagline</label>
            <input
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy">Icon key</label>
              <input
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Pricing type</label>
            <select
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value as PricingType)}
            >
              <option value="FIXED">FIXED</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-navy">Features</label>
              <button type="button" className="text-xs text-orange" onClick={() => setFeatures([...features, ""])}>
                + Add
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {features.map((f, i) => (
                <input
                  key={i}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
                  value={f}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = e.target.value;
                    setFeatures(next);
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-navy">Plans</label>
              <button
                type="button"
                className="text-xs text-orange"
                onClick={() =>
                  setPlans([...plans, { name: "", priceKes: 0, interval: "MONTHLY", features: "", isPopular: false }])
                }
              >
                + Add plan
              </button>
            </div>
            <div className="mt-2 space-y-4">
              {plans.map((p, i) => (
                <div key={i} className="rounded-lg border border-navy/10 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      placeholder="Plan name"
                      className="rounded border border-navy/15 px-2 py-1 text-sm"
                      value={p.name}
                      onChange={(e) => {
                        const n = [...plans];
                        n[i] = { ...n[i], name: e.target.value };
                        setPlans(n);
                      }}
                    />
                    <input
                      type="number"
                      className="rounded border border-navy/15 px-2 py-1 text-sm"
                      value={p.priceKes}
                      onChange={(e) => {
                        const n = [...plans];
                        n[i] = { ...n[i], priceKes: Number(e.target.value) };
                        setPlans(n);
                      }}
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <select
                      className="rounded border border-navy/15 px-2 py-1 text-sm"
                      value={p.interval}
                      onChange={(e) => {
                        const n = [...plans];
                        n[i] = { ...n[i], interval: e.target.value as PlanInterval };
                        setPlans(n);
                      }}
                    >
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="ANNUAL">ANNUAL</option>
                    </select>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={p.isPopular}
                        onChange={(e) => {
                          const n = [...plans];
                          n[i] = { ...n[i], isPopular: e.target.checked };
                          setPlans(n);
                        }}
                      />
                      Popular
                    </label>
                  </div>
                  <input
                    placeholder="Plan features (comma)"
                    className="mt-2 w-full rounded border border-navy/15 px-2 py-1 text-sm"
                    value={p.features}
                    onChange={(e) => {
                      const n = [...plans];
                      n[i] = { ...n[i], features: e.target.value };
                      setPlans(n);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await apiFetch(`/api/services/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    name,
                    slug: slug || slugifyTitle(name),
                    tagline,
                    description,
                    icon,
                    category,
                    pricingType,
                    published,
                    features: features.map((f) => f.trim()).filter(Boolean),
                    plans: plans
                      .filter((p) => p.name.trim())
                      .map((p) => ({
                        name: p.name,
                        priceKes: p.priceKes,
                        interval: p.interval,
                        isPopular: p.isPopular,
                        features: p.features
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })),
                  }),
                });
                router.push("/admin/services");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
