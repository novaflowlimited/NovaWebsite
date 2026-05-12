"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { formatKes } from "@/lib/format";
import type { PlanDto, ServiceDto } from "@/types";

type Mode = "saas" | "license";

const compareFeatures = [
  { label: "Billing & invoicing", saas: { Starter: true, Professional: true, Enterprise: true }, license: true },
  { label: "M-Pesa integration", saas: { Starter: true, Professional: true, Enterprise: true }, license: true },
  { label: "Multi-user accounts", saas: { Starter: false, Professional: true, Enterprise: true }, license: true },
  { label: "API access", saas: { Starter: false, Professional: true, Enterprise: true }, license: false },
  { label: "Custom integrations", saas: { Starter: false, Professional: false, Enterprise: true }, license: false },
  { label: "Priority support", saas: { Starter: false, Professional: true, Enterprise: true }, license: false },
  { label: "Dedicated success manager", saas: { Starter: false, Professional: false, Enterprise: true }, license: false },
];

export function PricingClient({ services }: { services: ServiceDto[] }) {
  const [mode, setMode] = useState<Mode>("saas");

  const { saasPlans, licensePlan } = useMemo(() => {
    const flat = services.flatMap((s) => s.plans);
    const saas = flat.filter((p) => p.priceKes < 30000);
    const license = flat.find((p) => p.priceKes >= 30000) ?? null;
    const order: Record<string, number> = { Starter: 0, Professional: 1, Enterprise: 2 };
    saas.sort((a, b) => (order[a.name] ?? 99) - (order[b.name] ?? 99));
    return { saasPlans: saas.slice(0, 3), licensePlan: license };
  }, [services]);

  return (
    <section id="pricing" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Pricing</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-base text-navy/70">
            Choose the plan that&apos;s right for you. No hidden fees, Kenya Shilling pricing.
          </p>
        </div>

        {/* Toggle */}
        <div className="mx-auto mt-8 flex w-fit rounded-full border border-navy/10 bg-cream/60 p-1">
          <button
            type="button"
            onClick={() => setMode("saas")}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition",
              mode === "saas" ? "bg-navy text-white shadow" : "text-navy/65 hover:text-navy",
            )}
          >
            SaaS Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setMode("license")}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition",
              mode === "license" ? "bg-navy text-white shadow" : "text-navy/65 hover:text-navy",
            )}
          >
            One-Time License
          </button>
        </div>

        {/* Plans */}
        <div className="mt-12">
          {mode === "saas" ? (
            <SaaSPlans plans={saasPlans} />
          ) : (
            <LicensePlan plan={licensePlan} />
          )}
        </div>

        {/* Compare features */}
        <div className="mt-16">
          <h3 className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-navy/55">
            Compare Features
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-cream/40 text-left text-xs uppercase tracking-wider text-navy/65">
                <tr>
                  <th className="px-5 py-3 font-bold">Feature</th>
                  <th className="px-5 py-3 text-center font-bold">Starter</th>
                  <th className="px-5 py-3 text-center font-bold">Professional</th>
                  <th className="px-5 py-3 text-center font-bold">Enterprise</th>
                  <th className="px-5 py-3 text-center font-bold">License</th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, idx) => (
                  <tr key={row.label} className={idx % 2 ? "bg-cream/20" : ""}>
                    <td className="px-5 py-3 text-navy">{row.label}</td>
                    <FeatureCell on={row.saas.Starter} />
                    <FeatureCell on={row.saas.Professional} />
                    <FeatureCell on={row.saas.Enterprise} />
                    <FeatureCell on={row.license} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCell({ on }: { on: boolean }) {
  return (
    <td className="px-5 py-3 text-center">
      {on ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange/15 text-orange">
          <IconCheck className="h-4 w-4" strokeWidth={3} />
        </span>
      ) : (
        <span className="text-navy/30">—</span>
      )}
    </td>
  );
}

function SaaSPlans({ plans }: { plans: PlanDto[] }) {
  if (!plans.length) return <p className="text-center text-navy/60">Pricing coming soon.</p>;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((p) => (
        <PlanCard key={p.id} plan={p} highlighted={p.isPopular} />
      ))}
    </div>
  );
}

function PlanCard({ plan, highlighted }: { plan: PlanDto; highlighted: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition",
        highlighted
          ? "scale-[1.02] border-orange/40 shadow-xl shadow-orange/10 ring-2 ring-orange md:p-8"
          : "border-navy/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 md:p-8",
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          Most Popular
        </span>
      )}
      <h4 className="text-lg font-extrabold text-navy">{plan.name}</h4>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-black text-navy">{formatKes(plan.priceKes)}</span>
        <span className="text-sm font-medium text-navy/55">/mo</span>
      </div>
      <p className="mt-1 text-xs text-navy/55">
        {plan.isPopular ? "For growing teams" : plan.priceKes < 5000 ? "For small teams" : "For enterprise needs"}
      </p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-navy/80">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange">
              <IconCheck className="h-3 w-3" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={buttonClassName(
          highlighted ? "primary" : "outline",
          cn("mt-7 w-full rounded-full py-2.5 text-sm", !highlighted && "border-navy/15 text-navy hover:bg-cream"),
        )}
      >
        Get Started
      </Link>
    </div>
  );
}

function LicensePlan({ plan }: { plan: PlanDto | null }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative flex flex-col rounded-2xl border-2 border-orange bg-white p-8 shadow-xl shadow-orange/10">
        <span className="absolute -top-3 left-8 rounded-full bg-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          One-Time Payment
        </span>
        <h4 className="text-lg font-extrabold text-navy">Perpetual License</h4>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-black text-navy">
            {plan ? formatKes(plan.priceKes) : "KSh 45,000"}
          </span>
        </div>
        <p className="mt-1 text-xs text-navy/55">One-time payment</p>
        <ul className="mt-6 flex-1 space-y-2.5">
          {(plan?.features ?? [
            "Lifetime license",
            "Self-hosted",
            "1 year free updates",
            "Email support",
            "Per-terminal pricing",
          ]).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-navy/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange">
                <IconCheck className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className={buttonClassName("primary", "mt-7 w-full rounded-full py-2.5 text-sm")}
        >
          Get a Quote
        </Link>
      </div>
      <div className="rounded-2xl border border-navy/10 bg-cream/40 p-8">
        <h4 className="text-lg font-extrabold text-navy">Need something custom?</h4>
        <p className="mt-2 text-sm text-navy/70">
          We build bespoke deployments for ISPs, county governments, and enterprises with custom requirements.
          Volume discounts, integrations, and managed deployments available.
        </p>
        <Link
          href="/contact"
          className={buttonClassName(
            "outline",
            "mt-6 inline-flex rounded-full border-navy/15 px-6 py-2.5 text-sm text-navy hover:bg-white",
          )}
        >
          Talk to Sales
        </Link>
      </div>
    </div>
  );
}
