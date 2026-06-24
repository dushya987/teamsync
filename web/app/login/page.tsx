"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@teamsync.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const payload = response.data.data ?? response.data;

      localStorage.setItem("teamsync_access_token", payload.accessToken);
      localStorage.setItem("teamsync_refresh_token", payload.refreshToken);

      if (rememberMe) {
        localStorage.setItem("teamsync_user", JSON.stringify(payload.user));
      }

      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[420px] rounded-[8px] bg-white border border-gray-200 shadow-sm p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold">
            TS
          </div>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Sign in to continue to TeamSync.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[13px] text-gray-600">
              Email
            </label>
            <input
              className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] text-gray-600">
              Password
            </label>
            <input
              className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>

            <a href="/register" className="font-medium text-[#2563EB]">
              Create account
            </a>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-[6px] bg-[#2563EB] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#1E40AF] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
