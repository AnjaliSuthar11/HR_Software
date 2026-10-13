"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

function getStatusStyle(status) {
  switch (status) {
    case "Holiday":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Present":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Late":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Absent":
      return "bg-red-50 text-red-700 border-red-200";

    case "Leave":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Leave Pending":
      return "bg-orange-50 text-orange-700 border-orange-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function formatDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AttendanceHistory() {
  const today = new Date();

  const [employeeId, setEmployeeId] = useState("");

  const [monthValue, setMonthValue] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // GET LOGGED-IN EMPLOYEE ID
  // ========================================

  useEffect(() => {
    try {
      const storedEmployeeData = localStorage.getItem("employeeData");

      const employeeData = storedEmployeeData
        ? JSON.parse(storedEmployeeData)
        : null;

      const employeeLoggedIn =
        localStorage.getItem("employeeLoggedIn") === "true";

      const id =
        localStorage.getItem("employeeId") ||
        employeeData?.employeeId ||
        employeeData?._id ||
        (employeeLoggedIn ? employeeData?.id : "");

      if (!id) {
        setError("Employee ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      setEmployeeId(id);
    } catch (error) {
      console.error("Employee data error:", error);
      setError("Unable to read employee login information.");
      setLoading(false);
    }
  }, []);

  // ========================================
  // LOAD MONTHLY ATTENDANCE
  // ========================================

  useEffect(() => {
    if (!employeeId) return;

    let cancelled = false;

    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const [year, month] = monthValue.split("-").map(Number);

        const response = await fetch(
          `/api/attendance/history?employeeId=${encodeURIComponent(
            employeeId
          )}&month=${month}&year=${year}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load attendance.");
        }

        if (!cancelled) {
          setRecords(Array.isArray(data.records) ? data.records : []);
        }
      } catch (error) {
        console.error("Attendance history error:", error);

        if (!cancelled) {
          setRecords([]);
          setError(error.message || "Unable to load attendance records.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [employeeId, monthValue]);

  // ========================================
  // MONTH LABEL
  // ========================================

  const [year, month] = monthValue.split("-").map(Number);

  const selectedMonthName = new Date(year, month - 1, 1).toLocaleString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  const presentCount = records.filter(
    (item) => item.status === "Present" || item.status === "Late"
  ).length;

  const lateCount = records.filter((item) => item.status === "Late").length;

  const absentCount = records.filter((item) => item.status === "Absent").length;

  const holidayCount = records.filter(
    (item) => item.status === "Holiday"
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}

      <div className="p-6 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Attendance History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Check-in, check-out, late marks and monthly holidays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-gray-500" />

          <input
            type="month"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* MONTH SUMMARY */}

      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Present</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">
            {presentCount}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-xs text-amber-700">Late</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{lateCount}</p>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-xs text-red-700">Absent</p>
          <p className="text-2xl font-bold text-red-800 mt-1">{absentCount}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-xs text-blue-700">Holidays</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">
            {holidayCount}
          </p>
        </div>
      </div>

      {/* TABLE */}

      <div className="px-6 pb-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 size={17} className="text-gray-500" />

          <p className="font-semibold text-gray-800">{selectedMonthName}</p>

          <span className="text-xs text-gray-400">({records.length} days)</span>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading attendance records...
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full min-w-[850px]">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Date",
                    "Weekday",
                    "Check In",
                    "Check Out",
                    "Working Hours",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {records.map((record) => (
                  <tr
                    key={record.dateKey}
                    className={
                      record.status === "Holiday"
                        ? "bg-blue-50/30"
                        : "hover:bg-gray-50/70"
                    }
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(record.dateKey)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatWeekday(record.dateKey)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {record.status === "Holiday" ? "—" : record.inTime || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {record.status === "Holiday"
                        ? "—"
                        : record.outTime || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {record.status === "Holiday"
                        ? "—"
                        : record.workingMinutes > 0
                        ? `${Number(record.workingHours).toFixed(2)} hrs`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>

                        {record.details && (
                          <span className="text-xs text-gray-500 max-w-[220px]">
                            {record.details}
                          </span>
                        )}

                        {record.status === "Holiday" && record.paidHoliday && (
                          <span className="text-[11px] font-medium text-blue-700">
                            Paid holiday
                          </span>
                        )}

                        {record.status === "Late" && (
                          <span className="text-xs text-amber-700">
                            Late by {record.lateMinutes} min
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatWeekday(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
  });
}
