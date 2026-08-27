"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceManagement() {
  const [employees, setEmployees] =
    useState([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [month, setMonth] =
    useState(
      new Date().getMonth() + 1
    );

  const [year, setYear] =
    useState(
      new Date().getFullYear()
    );

  const [pasteData, setPasteData] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response =
        await axios.get(
          "/api/employee"
        );

      setEmployees(
        response.data.employees ||
          []
      );
    } catch (error) {
      console.error(
        "Employee loading error:",
        error
      );
    }
  };

  // ==================================================
  // PARSE PASTED DATA
  // ==================================================

  const parseAttendance = () => {
    const lines =
      pasteData
        .split("\n")
        .map(
          (line) =>
            line.trim()
        )
        .filter(
          (line) =>
            line.length > 0
        );

    const rows = [];

    for (
      const line of lines
    ) {
      const normalized =
        line
          .replace(
            /\t/g,
            " "
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      // ==========================================
      // ABSENCE
      // ==========================================

      if (
        normalized.toLowerCase() ===
        "absence"
      ) {
        rows.push({
          inTime: "",
          outTime: "",
          status: "Absent",
        });

        continue;
      }

      // ==========================================
      // TIME FORMAT
      // ==========================================

      const times =
        normalized.match(
          /\b\d{1,2}:\d{2}\b/g
        );

      if (
        times &&
        times.length >= 2
      ) {
        rows.push({
          inTime: times[0],
          outTime: times[1],
          status: "Present",
        });
      }
    }

    return rows;
  };

  // ==================================================
  // IMPORT
  // ==================================================

  const handleImport =
    async () => {
      if (!employeeId) {
        alert(
          "Please select employee"
        );
        return;
      }

      if (!pasteData.trim()) {
        alert(
          "Please paste attendance data"
        );
        return;
      }

      const rows =
        parseAttendance();

      if (!rows.length) {
        alert(
          "No valid attendance data found"
        );
        return;
      }

      const daysInMonth =
        new Date(
          Number(year),
          Number(month),
          0
        ).getDate();

      if (
        rows.length >
        daysInMonth
      ) {
        alert(
          `You pasted ${rows.length} rows but ${month}/${year} has only ${daysInMonth} days.`
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await axios.post(
            "/api/attendance/bulk",
            {
              employeeId,
              month: Number(month),
              year: Number(year),
              rows,
            }
          );

        alert(
          response.data.message
        );

        setPasteData("");
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Attendance import failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const rowsPreview =
    parseAttendance();

  return (
    <div className="p-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Management
        </h1>

        <p className="text-gray-500 mt-2">
          Paste employee attendance and import it for salary calculation.
        </p>

      </div>

      {/* ==================================================
          EMPLOYEE / MONTH
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

        <h2 className="text-lg font-bold mb-5">
          Attendance Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* EMPLOYEE */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Employee
            </label>

            <select
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(
                  e.target.value
                )
              }
              className="w-full border rounded-xl px-4 py-3"
            >

              <option value="">
                Select Employee
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={
                      employee._id
                    }
                    value={
                      employee._id
                    }
                  >
                    {
                      employee.employeeFullName
                    }{" "}
                    -
                    {
                      employee.employeeCode
                    }
                  </option>
                )
              )}

            </select>

          </div>

          {/* MONTH */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Month
            </label>

            <select
              value={month}
              onChange={(e) =>
                setMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full border rounded-xl px-4 py-3"
            >

              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map(
                (
                  monthName,
                  index
                ) => (
                  <option
                    key={monthName}
                    value={index + 1}
                  >
                    {monthName}
                  </option>
                )
              )}

            </select>

          </div>

          {/* YEAR */}

          <div>

            <label className="block text-sm font-semibold mb-2">
              Year
            </label>

            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(
                  e.target.value
                )
              }
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          PASTE
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

        <h2 className="text-lg font-bold">
          Paste Attendance
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-5">
          Paste the In / Out rows exactly as exported from your attendance system.
        </p>

        <textarea
          value={pasteData}
          onChange={(e) =>
            setPasteData(
              e.target.value
            )
          }
          rows={15}
          placeholder={`Absence
09:46    15:08
09:46    19:00
10:06    19:00
10:05    19:00
09:39    19:00`}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-mono text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="rounded-xl bg-blue-50 px-4 py-3">

            <p className="text-xs text-blue-500">
              Detected Records
            </p>

            <p className="text-lg font-bold text-blue-700">
              {rowsPreview.length}
            </p>

          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Importing..."
              : "Import Attendance"}
          </button>

        </div>

      </div>

      {/* ==================================================
          PREVIEW
      ================================================== */}

      {rowsPreview.length >
        0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b">

            <h2 className="text-lg font-bold">
              Attendance Preview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Row 1 corresponds to day 1 of the selected month.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4">
                    Date
                  </th>

                  <th className="text-left px-6 py-4">
                    In
                  </th>

                  <th className="text-left px-6 py-4">
                    Out
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {rowsPreview.map(
                  (row, index) => {

                    const date =
                      new Date(
                        Number(year),
                        Number(month) - 1,
                        index + 1
                      );

                    return (
                      <tr
                        key={index}
                        className="border-t"
                      >

                        <td className="px-6 py-4">
                          {date.toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {row.inTime ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          {row.outTime ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={
                              row.status ===
                              "Absent"
                                ? "text-red-600 font-semibold"
                                : "text-green-600 font-semibold"
                            }
                          >
                            {row.status}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}
