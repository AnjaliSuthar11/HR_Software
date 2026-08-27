"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyLeavePage() {
  const router = useRouter();

  const [employee, setEmployee] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    leaveType: "CL",
    fromDate: "",
    toDate: "",
    duration: "Full Day",
    numberOfDays: 1,
    reason: "",
  });

  const [error, setError] =
    useState("");

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
      setEmployee(
        JSON.parse(
          employeeData
        )
      );
    } catch (error) {
      router.replace(
        "/employee/login"
      );
    }
  }, [router]);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==================================================
  // CALCULATE DAYS
  // ==================================================

  useEffect(() => {
    if (
      form.duration ===
      "Half Day"
    ) {
      setForm((prev) => ({
        ...prev,
        numberOfDays: 0.5,
      }));

      return;
    }

    if (
      form.fromDate &&
      form.toDate
    ) {
      const start =
        new Date(
          form.fromDate
        );

      const end =
        new Date(
          form.toDate
        );

      if (
        start <= end
      ) {
        const difference =
          end.getTime() -
          start.getTime();

        const days =
          Math.floor(
            difference /
              (1000 *
                60 *
                60 *
                24)
          ) + 1;

        setForm((prev) => ({
          ...prev,
          numberOfDays:
            days,
        }));
      }
    }
  }, [
    form.fromDate,
    form.toDate,
    form.duration,
  ]);

  // ==================================================
  // SUBMIT LEAVE
  // ==================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!employee) {
        return;
      }

      setError("");

      if (
        !form.fromDate ||
        !form.toDate
      ) {
        setError(
          "Please select both dates"
        );

        return;
      }

      if (
        !form.reason.trim()
      ) {
        setError(
          "Please enter a reason for leave"
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/employee/leave",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                employeeId:
                  employee.id,

                leaveType:
                  form.leaveType,

                fromDate:
                  form.fromDate,

                toDate:
                  form.toDate,

                duration:
                  form.duration,

                numberOfDays:
                  Number(
                    form.numberOfDays
                  ),

                reason:
                  form.reason.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to apply leave"
          );

          return;
        }

        alert(
          "Leave applied successfully"
        );

        router.push(
          "/employee/leave"
        );
      } catch (error) {
        console.error(
          "Leave submit error:",
          error
        );

        setError(
          "Something went wrong. Please try again."
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

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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

            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              E
            </div>

            <div>
              <h1 className="font-bold">
                Employee
              </h1>

              <p className="text-xs text-gray-400">
                Portal
              </p>
            </div>

          </div>

        </div>

        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-xs uppercase font-semibold text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              onClick={() =>
                router.push(
                  "/employee/dashboard"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm"
            >
              🏠
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/profile"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm"
            >
              👤
              My Profile
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/leave"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              📝
              Leave
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/attendance"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm"
            >
              📅
              Attendance
            </button>

          </div>

        </nav>

        <div className="p-4 border-t border-gray-100">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
          >
            🚪
            Logout
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-64">

        {/* HEADER */}

        <header className="h-20 bg-white border-b flex items-center px-6 lg:px-8">

          <div>

            <h1 className="text-xl font-bold">
              Apply Leave
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Submit your leave request
            </p>

          </div>

        </header>

        <div className="p-6 lg:p-8">

          <div className="max-w-4xl mx-auto">

            {/* BACK */}

            <button
              onClick={() =>
                router.push(
                  "/employee/leave"
                )
              }
              className="mb-5 text-sm font-semibold text-gray-500 hover:text-blue-600"
            >
              ← Back to Leave History
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

              {/* TOP */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

                <p className="text-blue-100 text-sm">
                  Leave Request
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Apply for Leave
                </h2>

                <p className="mt-2 text-blue-100 text-sm">
                  Your request will be sent to HR for approval.
                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="p-8"
              >

                {/* ERROR */}

                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* EMPLOYEE */}

                <div className="mb-8 rounded-2xl bg-gray-50 p-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                      <p className="text-xs text-gray-400">
                        Employee Name
                      </p>

                      <p className="font-semibold mt-1">
                        {
                          employee.employeeFullName
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Employee Code
                      </p>

                      <p className="font-semibold mt-1">
                        {
                          employee.employeeCode
                        }
                      </p>

                    </div>

                  </div>

                </div>

                {/* FIELDS */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* LEAVE TYPE */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Leave Type
                    </label>

                    <select
                      name="leaveType"
                      value={
                        form.leaveType
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="CL">
                        CL - Casual Leave
                      </option>

                      <option value="SL">
                        SL - Sick Leave
                      </option>

                      <option value="LOP">
                        LOP - Leave Without Pay
                      </option>

                    </select>

                  </div>

                  {/* DURATION */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>

                    <select
                      name="duration"
                      value={
                        form.duration
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="Full Day">
                        Full Day
                      </option>

                      <option value="Half Day">
                        Half Day
                      </option>

                    </select>

                  </div>

                  {/* FROM */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      From Date
                    </label>

                    <input
                      type="date"
                      name="fromDate"
                      value={
                        form.fromDate
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                  {/* TO */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To Date
                    </label>

                    <input
                      type="date"
                      name="toDate"
                      value={
                        form.toDate
                      }
                      min={
                        form.fromDate ||
                        undefined
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                  {/* NUMBER OF DAYS */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Days
                    </label>

                    <input
                      type="number"
                      value={
                        form.numberOfDays
                      }
                      readOnly
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 text-gray-700"
                    />

                  </div>

                </div>

                {/* REASON */}

                <div className="mt-6">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason
                  </label>

                  <textarea
                    name="reason"
                    value={
                      form.reason
                    }
                    onChange={
                      handleChange
                    }
                    required
                    rows="5"
                    placeholder="Enter the reason for your leave..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/employee/leave"
                      )
                    }
                    className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit Leave"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}