"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStat } from "@/types";

function useCountUp(target: number, durationMs: number, start: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setV(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, start]);
  return v;
}

function formatStatValue(label: string, value: number) {
  const lower = label.toLowerCase();
  if (lower.includes("uptime")) return `${value}.9%`;
  if (value >= 100) return `${value.toLocaleString("en-KE")}+`;
  return value.toLocaleString("en-KE");
}

function StatCell({ stat }: { stat: ImpactStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const display = useCountUp(stat.value, 1400, visible);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-black tracking-tight text-navy md:text-4xl">
        {formatStatValue(stat.label, display)}
      </p>
      <p className="mt-1.5 text-xs font-medium text-navy/60 md:text-sm">{stat.label}</p>
    </div>
  );
}

export function ImpactBannerClient({
  stats,
  statsStripEyebrow,
}: {
  stats: ImpactStat[];
  statsStripEyebrow: string;
}) {
  const eyebrow = statsStripEyebrow?.trim();
  return (
    <section className="bg-cream/60 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {eyebrow ? (
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-navy/55">{eyebrow}</p>
        ) : null}
        <div className="grid grid-cols-2 gap-y-8 rounded-2xl border border-navy/10 bg-white px-4 py-8 shadow-sm sm:grid-cols-3 md:grid-cols-6 md:px-6">
          {stats.map((s) => (
            <StatCell key={s.id} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
