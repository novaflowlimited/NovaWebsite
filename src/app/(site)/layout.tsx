import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { getSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
