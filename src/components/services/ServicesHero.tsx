import Link from "next/link";
import { BrandLogoMark } from "@/components/site/BrandLogoMark";
import { buttonClassName } from "@/components/ui/Button";
import { IconArrowRight, IconChart, IconSparkle } from "@/components/ui/Icons";

export function ServicesHero({
  brand,
  companyName,
}: {
  brand: { logoUrl: string; logoAlt: string };
  companyName: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream/60 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-navy/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr,1fr] md:px-6 md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Products & Services</p>
          <h1 className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-navy md:text-5xl lg:text-6xl">
            Powerful technology
            <br />
            built for
            <br />
            <span className="text-orange">African businesses.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/70 md:text-lg">
            From ISP operations to AI automation, Novaflow provides enterprise-grade tools designed for
            growth, reliability and scale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#products"
              className={buttonClassName("primary", "rounded-full px-7 py-3 text-sm shadow-lg shadow-orange/25")}
            >
              Explore Products
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={buttonClassName(
                "ghost",
                "rounded-full border border-navy/15 bg-white px-7 py-3 text-sm text-navy hover:bg-cream",
              )}
            >
              Book Demo
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <DashboardMock brand={brand} companyName={companyName} />
        </div>
      </div>
    </section>
  );
}

function DashboardMock({
  brand,
  companyName,
}: {
  brand: { logoUrl: string; logoAlt: string };
  companyName: string;
}) {
  return (
    <div className="relative aspect-[5/4] w-full">
      <div className="absolute inset-x-2 top-2 rounded-2xl border border-navy/10 bg-white p-4 shadow-xl shadow-navy/10">
        <div className="flex items-center gap-2 pb-3">
          <BrandLogoMark logoUrl={brand.logoUrl} logoAlt={brand.logoAlt} variant="navbar" size="sm" />
          <span className="text-xs font-bold text-navy">{companyName}</span>
          <span className="ml-auto text-[10px] font-semibold text-navy/45">Dashboard Overview</span>
        </div>

        <div className="flex gap-3">
          <ul className="hidden flex-col gap-1.5 text-[10px] font-medium text-navy/55 sm:flex">
            {["Dashboard", "Customers", "Billing", "Reports", "Network", "Settings"].map((l, i) => (
              <li
                key={l}
                className={
                  i === 0
                    ? "rounded-md bg-cream px-2 py-1 text-navy"
                    : "rounded-md px-2 py-1 hover:bg-cream"
                }
              >
                {l}
              </li>
            ))}
          </ul>

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <KpiTile label="Customers" value="12,485" delta="+8%" />
              <KpiTile label="Revenue" value="KSh 8.4M" delta="+16.5%" highlight />
              <KpiTile label="Active Connections" value="98.6%" delta="+0.4%" />
            </div>
            <div className="rounded-xl bg-cream/60 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-navy/55">Revenue Trend</p>
              <ChartSpark />
            </div>
            <div className="rounded-xl bg-cream/60 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-wider text-navy/55">Recent Activity</p>
                <span className="text-[9px] font-semibold text-emerald-600">Live</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[10px] text-navy/70">
                <li className="flex justify-between">
                  <span>New subscriber — Mwingi</span>
                  <span className="text-navy/40">2m</span>
                </li>
                <li className="flex justify-between">
                  <span>M-Pesa payment — KSh 12,500</span>
                  <span className="text-navy/40">5m</span>
                </li>
                <li className="flex justify-between">
                  <span>WhatsApp ticket resolved</span>
                  <span className="text-navy/40">8m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating: 99.9% uptime */}
      <div className="absolute -bottom-2 left-4 flex items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-3 shadow-xl shadow-navy/10 backdrop-blur">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <IconChart className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold text-navy/55">Network Uptime</p>
          <p className="text-sm font-extrabold text-navy">99.9%</p>
        </div>
      </div>

      {/* Floating: AI Automations */}
      <div className="absolute -right-1 bottom-10 hidden items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-3 shadow-xl shadow-navy/10 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange/15 text-orange">
          <IconSparkle className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold text-navy/55">AI Automations</p>
          <p className="text-sm font-extrabold text-navy">1,246</p>
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  highlight,
}: {
  label: string;
  value: string;
  delta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl bg-navy p-2.5 text-white"
          : "rounded-xl bg-cream/70 p-2.5 ring-1 ring-navy/5"
      }
    >
      <p className={`text-[9px] font-semibold uppercase tracking-wider ${highlight ? "text-white/60" : "text-navy/55"}`}>
        {label}
      </p>
      <p className={`mt-0.5 text-sm font-extrabold ${highlight ? "text-white" : "text-navy"}`}>{value}</p>
      <p className={`text-[9px] font-semibold ${highlight ? "text-emerald-300" : "text-emerald-600"}`}>{delta}</p>
    </div>
  );
}

function ChartSpark() {
  return (
    <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full">
      <defs>
        <linearGradient id="servChart" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 45 L20 38 L40 42 L60 30 L80 35 L100 22 L120 25 L140 15 L160 18 L180 8 L200 12 L200 60 L0 60 Z"
        fill="url(#servChart)"
      />
      <path
        d="M0 45 L20 38 L40 42 L60 30 L80 35 L100 22 L120 25 L140 15 L160 18 L180 8 L200 12"
        stroke="#FF6B00"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
