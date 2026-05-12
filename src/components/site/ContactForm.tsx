"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ServiceDto } from "@/types";

type Props = { services: ServiceDto[] };

export function ContactForm({ services }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Request failed");
      }
      setStatus("done");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="service">
          Service interest
        </label>
        <select
          id="service"
          name="service"
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
          defaultValue=""
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none ring-orange/30 focus:ring-2"
        />
      </div>
      <Button type="submit" variant="primary" className="w-full rounded-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
      {status === "done" ? <p className="text-sm font-medium text-green-700">Thanks — we will be in touch shortly.</p> : null}
      {status === "error" ? <p className="text-sm font-medium text-red-600">{message}</p> : null}
    </form>
  );
}
