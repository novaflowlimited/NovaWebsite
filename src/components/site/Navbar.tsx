"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { BrandLogoMark } from "@/components/site/BrandLogoMark";
import { cn } from "@/lib/cn";
import type { SiteSettingsPayload } from "@/lib/site-settings-payload";

function navLinkActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  const base = href.endsWith("/") ? href.slice(0, -1) : href;
  if (pathname === base) return true;
  return pathname.startsWith(`${base}/`);
}

export function Navbar({ settings }: { settings: SiteSettingsPayload }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { navbar, companyName, brand } = settings;

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogoMark logoUrl={brand.logoUrl} logoAlt={brand.logoAlt} variant="navbar" />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-navy">{companyName}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-fg">{navbar.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navbar.desktopLinks.map((l, i) => {
            const active = navLinkActive(l.href, pathname);
            return (
              <Link
                key={`${l.href}-${i}`}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm font-semibold transition-colors",
                  active
                    ? "text-orange after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-orange"
                    : "text-navy/85 hover:text-orange",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href={navbar.ctaHref}
            className={buttonClassName("primary", "rounded-full px-5 py-2 text-sm shadow-orange/20 shadow-lg")}
          >
            {navbar.ctaLabel}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-navy md:hidden"
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="site-mobile-nav"
        inert={!open}
        className={cn(
          "border-t border-navy/10 bg-white transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navbar.mobileLinks.map((l) => {
            const active = navLinkActive(l.href, pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-orange/12 text-orange" : "text-navy hover:bg-cream",
                )}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href={navbar.ctaHref}
            onClick={() => setOpen(false)}
            className={buttonClassName("primary", "mt-2 block w-full rounded-full text-center")}
          >
            {navbar.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
