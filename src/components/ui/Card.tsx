import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; padding?: "md" | "lg" };

export function Card({ children, className, padding = "md" }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy/10 bg-white shadow-sm",
        padding === "lg" ? "p-8" : "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
