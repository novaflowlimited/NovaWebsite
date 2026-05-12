import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, ServiceDto } from "@/types";
import { routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata(
  "Contact",
  "Get in touch with Novaflow for demos, partnerships, and support across Kenya.",
  "/contact",
);

export default async function ContactPage() {
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
            <h2 className="text-lg font-bold text-navy">Nairobi office</h2>
            <p className="mt-3 text-sm text-navy/75">
              Westlands Business District
              <br />
              Nairobi, Kenya
            </p>
            <ul className="mt-6 space-y-3 text-sm text-navy/80">
              <li>
                Phone:{" "}
                <a href="tel:+254700000000" className="font-semibold text-orange hover:underline">
                  +254 700 000 000
                </a>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:hello@novaflow.co.ke" className="font-semibold text-orange hover:underline">
                  hello@novaflow.co.ke
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/254700000000"
                  className="font-semibold text-orange hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat with us
                </a>
              </li>
            </ul>
            <div className="mt-8 rounded-xl border border-navy/10 bg-white p-4 text-center text-xs text-navy/60">
              Map placeholder — Kenya / Nairobi
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
