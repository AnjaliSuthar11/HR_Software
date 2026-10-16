"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("OwnerAdminLoggedIn") === "true") {
      const storedAdmin = localStorage.getItem("OwnerAdminData");

      try {
        const admin = JSON.parse(storedAdmin || "null");

        if (
          admin &&
          admin.id &&
          admin.id === localStorage.getItem("OwnerAdminId")
        ) {
          router.replace("/admin/dashboard");
        }
      } catch {
        localStorage.removeItem("OwnerAdminLoggedIn");
        localStorage.removeItem("OwnerAdminId");
        localStorage.removeItem("OwnerAdminData");
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: adminEmail.trim().toLowerCase(),
          adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("OwnerAdminLoggedIn", "true");
      localStorage.setItem("OwnerAdminId", data.admin.id);
      localStorage.setItem("OwnerAdminData", JSON.stringify(data.admin));

      router.replace("/admin/dashboard");
    } catch (err) {
      console.error("Owner login error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white">
            ♛
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Owner Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your company.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Email
          </label>

          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-indigo-500"
            placeholder="Owner email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Password
          </label>

          <div className="flex rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500">
            <input
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="min-w-0 flex-1 rounded-xl bg-transparent p-3 outline-none"
              placeholder="Owner password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="px-3 text-sm text-slate-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}