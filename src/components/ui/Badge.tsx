import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; tone?: "orange" | "navy" | "neutral" };

const tones = {
  orange: "bg-orange-soft/30 text-orange border border-orange/20",
  navy: "bg-navy-light/10 text-navy border border-navy/15",
  neutral: "bg-cream text-navy border border-navy/10",
};

export function Badge({ children, className, tone = "orange" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
