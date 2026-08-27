"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboardPage() {
  const router = useRouter();

  const [employee, setEmployee] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==================================================
  // CHECK LOGIN
  // ==================================================

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "employeeLoggedIn"
      );

    const employeeData =
      localStorage.getItem(
        "employeeData"
      );

    if (
      loggedIn !== "true" ||
      !employeeData
    ) {
      router.replace(
        "/employee/login"
      );

      return;
    }

    try {
      const parsedEmployee =
        JSON.parse(
          employeeData
        );

      setEmployee(
        parsedEmployee
      );
    } catch (error) {
      console.error(
        "Employee data error:",
        error
      );

      localStorage.clear();

      router.replace(
        "/employee/login"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "employeeLoggedIn"
    );

    localStorage.removeItem(
      "employeeId"
    );

    localStorage.removeItem(
      "employeeData"
    );

    router.replace(
      "/employee/login"
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-gray-500">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">

        {/* LOGO */}

        <div className="border-b border-gray-100 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
              E
            </div>

            <div>
              <h1 className="font-bold text-gray-900">
                Employee
              </h1>

              <p className="text-xs text-gray-400">
                Portal
              </p>
            </div>

          </div>

        </div>

        {/* MENU */}

        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-blue-100"
            >
              <span>🏠</span>
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/profile"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <span>👤</span>
              My Profile
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/leave"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <span>📝</span>
              Leave
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/attendance"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <span>📅</span>
              Attendance
            </button>

          </div>

        </nav>

        {/* LOGOUT */}

        <div className="border-t border-gray-100 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-64">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur lg:px-8">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Employee Portal
            </p>

          </div>

          <div className="flex items-center gap-4">

            {/* NOTIFICATION */}

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg transition hover:bg-gray-200">
              🔔

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* PROFILE */}

            <div className="flex items-center gap-3">

              {employee.employeePhoto ? (

                <img
                  src={
                    employee.employeePhoto
                  }
                  alt={
                    employee.employeeFullName
                  }
                  className="h-10 w-10 rounded-full object-cover"
                />

              ) : (

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {employee.employeeFullName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-gray-800">
                  {
                    employee.employeeFullName
                  }
                </p>

                <p className="text-xs text-gray-400">
                  {
                    employee.employeeCode
                  }
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-6 lg:p-8">

          {/* ==================================================
              WELCOME CARD
          ================================================== */}

          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">

            <div className="relative z-10 max-w-2xl">

              <p className="mb-2 text-blue-100">
                Welcome back 👋
              </p>

              <h1 className="text-3xl font-bold lg:text-4xl">
                {
                  employee.employeeFullName
                }
              </h1>

              <p className="mt-3 text-blue-100">
                We are happy to have you with us.
                Here you can manage your employee
                information and company activities.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                  <span className="text-xs text-blue-100">
                    Employee Code
                  </span>

                  <p className="font-semibold">
                    {
                      employee.employeeCode
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                  <span className="text-xs text-blue-100">
                    Status
                  </span>

                  <p className="font-semibold">
                    {
                      employee.employeeStatus
                    }
                  </p>
                </div>

              </div>

            </div>

            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 text-8xl opacity-20 xl:block">
              👨‍💼
            </div>

          </section>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Attendance */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Attendance
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    --
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    This month
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                  📅
                </div>

              </div>

            </div>

            {/* Leave */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Leave Balance
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    --
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Available leaves
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
                  🌴
                </div>

              </div>

            </div>

            {/* Pending */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Pending Leaves
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    --
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Awaiting approval
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                  ⏳
                </div>

              </div>

            </div>

            {/* Status */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Employee Status
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-green-600">
                    {
                      employee.employeeStatus
                    }
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Current account status
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  ✓
                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="mb-8">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500">
                Frequently used employee options
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <button
                onClick={() =>
                  router.push(
                    "/employee/profile"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-600 group-hover:text-white">
                  👤
                </div>

                <h3 className="font-bold text-gray-900">
                  My Profile
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View your employee information
                </p>

              </button>

              <button
                onClick={() =>
                  router.push(
                    "/employee/leave"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl transition group-hover:bg-orange-500 group-hover:text-white">
                  📝
                </div>

                <h3 className="font-bold text-gray-900">
                  Apply Leave
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Submit a new leave request
                </p>

              </button>

              <button
                onClick={() =>
                  router.push(
                    "/employee/attendance"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl transition group-hover:bg-green-500 group-hover:text-white">
                  📅
                </div>

                <h3 className="font-bold text-gray-900">
                  Attendance
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View your attendance records
                </p>

              </button>

            </div>

          </section>

          {/* ==================================================
              INFORMATION
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Employee Information */}

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 p-6">

                <h2 className="font-bold text-lg">
                  Employee Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your basic company information
                </p>

              </div>

              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                <InfoItem
                  label="Employee Code"
                  value={
                    employee.employeeCode
                  }
                />

                <InfoItem
                  label="Full Name"
                  value={
                    employee.employeeFullName
                  }
                />

                <InfoItem
                  label="Company Email"
                  value={
                    employee.companyLoginEmail
                  }
                />

                <InfoItem
                  label="Mobile Number"
                  value={
                    employee.mobileNo
                  }
                />

                <InfoItem
                  label="Joining Date"
                  value={
                    employee.joiningDate
                      ? new Date(
                          employee.joiningDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "Not provided"
                  }
                />

                <InfoItem
                  label="Status"
                  value={
                    employee.employeeStatus
                  }
                />

              </div>

            </div>

            {/* Today */}

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 p-6">

                <h2 className="font-bold text-lg">
                  Today's Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your daily employee activity
                </p>

              </div>

              <div className="space-y-4 p-6">

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                      🟢
                    </div>

                    <div>
                      <p className="font-semibold">
                        Attendance
                      </p>

                      <p className="text-xs text-gray-500">
                        Today's attendance
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-semibold text-gray-400">
                    Not available
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                      📝
                    </div>

                    <div>
                      <p className="font-semibold">
                        Leave
                      </p>

                      <p className="text-xs text-gray-500">
                        Leave requests
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-semibold text-gray-400">
                    No requests
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                      🔔
                    </div>

                    <div>
                      <p className="font-semibold">
                        Notifications
                      </p>

                      <p className="text-xs text-gray-500">
                        Important updates
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-semibold text-gray-400">
                    0
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

// ==================================================
// INFO ITEM
// ==================================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="mb-1 text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-gray-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}