"use client";

import Link from "next/link";
import { ImpactMapForm } from "../_components/ImpactMapForm";

export default function AdminImpactMapPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Impact map — featured county</h1>
        <Link href="/admin/impact" className="text-sm text-orange hover:underline">
          Back
        </Link>
      </div>
      <p className="text-sm text-navy/70">
        Controls the card beside the Kenya map on the homepage and Impact page (“Where we operate” / “Expanding
        connectivity across Kenya”). Map dots and legend colors stay fixed in code for now.
      </p>
      <ImpactMapForm />
    </div>
  );
}
