import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { SiteJsonLd } from "@/components/site/SiteJsonLd";
import { buildSiteLayoutMetadata } from "@/lib/seo-from-settings";
import { getSiteSettings } from "@/lib/site-settings";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildSiteLayoutMetadata(settings);
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteJsonLd settings={settings} />
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
