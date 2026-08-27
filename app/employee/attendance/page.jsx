"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeAttendancePage() {
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("employeeLoggedIn");

    const employeeData =
      localStorage.getItem("employeeData");

    if (
      loggedIn !== "true" ||
      !employeeData
    ) {
      router.replace("/employee/login");
      return;
    }

    try {
      setEmployee(JSON.parse(employeeData));
    } catch (error) {
      console.error(error);
      router.replace("/employee/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeData");

    router.replace("/employee/login");
  };

  if (loading || !employee) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading attendance...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-white border-r border-gray-200 lg:flex lg:flex-col">

        <div className="px-6 py-6 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
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

        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              onClick={() =>
                router.push("/employee/dashboard")
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>🏠</span>
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push("/employee/profile")
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>👤</span>
              My Profile
            </button>

            <button
              onClick={() =>
                router.push("/employee/leave")
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>📝</span>
              Leave
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md"
            >
              <span>📅</span>
              Attendance
            </button>

          </div>

        </nav>

        <div className="p-4 border-t border-gray-100">

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="lg:ml-64">

        {/* ================= HEADER ================= */}

        <header className="h-20 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold text-gray-900">
              Attendance
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View your attendance records
            </p>

          </div>

          <button
            onClick={() =>
              router.push("/employee/dashboard")
            }
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </header>

        <div className="p-6 lg:p-8">

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            <AttendanceCard
              title="Present"
              value="--"
              subtitle="This month"
              icon="✅"
              iconBg="bg-green-100"
            />

            <AttendanceCard
              title="Absent"
              value="--"
              subtitle="This month"
              icon="❌"
              iconBg="bg-red-100"
            />

            <AttendanceCard
              title="Half Day"
              value="--"
              subtitle="This month"
              icon="⏱️"
              iconBg="bg-yellow-100"
            />

            <AttendanceCard
              title="Working Hours"
              value="--"
              subtitle="This month"
              icon="🕐"
              iconBg="bg-blue-100"
            />

          </div>

          {/* ================= TODAY ================= */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">

            <div className="p-6 border-b border-gray-100">

              <h2 className="text-lg font-bold">
                Today's Attendance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your attendance for today
              </p>

            </div>

            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="rounded-xl bg-gray-50 p-5">

                  <p className="text-xs text-gray-400">
                    Check In
                  </p>

                  <p className="text-xl font-bold mt-2">
                    --
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-5">

                  <p className="text-xs text-gray-400">
                    Check Out
                  </p>

                  <p className="text-xl font-bold mt-2">
                    --
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-5">

                  <p className="text-xs text-gray-400">
                    Status
                  </p>

                  <p className="text-xl font-bold mt-2 text-gray-400">
                    Not Available
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= HISTORY ================= */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-gray-100">

              <h2 className="text-lg font-bold">
                Attendance History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your previous attendance records
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Check In
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Check Out
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Working Hours
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >

                      <div className="text-5xl mb-4">
                        📅
                      </div>

                      <h3 className="font-bold text-lg text-gray-800">
                        No Attendance Records
                      </h3>

                      <p className="text-sm text-gray-500 mt-2">
                        Attendance records will appear here once they are added by HR.
                      </p>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

function AttendanceCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {value}
          </h3>

          <p className="text-xs text-gray-400 mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconBg}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}