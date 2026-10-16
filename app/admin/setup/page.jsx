"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();

  const [setupKey, setSetupKey] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-setup-key": setupKey,
        },
        body: JSON.stringify({
          adminEmail,
          adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Setup failed.");
        return;
      }

      setMessage("Owner account created. Redirecting to login...");

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
// 16th october 
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            COMPANY OWNER
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Create Owner Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create the initial administrator credentials.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Setup Key
          </label>

          <input
            type="password"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
            required
            autoComplete="off"
            className="w-full rounded-xl border p-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Owner Email
          </label>

          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border p-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Owner Password
          </label>

          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
            minLength={10}
            autoComplete="new-password"
            className="w-full rounded-xl border p-3 outline-none focus:border-indigo-500"
          />

          <p className="mt-1 text-xs text-slate-400">
            Use at least 10 characters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Owner Account"}
        </button>
      </form>
    </main>
  );
}