"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { ServiceCategory, ServiceDto } from "@/types";
import { ProductCard } from "./ProductCard";

const TABS: { key: ServiceCategory | "ALL"; label: string }[] = [
  { key: "ALL", label: "All Solutions" },
  { key: "SOFTWARE", label: "Software" },
  { key: "AUTOMATION", label: "Automation" },
  { key: "IOT", label: "IoT" },
  { key: "CONNECTIVITY", label: "Connectivity" },
];

export function ServicesTabsGrid({ services }: { services: ServiceDto[] }) {
  const [active, setActive] = useState<ServiceCategory | "ALL">("ALL");

  const visible = useMemo(
    () => (active === "ALL" ? services : services.filter((s) => s.category === active)),
    [active, services],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:px-3.5 sm:py-2 sm:text-[13px]",
              active === t.key
                ? "bg-navy text-white shadow-md shadow-navy/20"
                : "bg-white text-navy/80 ring-1 ring-navy/10 hover:bg-cream hover:text-navy",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
        {visible.map((s) => (
          <ProductCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
