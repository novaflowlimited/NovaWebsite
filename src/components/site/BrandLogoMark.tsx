"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "navbar" | "footer";

type Size = "sm" | "md";

const sizeClass: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-9 w-9",
};

/** When `logoUrl` is empty, shows the “N” monogram (navbar navy / footer orange). */
export function BrandLogoMark({
  logoUrl,
  logoAlt,
  variant,
  size = "md",
}: {
  logoUrl: string;
  logoAlt: string;
  variant: Variant;
  size?: Size;
}) {
  const trimmed = logoUrl?.trim();
  const dim = sizeClass[size];

  if (trimmed) {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden rounded-xl bg-white",
          dim,
          variant === "navbar" ? "shadow-sm ring-1 ring-navy/10" : "ring-1 ring-white/25",
        )}
      >
        <Image
          src={trimmed}
          alt={logoAlt || "Logo"}
          fill
          className="object-contain p-0.5"
          sizes={size === "sm" ? "24px" : "36px"}
        />
      </span>
    );
  }

  if (variant === "navbar") {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light text-base font-black text-white shadow-sm",
          dim,
          size === "sm" && "text-[10px]",
        )}
        aria-hidden
      >
        N
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-soft text-base font-black text-white",
        dim,
        size === "sm" && "text-[10px]",
      )}
      aria-hidden
    >
      N
    </span>
  );
}
