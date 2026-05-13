import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { resolvedRouteMetadata } from "@/lib/seo-from-settings";
import { getSiteSettings } from "@/lib/site-settings";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, ServiceDto } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolvedRouteMetadata(
    "Contact",
    "Get in touch with Novaflow for demos, partnerships, and support across Kenya.",
    "/contact",
  );
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { footer } = settings;

  let services: ServiceDto[] = [];
  try {
    const res = await publicFetch<ApiListResponse<ServiceDto>>("/api/services", {
      next: { tags: [CACHE_TAGS.services] },
    });
    services = res.data;
  } catch (e) {
    const msg = e instanceof ApiError ? `Unable to load services (${e.status}).` : "Unable to load services.";
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <ErrorRetry message={msg} />
      </div>
    );
  }

  const addressLines = [footer.officeStreetLine, footer.officeCityLine, footer.officeCounty]
    .map((l) => l?.trim())
    .filter(Boolean);

  return (
    <div className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          title="Contact Novaflow"
          subtitle="Tell us about your business, institution, or partnership idea—we respond within two working days."
          align="center"
          className="mb-12"
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <Card padding="lg">
            <h2 className="text-lg font-bold text-navy">{footer.officeTitle}</h2>
            {addressLines.length > 0 ? (
              <p className="mt-3 text-sm text-navy/75">
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            ) : null}
            <ul className="mt-6 space-y-3 text-sm text-navy/80">
              <li>
                Phone:{" "}
                <a href={footer.phoneHref} className="font-semibold text-orange hover:underline">
                  {footer.phone}
                </a>
              </li>
              <li>
                Email:{" "}
                <a href={footer.emailHref} className="font-semibold text-orange hover:underline">
                  {footer.email}
                </a>
              </li>
              {footer.whatsappHref?.trim() ? (
                <li>
                  WhatsApp:{" "}
                  <a
                    href={footer.whatsappHref.trim()}
                    className="font-semibold text-orange hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {footer.whatsappLabel?.trim() || "Chat with us"}
                  </a>
                </li>
              ) : null}
            </ul>
            <div className="mt-8 rounded-xl border border-navy/10 bg-white p-4 text-center text-xs text-navy/60">
              Map placeholder — {footer.officeCounty?.trim() || footer.officeCityLine?.trim() || footer.address}
            </div>
          </Card>
          <Card padding="lg">
            <h2 className="text-lg font-bold text-navy">Send a message</h2>
            <div className="mt-4">
              <ContactForm services={services} />
            </div>
          </Card>
        </div>

        <FaqSection />
      </div>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { q: "Do you support deployments outside Nairobi?", a: "Yes—our field teams cover multiple counties for connectivity and installations." },
    { q: "Can we start with a pilot?", a: "Most products support a scoped pilot. Ask in your message and we will propose a timeline." },
    { q: "How does rural WiFi funding work?", a: "We combine partner subsidies, county collaboration, and sustainable ISP economics—details vary by site." },
  ];
  return (
    <section className="mt-16 border-t border-navy/10 pt-12">
      <h2 className="text-center text-2xl font-bold text-navy">FAQ</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-navy/10 bg-white px-5 py-3">
            <summary className="cursor-pointer list-none font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-navy/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
