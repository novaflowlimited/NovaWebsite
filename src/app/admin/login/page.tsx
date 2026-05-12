"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { setStoredToken } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@novaflow.co.ke");
  const [password, setPassword] = useState("changeme");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    const data = (await res.json()) as { token: string };
    setStoredToken(data.token);
    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
      >
        <h1 className="text-center text-2xl font-bold text-white">Admin login</h1>
        <div>
          <label className="text-xs font-medium text-white/70">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-white/70">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" className="w-full rounded-lg">
          Sign in
        </Button>
      </form>
    </div>
  );
}
