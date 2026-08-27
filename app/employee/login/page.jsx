"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [companyLoginEmail, setCompanyLoginEmail] =
    useState("");

  const [companyLoginPassword, setCompanyLoginPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // CHECK IF ALREADY LOGGED IN
  // ==================================================

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "employeeLoggedIn"
      );

    if (loggedIn === "true") {
      router.replace(
        "/employee/dashboard"
      );
    }
  }, [router]);

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !companyLoginEmail.trim() ||
      !companyLoginPassword
    ) {
      setError(
        "Please enter your company email and password"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/employee/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            companyLoginEmail,
            companyLoginPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Login failed"
        );

        return;
      }

      // ==================================================
      // SAVE LOGIN INFORMATION
      // ==================================================

      localStorage.setItem(
        "employeeLoggedIn",
        "true"
      );

      localStorage.setItem(
        "employeeId",
        data.employee.id
      );

      localStorage.setItem(
        "employeeData",
        JSON.stringify(
          data.employee
        )
      );

      // ==================================================
      // GO TO DASHBOARD
      // ==================================================

      router.replace(
        "/employee/dashboard"
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* ================= CARD ================= */}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* ================= TOP ================= */}

          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-10 text-white">

            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl mb-5">
              👤
            </div>

            <h1 className="text-3xl font-bold">
              Employee Login
            </h1>

            <p className="text-blue-100 mt-2">
              Login to access your employee portal
            </p>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleLogin}
            className="p-8"
          >

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Login Email
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>

                <input
                  type="email"
                  value={companyLoginEmail}
                  onChange={(e) =>
                    setCompanyLoginEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter company email"
                  autoComplete="username"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3.5 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mb-7">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    companyLoginPassword
                  }
                  onChange={(e) =>
                    setCompanyLoginPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 py-3.5 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Signing in...

                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* INFO */}

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">

              <p className="text-xs leading-5 text-blue-700">
                Use the company email and password
                provided to you by HR.
              </p>

            </div>

          </form>

        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Employee Management Portal
        </p>

      </div>

    </div>
  );
}