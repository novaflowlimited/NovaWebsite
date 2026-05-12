import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-fg">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-navy md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-lg text-navy/70">{subtitle}</p> : null}
    </div>
  );
}
