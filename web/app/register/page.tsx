"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("manager@teamsync.com");
  const [name, setName] = useState("Manager User");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("MANAGER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email,
        name,
        password,
        role,
      });

      const payload = response.data.data ?? response.data;

      localStorage.setItem("teamsync_access_token", payload.accessToken);
      localStorage.setItem("teamsync_refresh_token", payload.refreshToken);
      localStorage.setItem("teamsync_user", JSON.stringify(payload.user));

      router.push("/dashboard");
    } catch {
      setError("Could not create account. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[460px] rounded-[8px] bg-white border border-gray-200 shadow-sm p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold">
            TS
          </div>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900">
            Create account
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Join TeamSync and start tracking work.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />

          <input
            className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />

          <input
            className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />

          <select
            className="w-full rounded-[6px] border border-gray-300 px-3 py-2.5"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="MANAGER">Manager</option>
            <option value="MEMBER">Member</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-[6px] bg-[#2563EB] px-4 py-2.5 text-white hover:bg-[#1E40AF] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="text-center text-[13px] text-gray-500">
            Already have an account?{" "}
            <a className="font-medium text-[#2563EB]" href="/login">
              Sign in
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
