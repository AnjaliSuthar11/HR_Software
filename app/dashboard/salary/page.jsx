"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SalaryPage() {
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

  const [monthlySalary, setMonthlySalary] =
    useState("");

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [salary, setSalary] =
    useState(null);

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const [loadingData, setLoadingData] =
    useState(false);

  const [calculating, setCalculating] =
    useState(false);


  // ==================================================
  // MONTH
  // ==================================================

  const daysInMonth =
    new Date(
      Number(year),
      Number(month),
      0
    ).getDate();

  const monthName =
    new Date(
      Number(year),
      Number(month) - 1,
      1
    ).toLocaleString(
      "en-IN",
      {
        month: "long",
      }
    );


  // ==================================================
  // LOAD EMPLOYEES
  // ==================================================

  useEffect(() => {
    loadEmployees();
  }, []);


  const loadEmployees =
    async () => {
      try {
        setLoadingEmployees(
          true
        );

        const response =
          await axios.get(
            "/api/employee/list"
          );

        setEmployees(
          response.data
            .employees || []
        );

      } catch (error) {

        console.error(
          "Employee loading error:",
          error
        );

        alert(
          "Unable to load employees"
        );

      } finally {

        setLoadingEmployees(
          false
        );
      }
    };


  // ==================================================
  // DATE KEY
  // ==================================================

  const getDateKey =
    (date) => {
      const d =
        new Date(date);

      return `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    };


  // ==================================================
  // LOAD ATTENDANCE + LEAVE
  // ==================================================

  const loadPayrollData =
    async () => {

      if (!employeeId) {

        setAttendance([]);
        setLeaves([]);
        setSalary(null);

        return;
      }

      try {

        setLoadingData(true);

        setSalary(null);


        const [
          attendanceResponse,
          leaveResponse,
        ] =
          await Promise.all([
            axios.get(
              `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
            ),

            axios.get(
              `/api/employee/leave?employeeId=${employeeId}`
            ),
          ]);


        setAttendance(
          attendanceResponse.data
            .attendance || []
        );

        setLeaves(
          leaveResponse.data
            .leaves || []
        );

      } catch (error) {

        console.error(
          "Payroll data error:",
          error
        );

        setAttendance([]);
        setLeaves([]);

        alert(
          error.response?.data
            ?.message ||
            "Unable to load attendance and leave data"
        );

      } finally {

        setLoadingData(false);
      }
    };


  // ==================================================
  // RELOAD DATA
  // ==================================================

  useEffect(() => {
    loadPayrollData();
  }, [
    employeeId,
    month,
    year,
  ]);


  // ==================================================
  // ATTENDANCE MAP
  // ==================================================

  const attendanceMap = {};

  attendance.forEach(
    (record) => {

      attendanceMap[
        getDateKey(
          record.date
        )
      ] = record;

    }
  );


  // ==================================================
  // GET APPROVED LEAVE
  // ==================================================

  const getLeaveForDate =
    (date) => {

      const currentKey =
        getDateKey(date);

      return leaves.find(
        (leave) => {

          if (
            leave.status !==
            "Approved"
          ) {
            return false;
          }

          const fromKey =
            getDateKey(
              leave.fromDate
            );

          const toKey =
            getDateKey(
              leave.toDate
            );

          return (
            currentKey >=
              fromKey &&
            currentKey <=
              toKey
          );

        }
      );
    };


  // ==================================================
  // COMPLETE MONTH TABLE
  // ==================================================

  const tableRows = [];

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        day
      );

    date.setHours(
      0,
      0,
      0,
      0
    );


    const key =
      getDateKey(date);


    const record =
      attendanceMap[key];


    const leave =
      getLeaveForDate(
        date
      );


    const isSunday =
      date.getDay() === 0;


    // ==================================================
    // SUNDAY
    // ==================================================

    if (isSunday) {

      tableRows.push({
        date,

        weekday:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday:
                "long",
            }
          ),

        inTime: "",

        outTime: "",

        workingHours: 0,

        lateMark: false,

        lateMinutes: 0,

        leaveType: "",

        leaveName: "",

        leavePayment: "",

        status: "Holiday",

      });

      continue;
    }


    // ==================================================
    // NORMAL WORKING DAY
    // ==================================================

    const status =
      record?.status ||
      "Present";


    const inTime =
      record?.inTime || "";


    const outTime =
      record?.outTime ||
      "";


    const workingHours =
      Number(
        record?.workingHours ||
          0
      );


    const lateMark =
      record?.lateMark ||
      false;


    const lateMinutes =
      Number(
        record?.lateMinutes ||
          0
      );


    // ==================================================
    // LEAVE
    // ==================================================

    let leaveType = "";

    let leaveName = "";

    let leavePayment = "";


    /*
      Important:

      Only Absence checks leave.
    */

    if (
      status === "Absent" &&
      leave
    ) {

      leaveType =
        leave.leaveType;


      if (
        leave.leaveType ===
        "CL"
      ) {

        leaveName =
          "Casual Leave";

        leavePayment =
          "Paid";

      }


      if (
        leave.leaveType ===
        "SL"
      ) {

        leaveName =
          "Sick Leave";

        leavePayment =
          "Paid";

      }


      if (
        leave.leaveType ===
        "LOP"
      ) {

        leaveName =
          "Loss of Pay";

        leavePayment =
          "LOP";

      }
    }


    // ==================================================
    // ADD ROW
    // ==================================================

    tableRows.push({

      date,

      weekday:
        date.toLocaleDateString(
          "en-IN",
          {
            weekday:
              "long",
          }
        ),

      inTime,

      outTime,

      workingHours,

      lateMark,

      lateMinutes,

      leaveType,

      leaveName,

      leavePayment,

      status,

    });
  }


  // ==================================================
  // SUMMARY
  // ==================================================

  const calendarDays =
    tableRows.length;


  // As requested:
  // working days includes Sunday/holiday.

  const workingDays =
    calendarDays;


  const sundayDays =
    tableRows.filter(
      (row) =>
        row.status ===
        "Holiday"
    ).length;


  const presentDays =
    tableRows.filter(
      (row) =>
        row.status ===
        "Present"
    ).length;


  const absentDays =
    tableRows.filter(
      (row) =>
        row.status ===
        "Absent"
    ).length;


  const lateMarks =
    tableRows.filter(
      (row) =>
        row.lateMark ===
        true
    ).length;


  const totalLateMinutes =
    tableRows.reduce(
      (
        total,
        row
      ) =>
        total +
        Number(
          row.lateMinutes ||
            0
        ),
      0
    );


  // ==================================================
  // CL
  // ==================================================

  const clDays =
    tableRows
      .filter(
        (row) =>
          row.leaveType ===
          "CL"
      )
      .reduce(
        (
          total,
          row
        ) =>
          total +
          (
            row.leave?.duration ===
            "Half Day"
              ? 0.5
              : 1
          ),
        0
      );


  // ==================================================
  // SL
  // ==================================================

  const slDays =
    tableRows
      .filter(
        (row) =>
          row.leaveType ===
          "SL"
      )
      .reduce(
        (
          total,
          row
        ) =>
          total +
          (
            row.leave?.duration ===
            "Half Day"
              ? 0.5
              : 1
          ),
        0
      );


  // ==================================================
  // LOP
  // ==================================================

  const lopDays =
    tableRows
      .filter(
        (row) =>
          row.leaveType ===
          "LOP"
      )
      .reduce(
        (
          total,
          row
        ) =>
          total +
          (
            row.leave?.duration ===
            "Half Day"
              ? 0.5
              : 1
          ),
        0
      );


  const paidLeaveDays =
    clDays +
    slDays;


  // ==================================================
  // UNPAID ABSENCE
  // ==================================================

  const unpaidAbsenceDays =
    tableRows.filter(
      (row) =>
        row.status ===
          "Absent" &&
        !row.leaveType
    ).length;


  // ==================================================
  // CALCULATE SALARY
  // ==================================================

  const calculateSalary =
    async () => {

      if (!employeeId) {

        alert(
          "Please select employee"
        );

        return;
      }


      if (!monthlySalary) {

        alert(
          "Please enter monthly salary"
        );

        return;
      }


      if (
        attendance.length ===
        0
      ) {

        alert(
          "No attendance found for this employee and month"
        );

        return;
      }


      try {

        setCalculating(
          true
        );


        const response =
          await axios.post(
            "/api/salary/calculate",
            {
              employeeId,

              month:
                Number(month),

              year:
                Number(year),

              monthlySalary:
                Number(
                  monthlySalary
                ),
            }
          );


        if (
          response.data.success
        ) {

          /*
            IMPORTANT:

            Use the FRESH calculation,
            not an old salary value.
          */

          setSalary({
            ...response.data.salary,

            ...response.data.calculation,
          });

        } else {

          alert(
            response.data.message ||
              "Salary calculation failed"
          );

        }

      } catch (error) {

        console.error(
          "Salary calculation error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to calculate salary"
        );

      } finally {

        setCalculating(
          false
        );
      }
    };


  // ==================================================
  // MONEY
  // ==================================================

  const money =
    (value) =>
      new Intl.NumberFormat(
        "en-IN",
        {
          style:
            "currency",

          currency:
            "INR",

          maximumFractionDigits:
            2,
        }
      ).format(
        Number(
          value || 0
        )
      );


  const selectedEmployee =
    employees.find(
      (employee) =>
        employee._id ===
        employeeId
    );


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">


      {/* ==============================================
          HEADER
      ============================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Salary Management
        </h1>

        <p className="text-gray-500 mt-2">
          Review attendance and leave information before calculating salary.
        </p>

      </div>


      {/* ==============================================
          SELECTION
      ============================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <h2 className="text-lg font-bold mb-6">
          Payroll Details
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


          {/* EMPLOYEE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Employee
            </label>

            <select
              value={
                employeeId
              }
              onChange={(e) => {

                setEmployeeId(
                  e.target.value
                );

                setSalary(
                  null
                );

              }}
              disabled={
                loadingEmployees
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white outline-none focus:border-blue-500"
            >

              <option value="">

                {loadingEmployees
                  ? "Loading employees..."
                  : "Select Employee"}

              </option>


              {employees.map(
                (
                  employee
                ) => (

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
                    -{" "}
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

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Month
            </label>

            <select
              value={month}
              onChange={(e) => {

                setMonth(
                  Number(
                    e.target.value
                  )
                );

                setSalary(
                  null
                );

              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
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
                  name,
                  index
                ) => (

                  <option
                    key={
                      name
                    }
                    value={
                      index + 1
                    }
                  >
                    {name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* YEAR */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>

            <input
              type="number"
              value={
                year
              }
              onChange={(e) => {

                setYear(
                  e.target.value
                );

                setSalary(
                  null
                );

              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />

          </div>


          {/* MONTHLY SALARY */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Salary
            </label>

            <input
              type="number"
              min="0"
              value={
                monthlySalary
              }
              onChange={(e) => {

                setMonthlySalary(
                  e.target.value
                );

                setSalary(
                  null
                );

              }}
              placeholder="20000"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </div>


      {/* ==============================================
          LOADING
      ============================================== */}

      {loadingData && (

        <div className="bg-white rounded-2xl border p-10 text-center mb-6">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading attendance and leave records...
          </p>

        </div>

      )}


      {/* ==============================================
          EMPLOYEE HEADER
      ============================================== */}

      {!loadingData &&
        selectedEmployee && (

          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6">

            <p className="text-blue-100 text-sm">
              Payroll Employee
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {
                selectedEmployee.employeeFullName
              }
            </h2>

            <p className="text-blue-100 mt-1">
              {
                selectedEmployee.employeeCode
              }{" "}
              •{" "}
              {monthName}{" "}
              {year}
            </p>

          </div>
        )}


      {/* ==============================================
          SUMMARY
      ============================================== */}

      {!loadingData &&
        selectedEmployee &&
        tableRows.length > 0 && (

          <>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">

              <SummaryCard
                label="Calendar Days"
                value={
                  calendarDays
                }
              />

              <SummaryCard
                label="Working Days"
                value={
                  workingDays
                }
              />

              <SummaryCard
                label="Sunday / Holiday"
                value={
                  sundayDays
                }
              />

              <SummaryCard
                label="Present"
                value={
                  presentDays
                }
              />

              <SummaryCard
                label="Absent"
                value={
                  absentDays
                }
              />

              <SummaryCard
                label="Late Marks"
                value={
                  lateMarks
                }
              />

            </div>


            {/* LEAVE SUMMARY */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

              <h3 className="font-bold text-gray-900 mb-4">
                Leave Summary
              </h3>

              <div className="flex flex-wrap gap-6 text-sm">

                <div>
                  Casual Leave:{" "}
                  <strong className="text-green-600">
                    {clDays} Days
                  </strong>
                </div>

                <div>
                  Sick Leave:{" "}
                  <strong className="text-blue-600">
                    {slDays} Days
                  </strong>
                </div>

                <div>
                  Paid Leave:{" "}
                  <strong className="text-green-600">
                    {paidLeaveDays} Days
                  </strong>
                </div>

                <div>
                  LOP:{" "}
                  <strong className="text-red-600">
                    {lopDays} Days
                  </strong>
                </div>

                <div>
                  Unpaid Absence:{" "}
                  <strong className="text-orange-600">
                    {
                      unpaidAbsenceDays
                    } Days
                  </strong>
                </div>

                <div>
                  Late Minutes:{" "}
                  <strong className="text-orange-600">
                    {
                      totalLateMinutes
                    } min
                  </strong>
                </div>

              </div>

            </div>

          </>
        )}


      {/* ==============================================
          TABLE
      ============================================== */}

      {!loadingData &&
        selectedEmployee &&
        tableRows.length > 0 && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

            <div className="px-6 py-5 border-b">

              <h2 className="text-lg font-bold">
                Attendance & Leave Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {monthName}{" "}
                {year}
              </p>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Weekday
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      In
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Out
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Working Hours
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Late
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Leave
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y">

                  {tableRows.map(
                    (row) => (

                      <tr
                        key={getDateKey(
                          row.date
                        )}
                        className="hover:bg-gray-50"
                      >

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">

                          {row.date.toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}

                        </td>


                        {/* WEEKDAY */}

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {row.weekday}
                        </td>


                        {/* IN */}

                        <td className="px-5 py-4 text-sm">
                          {row.inTime ||
                            "-"}
                        </td>


                        {/* OUT */}

                        <td className="px-5 py-4 text-sm">
                          {row.outTime ||
                            "-"}
                        </td>


                        {/* HOURS */}

                        <td className="px-5 py-4 text-sm">
                          {row.workingHours
                            ? `${row.workingHours} hrs`
                            : "-"}
                        </td>


                        {/* LATE */}

                        <td className="px-5 py-4">

                          {row.status ===
                          "Holiday" ? (

                            <span className="text-gray-400">
                              -
                            </span>

                          ) : row.lateMark ? (

                            <div>

                              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                Late
                              </span>

                              <p className="text-xs text-orange-500 mt-1">
                                {
                                  row.lateMinutes
                                }{" "}
                                min
                              </p>

                            </div>

                          ) : (

                            <span className="text-gray-400">
                              -
                            </span>

                          )}

                        </td>


                        {/* LEAVE */}

                        <td className="px-5 py-4">

                          {row.leaveType ? (

                            <div>

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  row.leaveType ===
                                  "CL"
                                    ? "bg-green-100 text-green-700"
                                    : row.leaveType ===
                                      "SL"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {
                                  row.leaveType
                                }
                              </span>

                              <p className="text-xs text-gray-500 mt-1">
                                {
                                  row.leaveName
                                }
                              </p>

                            </div>

                          ) : (

                            <span className="text-gray-400">
                              -
                            </span>

                          )}

                        </td>


                        {/* PAYMENT */}

                        <td className="px-5 py-4">

                          {row.leavePayment ===
                          "Paid" ? (

                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Paid
                            </span>

                          ) : row.leavePayment ===
                            "LOP" ? (

                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              LOP
                            </span>

                          ) : row.status ===
                            "Absent" ? (

                            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              Unpaid
                            </span>

                          ) : row.status ===
                            "Holiday" ? (

                            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              Holiday
                            </span>

                          ) : (

                            <span className="text-gray-400">
                              -
                            </span>

                          )}

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={
                              row.status
                            }
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}


      {/* ==============================================
          CALCULATE BUTTON
      ============================================== */}

      {!loadingData &&
        attendance.length > 0 && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h3 className="font-bold text-gray-900">
                  Calculate Salary
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Review all attendance and leave details before calculating.
                </p>

              </div>


              <button
                onClick={
                  calculateSalary
                }
                disabled={
                  calculating
                }
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
              >

                {calculating
                  ? "Calculating..."
                  : "Calculate Salary"}

              </button>

            </div>

          </div>
        )}


      {/* ==============================================
          FINAL SALARY
      ============================================== */}

      {salary && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-7 text-white">

            <p className="text-green-100 text-sm">
              Final Salary Calculation
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {money(
                salary.netSalary
              )}
            </h2>

            <p className="text-green-100 mt-2">
              {monthName}{" "}
              {year}
            </p>

          </div>


          <div className="p-6">

            {/* ==========================================
                ATTENDANCE
            ========================================== */}

            <h3 className="text-lg font-bold mb-4">
              Attendance Summary
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

              <ResultCard
                label="Calendar Days"
                value={
                  salary.workingDays
                }
              />

              <ResultCard
                label="Sunday / Holiday"
                value={
                  salary.holidayDays ||
                  0
                }
              />

              <ResultCard
                label="Present Days"
                value={
                  salary.presentDays
                }
              />

              <ResultCard
                label="Absent Days"
                value={
                  salary.absentDays
                }
              />

              <ResultCard
                label="Late Marks"
                value={
                  salary.lateMarks ||
                  0
                }
              />

              <ResultCard
                label="Late Minutes"
                value={`${
                  salary.totalLateMinutes ||
                  0
                } min`}
              />

            </div>


            {/* ==========================================
                LEAVES
            ========================================== */}

            <h3 className="text-lg font-bold mb-4">
              Leave Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

              <LeaveCard
                title="Casual Leave"
                value={
                  salary.casualLeaveDays ||
                  0
                }
                subtitle="Paid • No Deduction"
                className="green"
              />

              <LeaveCard
                title="Sick Leave"
                value={
                  salary.sickLeaveDays ||
                  0
                }
                subtitle="Paid • No Deduction"
                className="blue"
              />

              <LeaveCard
                title="LOP"
                value={
                  salary.lopDays ||
                  0
                }
                subtitle="Salary Deduction"
                className="red"
              />

              <LeaveCard
                title="Unpaid Absence"
                value={
                  salary.unpaidAbsenceDays ||
                  0
                }
                subtitle="Salary Deduction"
                className="orange"
              />

            </div>


            {/* ==========================================
                SALARY CALCULATION
            ========================================== */}

            <div className="rounded-2xl bg-gray-50 p-6">

              <h3 className="text-lg font-bold mb-5">
                Salary Calculation
              </h3>


              {/* MONTHLY */}

              <div className="flex items-center justify-between border-b py-4">

                <span className="text-gray-500">
                  Monthly Salary
                </span>

                <span className="font-bold">
                  {money(
                    salary.monthlySalary
                  )}
                </span>

              </div>


              {/* PER DAY */}

              <div className="flex items-center justify-between border-b py-4">

                <div>

                  <span className="text-gray-500">
                    Per Day Salary
                  </span>

                  <p className="text-xs text-gray-400 mt-1">
                    Monthly Salary ÷ Working Days
                  </p>

                </div>

                <span className="font-bold">
                  {money(
                    salary.perDaySalary
                  )}
                </span>

              </div>


              {/* PAID CL */}

              <div className="flex justify-between border-b py-4">

                <span className="text-gray-500">
                  Casual Leave
                </span>

                <span className="font-semibold text-green-600">
                  {
                    salary.casualLeaveDays ||
                    0
                  }{" "}
                  Days • Paid
                </span>

              </div>


              {/* PAID SL */}

              <div className="flex justify-between border-b py-4">

                <span className="text-gray-500">
                  Sick Leave
                </span>

                <span className="font-semibold text-blue-600">
                  {
                    salary.sickLeaveDays ||
                    0
                  }{" "}
                  Days • Paid
                </span>

              </div>


              {/* LOP */}

              <div className="flex justify-between border-b py-4">

                <span className="text-gray-500">
                  LOP Days
                </span>

                <span className="font-semibold text-red-600">
                  {
                    salary.lopDays ||
                    0
                  }{" "}
                  Days
                </span>

              </div>


              {/* UNPAID */}

              <div className="flex justify-between border-b py-4">

                <span className="text-gray-500">
                  Unpaid Absence
                </span>

                <span className="font-semibold text-orange-600">
                  {
                    salary.unpaidAbsenceDays ||
                    0
                  }{" "}
                  Days
                </span>

              </div>


              {/* LATE */}

              <div className="flex justify-between border-b py-4">

                <span className="text-gray-500">
                  Late Marks
                </span>

                <span className="font-semibold text-orange-600">
                  {
                    salary.lateMarks ||
                    0
                  }
                </span>

              </div>


              {/* DEDUCTION */}

              <div className="flex items-center justify-between border-b py-5">

                <div>

                  <span className="font-bold text-gray-700">
                    Total Deduction
                  </span>

                  <p className="text-xs text-gray-400 mt-1">
                    (LOP + Unpaid Absence) × Per Day Salary
                  </p>

                </div>

                <span className="text-xl font-bold text-red-600">
                  -{" "}
                  {money(
                    salary.lopDeduction
                  )}
                </span>

              </div>


              {/* NET */}

              <div className="mt-6 rounded-2xl bg-green-100 border border-green-200 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-green-700">
                      Net Salary
                    </p>

                    <p className="text-3xl font-bold text-green-700 mt-1">
                      {money(
                        salary.netSalary
                      )}
                    </p>

                  </div>

                  <div className="text-4xl">
                    💰
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  label,
  value,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold mt-2 text-gray-900">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// RESULT CARD
// ======================================================

function ResultCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-lg font-bold mt-2">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// LEAVE CARD
// ======================================================

function LeaveCard({
  title,
  value,
  subtitle,
  className,
}) {
  const styles = {
    green:
      "bg-green-50 border-green-100 text-green-700",

    blue:
      "bg-blue-50 border-blue-100 text-blue-700",

    red:
      "bg-red-50 border-red-100 text-red-700",

    orange:
      "bg-orange-50 border-orange-100 text-orange-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 ${
        styles[className]
      }`}
    >

      <p className="text-sm">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value} Days
      </p>

      <p className="text-xs mt-2">
        {subtitle}
      </p>

    </div>
  );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
}) {
  if (
    status === "Holiday"
  ) {
    return (
      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        Holiday
      </span>
    );
  }

  if (
    status === "Absent"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Absent
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      Present
    </span>
  );
}