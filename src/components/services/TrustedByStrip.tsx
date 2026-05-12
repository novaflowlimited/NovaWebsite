import { ErrorRetry } from "@/components/site/ErrorRetry";
import { ClientLogoDisplay } from "@/components/site/ClientLogoDisplay";
import { ApiError } from "@/lib/api-error";
import { publicFetch } from "@/lib/public-fetch";
import type { ApiListResponse, ClientLogo } from "@/types";

const stats = [
  { value: "250+", label: "Businesses Powered" },
  { value: "99.9%", label: "Network Reliability" },
  { value: "1M+", label: "Transactions Daily" },
  { value: "24/7", label: "Enterprise Support" },
];

export async function TrustedByStrip() {
  let logos: ClientLogo[] = [];
  let err: string | null = null;
  try {
    const res = await publicFetch<ApiListResponse<ClientLogo>>("/api/client-logos?strip=TRUSTED_BY");
    logos = res.data;
  } catch (e) {
    err = e instanceof ApiError ? `Unable to load logos (${e.status}).` : "Unable to load logos.";
  }

  return (
    <section className="bg-cream/40 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-navy/55">
          Trusted by businesses across Kenya
        </p>
        <div className="mt-8">
          {err ? (
            <ErrorRetry message={err} />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {logos.map((logo) => (
                <ClientLogoDisplay key={logo.id} logo={logo} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 rounded-3xl bg-navy px-6 py-10 text-white shadow-lg md:grid-cols-4 md:px-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-orange md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-white/75 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
