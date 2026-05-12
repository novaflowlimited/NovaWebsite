"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Variant = "navbar" | "footer";

type Size = "sm" | "md";

const sizeClass: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-9 w-9",
};

const LOAD_TIMEOUT_MS = 12_000;

/** When `logoUrl` is empty or the image fails to load, shows the “N” monogram. */
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
  const [useFallback, setUseFallback] = useState(false);
  const loadedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    loadedRef.current = false;
    setUseFallback(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!trimmed) return;

    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      loadedRef.current = true;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (!loadedRef.current) setUseFallback(true);
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [trimmed]);

  const monogramNavbar = (
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

  const monogramFooter = (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-base font-black text-white shadow-sm backdrop-blur-sm",
        dim,
        size === "sm" && "text-[10px]",
      )}
      aria-hidden
    >
      N
    </span>
  );

  if (!trimmed || useFallback) {
    return variant === "navbar" ? monogramNavbar : monogramFooter;
  }

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-xl bg-white",
        dim,
        variant === "navbar" ? "shadow-sm ring-1 ring-navy/10" : "ring-1 ring-white/25",
      )}
    >
      <img
        ref={imgRef}
        src={trimmed}
        alt={logoAlt || "Logo"}
        className="absolute inset-0 h-full w-full object-contain p-0.5"
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => {
          loadedRef.current = true;
          setUseFallback(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onError={() => {
          loadedRef.current = true;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setUseFallback(true);
        }}
      />
    </span>
  );
}
