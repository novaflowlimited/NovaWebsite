"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ErrorRetry({ message }: { message?: string }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-navy/15 bg-cream p-6 text-center">
      <p className="text-sm font-medium text-navy">{message ?? "Something went wrong loading this section."}</p>
      <Button type="button" className="mt-4" onClick={() => router.refresh()}>
        Retry
      </Button>
    </div>
  );
}
