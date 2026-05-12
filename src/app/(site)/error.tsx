"use client";

import { useEffect } from "react";
import { ErrorRetry } from "@/components/site/ErrorRetry";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy">This page could not be loaded</h1>
      <p className="mt-2 text-sm text-navy/70">{error.message}</p>
      <div className="mt-6">
        <ErrorRetry message="Try again to reload the page." />
      </div>
      <button type="button" className="mt-4 text-sm text-orange underline" onClick={() => reset()}>
        Reset
      </button>
    </div>
  );
}
