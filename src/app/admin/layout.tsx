"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { getStoredToken, setStoredToken } from "@/lib/api-client";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/site-settings", label: "Site settings" },
  { href: "/admin/client-logos", label: "Client logos" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/impact", label: "Impact" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/jobs", label: "Jobs" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(path === "/admin/login");

  useEffect(() => {
    startTransition(() => {
      if (path === "/admin/login") {
        setReady(true);
        return;
      }
      if (!getStoredToken()) {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    });
  }, [path, router]);

  if (path === "/admin/login") {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-56 shrink-0 flex-col bg-navy-dark text-white">
        <div className="border-b border-white/10 p-4">
          <p className="text-sm font-bold">Novaflow Admin</p>
          <p className="text-xs text-white/60">CMS</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                path === l.href || path.startsWith(l.href + "/")
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-xs">
          <p className="truncate text-white/60">Signed in</p>
          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-white/10 py-2 text-left font-semibold text-white hover:bg-white/20"
            onClick={() => {
              setStoredToken(null);
              router.push("/admin/login");
            }}
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="max-h-screen flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
