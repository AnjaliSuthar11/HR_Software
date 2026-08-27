"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLeavePage() {
  const router = useRouter();

  const [employee, setEmployee] = useState(null);

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==================================================
  // LOAD EMPLOYEE
  // ==================================================

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
      const parsedEmployee =
        JSON.parse(employeeData);

      setEmployee(parsedEmployee);

      fetchLeaves(parsedEmployee.id);
    } catch (error) {
      console.error(
        "Employee data error:",
        error
      );

      router.replace("/employee/login");
    }
  }, [router]);

  // ==================================================
  // FETCH LEAVES
  // ==================================================

  const fetchLeaves = async (employeeId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/employee/leave?employeeId=${employeeId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch leaves"
        );
      }

      setLeaves(data.leaves || []);
    } catch (error) {
      console.error(
        "Fetch leaves error:",
        error
      );

      setError(
        error.message ||
          "Unable to fetch leave records"
      );
    } finally {
      setLoading(false);
    }
  };

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
  // CALCULATIONS
  // ==================================================

  const totalLeaves = leaves.reduce(
    (total, leave) =>
      total +
      Number(
        leave.numberOfDays || 0
      ),
    0
  );

  const approvedLeaves = leaves
    .filter(
      (leave) =>
        leave.status === "Approved"
    )
    .reduce(
      (total, leave) =>
        total +
        Number(
          leave.numberOfDays || 0
        ),
      0
    );

  const pendingLeaves = leaves
    .filter(
      (leave) =>
        leave.status === "Pending"
    )
    .reduce(
      (total, leave) =>
        total +
        Number(
          leave.numberOfDays || 0
        ),
      0
    );

  const rejectedLeaves = leaves
    .filter(
      (leave) =>
        leave.status === "Rejected"
    )
    .reduce(
      (total, leave) =>
        total +
        Number(
          leave.numberOfDays || 0
        ),
      0
    );

  // ==================================================
  // DYNAMIC MONTHLY LEAVE SUMMARY
  // IMPORTANT:
  // This MUST be inside the component because
  // it uses the "leaves" state.
  // ==================================================

  const monthlyLeaves = leaves
    .filter(
      (leave) =>
        leave.status === "Approved"
    )
    .reduce((months, leave) => {
      const date = new Date(
        leave.fromDate
      );

      const year =
        date.getFullYear();

      const month =
        date.getMonth();

      const key =
        `${year}-${String(
          month + 1
        ).padStart(2, "0")}`;

      if (!months[key]) {
        months[key] = {
          key,
          year,
          month,
          monthName:
            date.toLocaleString(
              "en-IN",
              {
                month: "long",
              }
            ),
          paidDays: 0,
          lopDays: 0,
          leaves: [],
        };
      }

      const days =
        Number(
          leave.numberOfDays || 0
        );

      // ==========================================
      // PAID / LOP
      // ==========================================

      if (
        leave.leaveType === "LOP"
      ) {
        months[key].lopDays += days;
      } else {
        months[key].paidDays += days;
      }

      months[key].leaves.push(leave);

      return months;
    }, {});

  const monthlyLeaveArray =
    Object.values(monthlyLeaves)
      .sort(
        (a, b) =>
          new Date(
            b.year,
            b.month,
            1
          ) -
          new Date(
            a.year,
            a.month,
            1
          )
      );

  // ==================================================
  // LOADING
  // ==================================================

  if (!employee || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading leave records...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

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

          <p className="text-xs font-semibold uppercase text-gray-400 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              onClick={() =>
                router.push(
                  "/employee/dashboard"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>👤</span>
              My Profile
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>📅</span>
              Attendance
            </button>

          </div>

        </nav>

        <div className="p-4 border-t border-gray-100">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
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

        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">

          <div>

            <h1 className="text-xl font-bold text-gray-900">
              Leave Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Apply and track your leave requests
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/employee/leave/apply"
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            + Apply Leave
          </button>

        </header>

        <div className="p-6 lg:p-8">

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {/* TOTAL */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <p className="text-sm text-gray-500">
                Total Applied
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalLeaves}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Days
              </p>

            </div>

            {/* APPROVED */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <p className="text-sm text-gray-500">
                Approved
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-600">
                {approvedLeaves}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Days
              </p>

            </div>

            {/* PENDING */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                {pendingLeaves}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Days
              </p>

            </div>

            {/* REJECTED */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <p className="text-sm text-gray-500">
                Rejected
              </p>

              <h2 className="text-3xl font-bold mt-2 text-red-600">
                {rejectedLeaves}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Days
              </p>

            </div>

          </div>

          {/* ==================================================
              LEAVE HISTORY
          ================================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-gray-100">

              <h2 className="text-lg font-bold">
                Leave History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                All your leave applications
              </p>

            </div>

            {leaves.length === 0 ? (

              <div className="py-16 text-center">

                <div className="text-5xl mb-4">
                  📝
                </div>

                <h3 className="font-bold text-lg text-gray-800">
                  No Leave Applications
                </h3>

                <p className="text-gray-500 mt-2">
                  You haven't applied for any leave yet.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      "/employee/leave/apply"
                    )
                  }
                  className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Apply Your First Leave
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Leave Type
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        From
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        To
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Duration
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Days
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Reason
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {leaves.map(
                      (leave) => (

                        <tr
                          key={leave._id}
                          className="hover:bg-gray-50"
                        >

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${
                                leave.leaveType ===
                                "LOP"
                                  ? "bg-red-50 text-red-700"
                                  : leave.leaveType ===
                                    "SL"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {leave.leaveType}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-sm text-gray-700 whitespace-nowrap">
                            {formatDate(
                              leave.fromDate
                            )}
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-700 whitespace-nowrap">
                            {formatDate(
                              leave.toDate
                            )}
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-700 whitespace-nowrap">
                            {leave.duration}
                          </td>

                          <td className="px-6 py-5 text-sm font-semibold">
                            {leave.numberOfDays}
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600 max-w-xs">
                            <p className="truncate">
                              {leave.reason}
                            </p>
                          </td>

                          <td className="px-6 py-5">

                            <StatusBadge
                              status={
                                leave.status
                              }
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ==================================================
              DYNAMIC MONTHLY LEAVE SUMMARY
          ================================================== */}

          <div className="mt-8">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Monthly Leave Summary
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your paid and LOP leaves month by month
              </p>

            </div>

            {monthlyLeaveArray.length === 0 ? (

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

                <div className="text-5xl mb-4">
                  📊
                </div>

                <h3 className="text-lg font-bold text-gray-800">
                  No Approved Leaves
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your approved leave records will appear here.
                </p>

              </div>

            ) : (

              <div className="space-y-6">

                {monthlyLeaveArray.map(
                  (month) => {

                    const totalMonthDays =
                      Number(
                        month.paidDays || 0
                      ) +
                      Number(
                        month.lopDays || 0
                      );

                    const sortedMonthLeaves =
                      [...month.leaves].sort(
                        (a, b) =>
                          new Date(
                            a.fromDate
                          ) -
                          new Date(
                            b.fromDate
                          )
                      );

                    return (
                      <div
                        key={month.key}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                      >

                        {/* MONTH HEADER */}

                        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100">

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                              <h3 className="text-xl font-bold text-gray-900">
                                {month.monthName}{" "}
                                {month.year}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Monthly leave summary
                              </p>

                            </div>

                            <div className="flex gap-3">

                              {/* PAID */}

                              <div className="rounded-xl bg-green-50 px-4 py-3 min-w-[130px]">

                                <p className="text-xs font-medium text-green-600">
                                  Paid Leave
                                </p>

                                <p className="text-lg font-bold text-green-700">
                                  {month.paidDays}{" "}
                                  Day
                                  {month.paidDays !==
                                  1
                                    ? "s"
                                    : ""}
                                </p>

                              </div>

                              {/* LOP */}

                              <div className="rounded-xl bg-red-50 px-4 py-3 min-w-[130px]">

                                <p className="text-xs font-medium text-red-600">
                                  LOP
                                </p>

                                <p className="text-lg font-bold text-red-700">
                                  {month.lopDays}{" "}
                                  Day
                                  {month.lopDays !==
                                  1
                                    ? "s"
                                    : ""}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                        {/* LEAVES */}

                        <div className="p-6 space-y-3">

                          {sortedMonthLeaves.map(
                            (leave) => (

                              <div
                                key={
                                  leave._id
                                }
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition p-4"
                              >

                                {/* LEFT */}

                                <div className="flex items-center gap-4">

                                  <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
                                      leave.leaveType ===
                                      "LOP"
                                        ? "bg-red-100"
                                        : leave.leaveType ===
                                          "SL"
                                        ? "bg-blue-100"
                                        : "bg-green-100"
                                    }`}
                                  >
                                    {leave.leaveType ===
                                    "LOP"
                                      ? "💼"
                                      : leave.leaveType ===
                                        "SL"
                                      ? "🏥"
                                      : "🌴"}
                                  </div>

                                  <div>

                                    <p className="font-semibold text-gray-900">

                                      {formatDate(
                                        leave.fromDate
                                      )}

                                      {leave.toDate &&
                                        new Date(
                                          leave.fromDate
                                        ).toDateString() !==
                                          new Date(
                                            leave.toDate
                                          ).toDateString() && (
                                          <>
                                            {" - "}
                                            {formatDate(
                                              leave.toDate
                                            )}
                                          </>
                                        )}

                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">

                                      {getLeaveTypeName(
                                        leave.leaveType
                                      )}

                                      {" • "}

                                      {
                                        leave.duration
                                      }

                                    </p>

                                  </div>

                                </div>

                                {/* RIGHT */}

                                <div className="flex items-center justify-between lg:justify-end gap-5">

                                  <div className="text-right">

                                    <p className="font-semibold text-gray-800">

                                      {
                                        leave.numberOfDays
                                      }{" "}
                                      Day
                                      {Number(
                                        leave.numberOfDays
                                      ) !== 1
                                        ? "s"
                                        : ""}

                                    </p>

                                  </div>

                                  {leave.leaveType ===
                                  "LOP" ? (

                                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                                      LOP
                                    </span>

                                  ) : (

                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                                      Paid Leave
                                    </span>

                                  )}

                                </div>

                              </div>

                            )
                          )}

                        </div>

                        {/* FOOTER */}

                        <div className="border-t border-gray-100 px-6 py-4 bg-white">

                          <div className="flex items-center justify-between">

                            <span className="text-sm text-gray-500">
                              Total Leave
                            </span>

                            <span className="font-bold text-gray-900">
                              {totalMonthDays}{" "}
                              Day
                              {totalMonthDays !==
                              1
                                ? "s"
                                : ""}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// ======================================================
// LEAVE TYPE NAME
// ======================================================

function getLeaveTypeName(type) {
  if (type === "CL") {
    return "Casual Leave";
  }

  if (type === "SL") {
    return "Sick Leave";
  }

  if (type === "LOP") {
    return "Loss of Pay";
  }

  return type;
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
}) {
  if (status === "Approved") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      Pending
    </span>
  );
}

