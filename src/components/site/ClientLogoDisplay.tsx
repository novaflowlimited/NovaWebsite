"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ClientLogo } from "@/types";

const LOAD_TIMEOUT_MS = 12_000;

/** Renders CMS `logoUrl` when set; otherwise the organization name as styled text. */
export function ClientLogoDisplay({
  logo,
  className = "",
}: {
  logo: ClientLogo;
  className?: string;
}) {
  const url = logo.logoUrl?.trim();
  const [useText, setUseText] = useState(!url);
  const loadedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    loadedRef.current = false;
    setUseText(!url);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!url) return;

    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      loadedRef.current = true;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (!loadedRef.current) setUseText(true);
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [url]);

  if (!url || useText) {
    return (
      <span
        className={`text-base font-extrabold tracking-tight text-navy/70 opacity-80 transition hover:text-navy hover:opacity-100 md:text-lg ${className}`}
        style={{
          fontFeatureSettings: '"ss01"',
          letterSpacing: "-0.02em",
        }}
      >
        {logo.name}
      </span>
    );
  }

  return (
    <span className={`relative inline-block h-9 w-[min(100%,160px)] md:h-11 md:w-[180px] ${className}`}>
      <img
        ref={imgRef}
        src={url}
        alt={logo.name}
        className="absolute inset-0 h-full w-full object-contain object-center"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => {
          loadedRef.current = true;
          setUseText(false);
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
          setUseText(true);
        }}
      />
    </span>
  );
}
