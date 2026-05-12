"use client";

import { useEffect, useState } from "react";
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
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [trimmed]);

  if (trimmed && !imgFailed) {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden rounded-xl bg-white",
          dim,
          variant === "navbar" ? "shadow-sm ring-1 ring-navy/10" : "ring-1 ring-white/25",
        )}
      >
        <img
          src={trimmed}
          alt={logoAlt || "Logo"}
          className="absolute inset-0 h-full w-full object-contain p-0.5"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
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
