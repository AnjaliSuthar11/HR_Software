// 2nd september - petty cash,rigester salry
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function SalaryPage() {
  const [activeSection, setActiveSection] = useState("calculate");

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [year, setYear] = useState(new Date().getFullYear());

  const [monthlySalary, setMonthlySalary] = useState("");

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [salary, setSalary] = useState(null);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const [salaryList, setSalaryList] = useState([]);
  const [loadingSalaryList, setLoadingSalaryList] = useState(false);

  // =====================================================
  // PETTY CASH
  // =====================================================

  const [pettyCash, setPettyCash] = useState([]);
  const [pettyCashTotal, setPettyCashTotal] = useState(0);
  const [pettyCashLoading, setPettyCashLoading] = useState(false);

  const [pettyCashForm, setPettyCashForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
    paidTo: "",
    paymentMethod: "Cash",
    reference: "",
    notes: "",
  });

  // =====================================================
  // MONTH
  // =====================================================

  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

  const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString(
    "en-IN",
    {
      month: "long",
    }
  );

  // =====================================================
  // DATE KEY
  // =====================================================

  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // =====================================================
  // EMPLOYEES
  // =====================================================

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoadingEmployees(true);

      const response = await axios.get("/api/employee/list");

      setEmployees(response.data?.employees || []);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  }

  // =====================================================
  // ATTENDANCE
  // =====================================================

  async function loadAttendance() {
    const response = await axios.get(
      `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
    );

    setAttendance(response.data?.attendance || []);
  }

  // =====================================================
  // LEAVES
  // =====================================================

  async function loadLeaves() {
    const response = await axios.get(
      `/api/employee/leave?employeeId=${employeeId}`
    );

    setLeaves(response.data?.leaves || []);
  }

  // =====================================================
  // HOLIDAYS
  // =====================================================

  async function loadHolidays() {
    const response = await axios.get(`/api/holiday?year=${year}`);

    setHolidays(response.data?.holidays || []);
  }

  // =====================================================
  // LOAD CALCULATION DATA
  // =====================================================

  useEffect(() => {
    if (activeSection !== "calculate") {
      return;
    }

    if (!employeeId) {
      setAttendance([]);
      setLeaves([]);
      setHolidays([]);
      setSalary(null);

      return;
    }

    loadPayrollData();
  }, [employeeId, month, year, activeSection]);

  async function loadPayrollData() {
    try {
      setLoadingData(true);
      setSalary(null);

      await Promise.all([loadAttendance(), loadLeaves(), loadHolidays()]);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to load payroll data");
    } finally {
      setLoadingData(false);
    }
  }

  // =====================================================
  // SELECTED EMPLOYEE
  // =====================================================

  const selectedEmployee = employees.find(
    (employee) => employee._id === employeeId
  );

  // =====================================================
  // ATTENDANCE MAP
  // =====================================================

  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((record) => {
      map[getDateKey(record.date)] = record;
    });

    return map;
  }, [attendance]);

  // =====================================================
  // HOLIDAY MAP
  // =====================================================

  const holidayMap = useMemo(() => {
    const map = {};

    holidays
      .filter((holiday) => holiday.paid !== false)
      .forEach((holiday) => {
        map[getDateKey(holiday.date)] = holiday;
      });

    return map;
  }, [holidays]);

  // =====================================================
  // BIRTHDAY
  // =====================================================

  const birthdayKey = useMemo(() => {
    if (!selectedEmployee?.dateOfBirth) {
      return null;
    }

    const dob = new Date(selectedEmployee.dateOfBirth);

    const birthday = new Date(Number(year), dob.getMonth(), dob.getDate());

    birthday.setHours(0, 0, 0, 0);

    return getDateKey(birthday);
  }, [selectedEmployee, year]);

  // =====================================================
  // APPROVED LEAVES
  // =====================================================

  const approvedLeaves = useMemo(() => {
    const firstDay = new Date(Number(year), Number(month) - 1, 1);

    const nextMonth = new Date(Number(year), Number(month), 1);

    firstDay.setHours(0, 0, 0, 0);
    nextMonth.setHours(0, 0, 0, 0);

    return leaves
      .filter((leave) => leave.status === "Approved")
      .filter((leave) => {
        const from = new Date(leave.fromDate);

        const to = new Date(leave.toDate);

        return from < nextMonth && to >= firstDay;
      })
      .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
  }, [leaves, month, year]);

  // =====================================================
  // LEAVE TREATMENT
  // =====================================================

  const leaveTreatmentMap = useMemo(() => {
    const map = {};

    let paidLeaveUsed = 0;

    for (const leave of approvedLeaves) {
      const start = new Date(leave.fromDate);

      const end = new Date(leave.toDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const current = new Date(start);

      while (current <= end) {
        const key = getDateKey(current);

        const isSunday = current.getDay() === 0;

        const isSecondSaturday =
          current.getDay() === 6 && Math.ceil(current.getDate() / 7) === 2;

        const isFourthSaturday =
          current.getDay() === 6 && Math.ceil(current.getDate() / 7) === 4;

        const hrHoliday = holidayMap[key];

        const isBirthday = birthdayKey === key;

        const holiday =
          isSunday ||
          isSecondSaturday ||
          isFourthSaturday ||
          !!hrHoliday ||
          isBirthday;

        if (!holiday) {
          const record = attendanceMap[key];

          if (record?.status === "Absent") {
            const requestedDays = leave.duration === "Half Day" ? 0.5 : 1;

            // =================================================
            // CL / SL
            // =================================================

            if (leave.leaveType === "CL" || leave.leaveType === "SL") {
              if (paidLeaveUsed < 1) {
                const available = 1 - paidLeaveUsed;

                const paid = Math.min(requestedDays, available);

                const lop = Math.max(requestedDays - paid, 0);

                paidLeaveUsed += paid;

                map[key] = {
                  leaveType: leave.leaveType,

                  leaveName:
                    leave.leaveType === "CL" ? "Casual Leave" : "Sick Leave",

                  payment: lop > 0 ? "LOP" : "Paid",

                  paidDays: paid,
                  lopDays: lop,
                };
              } else {
                map[key] = {
                  leaveType: leave.leaveType,

                  leaveName:
                    leave.leaveType === "CL" ? "Casual Leave" : "Sick Leave",

                  payment: "LOP",

                  paidDays: 0,

                  lopDays: requestedDays,
                };
              }
            }

            // =================================================
            // PRIVILEGE LEAVE
            // =================================================

            if (leave.leaveType === "PL") {
              map[key] = {
                leaveType: "PL",

                leaveName: "Privilege Leave",

                payment: "Paid",

                paidDays: requestedDays,

                lopDays: 0,
              };
            }

            // =================================================
            // DIRECT LOP
            // =================================================

            if (leave.leaveType === "LOP") {
              map[key] = {
                leaveType: "LOP",
                leaveName: "Loss of Pay",
                payment: "LOP",
                paidDays: 0,
                lopDays: requestedDays,
              };
            }
          }
        }

        current.setDate(current.getDate() + 1);
      }
    }

    return map;
  }, [approvedLeaves, attendanceMap, holidayMap, birthdayKey]);

  // =====================================================
  // COMPLETE TABLE
  // =====================================================

  const tableRows = useMemo(() => {
    const rows = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Number(year), Number(month) - 1, day);

      date.setHours(0, 0, 0, 0);

      const key = getDateKey(date);

      const record = attendanceMap[key];

      const hrHoliday = holidayMap[key];

      const isSunday = date.getDay() === 0;

      const isSecondSaturday =
        date.getDay() === 6 && Math.ceil(date.getDate() / 7) === 2;

      const isFourthSaturday =
        date.getDay() === 6 && Math.ceil(date.getDate() / 7) === 4;

      const isBirthday = birthdayKey === key;

      const leaveInfo = leaveTreatmentMap[key];

      let leaveType = "";
      let leaveName = "";
      let leavePayment = "";

      const isHoliday =
        isSunday ||
        isSecondSaturday ||
        isFourthSaturday ||
        !!hrHoliday ||
        isBirthday;

      // ===================================================
      // LEAVE
      // ===================================================

      if (!isHoliday && record?.status === "Absent" && leaveInfo) {
        leaveType = leaveInfo.leaveType;

        leaveName = leaveInfo.leaveName;

        leavePayment = leaveInfo.payment;
      }

      // ===================================================
      // PAYROLL STATUS
      // ===================================================

      let payrollType = "Paid";

      if (isSunday) {
        payrollType = "Paid Holiday";
      } else if (isSecondSaturday) {
        payrollType = "Paid Holiday";
      } else if (isFourthSaturday) {
        payrollType = "Paid Holiday";
      } else if (hrHoliday) {
        payrollType = "Paid Holiday";
      } else if (isBirthday) {
        payrollType = "Paid Birthday";
      } else if (leavePayment === "Paid") {
        payrollType = "Paid Leave";
      } else if (leavePayment === "LOP") {
        payrollType = "LOP";
      } else if (record?.status === "Absent") {
        payrollType = "Unpaid Absence";
      }

      rows.push({
        date,

        inTime: record?.inTime || "",

        outTime: record?.outTime || "",

        workingHours: Number(record?.workingHours || 0),

        lateMark: record?.lateMark === true,

        lateMinutes: Number(record?.lateMinutes || 0),

        status: record?.status || "Absent",

        leaveType,
        leaveName,
        leavePayment,

        payrollType,

        isSunday,
        isSecondSaturday,
        isFourthSaturday,
        isBirthday,
        hrHoliday,
      });
    }

    return rows;
  }, [
    daysInMonth,
    year,
    month,
    attendanceMap,
    holidayMap,
    birthdayKey,
    leaveTreatmentMap,
  ]);

  // =====================================================
  // SUMMARY
  //
  // ONE DAY = ONE CATEGORY
  // =====================================================

  const presentDays = tableRows.filter((row) => {
    const isHoliday =
      row.isSunday ||
      row.isSecondSaturday ||
      row.isFourthSaturday ||
      row.hrHoliday ||
      row.isBirthday;

    return !isHoliday && row.status === "Present";
  }).length;

  const holidayDays = tableRows.filter(
    (row) =>
      row.isSunday ||
      row.isSecondSaturday ||
      row.isFourthSaturday ||
      row.hrHoliday ||
      row.isBirthday
  ).length;

  const paidLeaveDays = tableRows.reduce((sum, row) => {
    const isHoliday =
      row.isSunday ||
      row.isSecondSaturday ||
      row.isFourthSaturday ||
      row.hrHoliday ||
      row.isBirthday;

    if (isHoliday) {
      return sum;
    }

    return sum + Number(leaveTreatmentMap[getDateKey(row.date)]?.paidDays || 0);
  }, 0);

  const lopDays = tableRows.reduce((sum, row) => {
    const isHoliday =
      row.isSunday ||
      row.isSecondSaturday ||
      row.isFourthSaturday ||
      row.hrHoliday ||
      row.isBirthday;

    if (isHoliday) {
      return sum;
    }

    return sum + Number(leaveTreatmentMap[getDateKey(row.date)]?.lopDays || 0);
  }, 0);

  const unpaidAbsenceDays = tableRows.filter((row) => {
    const isHoliday =
      row.isSunday ||
      row.isSecondSaturday ||
      row.isFourthSaturday ||
      row.hrHoliday ||
      row.isBirthday;

    if (isHoliday) {
      return false;
    }

    if (row.status === "Present") {
      return false;
    }

    const leaveInfo = leaveTreatmentMap[getDateKey(row.date)];

    if (leaveInfo) {
      return false;
    }

    return row.status === "Absent";
  }).length;

  const paidDays = presentDays + holidayDays + paidLeaveDays;

  const deductibleDays = lopDays + unpaidAbsenceDays;

  // =====================================================
  // LATE MARKS - PREVIEW
  // =====================================================

  const lateMarks = tableRows.filter(
    (row) =>
      row.lateMark &&
      !row.isSunday &&
      !row.isSecondSaturday &&
      !row.isFourthSaturday &&
      !row.hrHoliday &&
      !row.isBirthday
  ).length;

  // =====================================================
  // LATE DEDUCTION PREVIEW
  // =====================================================

  const previewPerDaySalary =
    monthlySalary && daysInMonth ? Number(monthlySalary) / daysInMonth : 0;

  let lateDeductionDays = 0;

  if (lateMarks <= 3) {
    lateDeductionDays = 0;
  } else if (lateMarks === 4) {
    lateDeductionDays = 0.5;
  } else {
    lateDeductionDays = 1 + (lateMarks - 5) * 0.5;
  }

  const previewLateDeduction = lateDeductionDays * previewPerDaySalary;

  // =====================================================
  // VALIDATION
  // =====================================================

  const classifiedDays =
    presentDays + holidayDays + paidLeaveDays + lopDays + unpaidAbsenceDays;

  console.log("========== SALARY SUMMARY ==========");

  console.log("Total Calendar Days:", daysInMonth);

  console.log("Present Days:", presentDays);

  console.log("Holiday Days:", holidayDays);

  console.log("Paid Leave Days:", paidLeaveDays);

  console.log("LOP Days:", lopDays);

  console.log("Unpaid Absence Days:", unpaidAbsenceDays);

  console.log("Classified Days:", classifiedDays);

  console.log("VALID:", classifiedDays === daysInMonth);

  console.log("Late Marks:", lateMarks);

  console.log("Late Deduction Days:", lateDeductionDays);

  console.log("Late Deduction:", previewLateDeduction);

  // =====================================================
  // CALCULATE SALARY
  // =====================================================

  const calculateSalary = async () => {
    if (!employeeId) {
      alert("Please select employee");
      return;
    }

    if (!monthlySalary) {
      alert("Please enter monthly salary");
      return;
    }

    try {
      setCalculating(true);

      const response = await axios.post("/api/salary/calculate", {
        employeeId,

        month: Number(month),

        year: Number(year),

        monthlySalary: Number(monthlySalary),
      });

      if (!response.data?.success) {
        alert(response.data?.message || "Salary calculation failed");

        return;
      }

      setSalary(response.data.salary);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to calculate salary");
    } finally {
      setCalculating(false);
    }
  };

  // =====================================================
  // SALARY REGISTER
  // =====================================================

  useEffect(() => {
    if (activeSection === "register") {
      loadSalaryRegister();
    }
  }, [activeSection, month, year]);

  const loadSalaryRegister = async () => {
    try {
      setLoadingSalaryList(true);

      const response = await axios.get(
        `/api/salary/list?month=${month}&year=${year}`
      );

      setSalaryList(response.data?.salaries || []);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to load salary register");
    } finally {
      setLoadingSalaryList(false);
    }
  };

  // =====================================================
  // EXCEL
  // =====================================================

  const downloadSalaryExcel = () => {
    if (salaryList.length === 0) {
      alert("No salary records found.");

      return;
    }

    const rows = salaryList.map((item, index) => {
      const deductedDays =
        item.deductibleDays ??
        Number(item.lopDays || 0) + Number(item.unpaidAbsenceDays || 0);

      const totalDeduction = item.totalDeduction ?? item.lopDeduction ?? 0;

      return {
        "S.No": index + 1,

        "Employee Code": item.employeeCode,

        "Employee Name": item.employeeName,

        Month: `${monthName} ${year}`,

        "Actual Salary": item.actualSalary ?? item.monthlySalary ?? 0,

        "Total Days": item.totalDays ?? item.workingDays ?? 0,

        "Present Days": item.presentDays || 0,

        "Holiday Days": item.holidayDays || 0,

        "Paid Leave": item.paidLeaveDays || 0,

        "Paid Days": item.paidDays ?? item.payableDays ?? 0,

        "LOP Days": item.lopDays || 0,

        "Unpaid Absence": item.unpaidAbsenceDays || 0,

        "Deducted Days": deductedDays,

        "Late Marks": item.lateMarks || 0,

        "Late Deduction Days": item.lateDeductionDays || 0,

        "Late Deduction": item.lateDeduction || 0,

        "Per Day Salary": item.perDaySalary || 0,

        "Total Deduction": totalDeduction,

        "Net Salary": item.netSalary || 0,

        Status: item.status || "Calculated",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Register");

    XLSX.writeFile(workbook, `Salary_Register_${monthName}_${year}.xlsx`);
  };

  // =====================================================
  // PETTY CASH
  // =====================================================

  const loadPettyCash = async () => {
    try {
      setPettyCashLoading(true);

      const response = await axios.get(
        `/api/pettycash?month=${month}&year=${year}`
      );

      setPettyCash(response.data?.expenses || []);

      setPettyCashTotal(Number(response.data?.total || 0));
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to load petty cash");
    } finally {
      setPettyCashLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "pettycash") {
      loadPettyCash();
    }
  }, [activeSection, month, year]);

  const addPettyCash = async (e) => {
    e.preventDefault();

    if (
      !pettyCashForm.date ||
      !pettyCashForm.category ||
      !pettyCashForm.description ||
      Number(pettyCashForm.amount) <= 0
    ) {
      alert("Please fill all required fields.");

      return;
    }

    try {
      await axios.post("/api/pettycash", {
        ...pettyCashForm,

        amount: Number(pettyCashForm.amount),
      });

      setPettyCashForm({
        date: new Date().toISOString().split("T")[0],

        category: "",
        description: "",
        amount: "",
        paidTo: "",
        paymentMethod: "Cash",
        reference: "",
        notes: "",
      });

      await loadPettyCash();

      alert("Expense added successfully.");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to add expense");
    }
  };

  const deletePettyCash = async (id) => {
    if (!window.confirm("Delete this expense?")) {
      return;
    }

    try {
      await axios.delete(`/api/pettycash?id=${id}`);

      await loadPettyCash();
    } catch (error) {
      console.error(error);

      alert("Unable to delete expense");
    }
  };

  const updatePettyField = (field, value) => {
    setPettyCashForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // MONEY
  // =====================================================

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  // =====================================================
  // REGISTER TOTALS
  // =====================================================

  const registerTotals = useMemo(() => {
    return {
      actualSalary: salaryList.reduce(
        (sum, item) =>
          sum + Number(item.actualSalary ?? item.monthlySalary ?? 0),
        0
      ),

      deduction: salaryList.reduce(
        (sum, item) =>
          sum + Number(item.totalDeduction ?? item.lopDeduction ?? 0),
        0
      ),

      netSalary: salaryList.reduce(
        (sum, item) => sum + Number(item.netSalary || 0),
        0
      ),

      lateDeduction: salaryList.reduce(
        (sum, item) => sum + Number(item.lateDeduction || 0),
        0
      ),
    };
  }, [salaryList]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Salary Management
          </h1>

          <p className="text-gray-500 mt-2">
            Payroll, salary register and petty cash management.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));

              setSalary(null);
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
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
            ].map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));

              setSalary(null);
            }}
            className="w-28 rounded-xl border border-gray-200 bg-white px-4 py-3"
          />
        </div>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-6 flex flex-col md:flex-row gap-2">
        <NavigationButton
          active={activeSection === "calculate"}
          onClick={() => setActiveSection("calculate")}
          icon="🧮"
          title="Calculate Salary"
        />

        <NavigationButton
          active={activeSection === "register"}
          onClick={() => setActiveSection("register")}
          icon="📊"
          title="Salary Register"
        />

        <NavigationButton
          active={activeSection === "pettycash"}
          onClick={() => setActiveSection("pettycash")}
          icon="💰"
          title="Petty Cash"
        />
      </div>

      {/* =================================================
          CALCULATE SECTION
      ================================================= */}

      {activeSection === "calculate" && (
        <>
          {/* PAYROLL DETAILS */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Payroll Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Employee */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee
                </label>

                <select
                  value={employeeId}
                  disabled={loadingEmployees}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);

                    setSalary(null);
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white"
                >
                  <option value="">
                    {loadingEmployees
                      ? "Loading employees..."
                      : "Select Employee"}
                  </option>

                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.employeeFullName} - {employee.employeeCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Month
                </label>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  {monthName}
                </div>
              </div>

              {/* Year */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  {year}
                </div>
              </div>

              {/* Salary */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Salary
                </label>

                <input
                  type="number"
                  min="0"
                  value={monthlySalary}
                  onChange={(e) => {
                    setMonthlySalary(e.target.value);

                    setSalary(null);
                  }}
                  placeholder="20000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* LOADING */}

          {loadingData && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center mb-6">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

              <p className="text-gray-500">
                Loading attendance and leave records...
              </p>
            </div>
          )}

          {/* EMPLOYEE */}

          {!loadingData && selectedEmployee && (
            <>
              {/* EMPLOYEE HEADER */}

              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6">
                <p className="text-blue-100 text-sm">Payroll Employee</p>

                <h2 className="text-2xl font-bold mt-1">
                  {selectedEmployee.employeeFullName}
                </h2>

                <p className="text-blue-100 mt-1">
                  {selectedEmployee.employeeCode} • {monthName} {year}
                </p>
              </div>

              {/* =================================================
                    ATTENDANCE SUMMARY
                ================================================= */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold mb-5">Attendance Summary</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  <SummaryBox label="Total Days" value={daysInMonth} />

                  <SummaryBox label="Present Days" value={presentDays} />

                  <SummaryBox label="Holiday Days" value={holidayDays} />

                  <SummaryBox label="Paid Leave" value={paidLeaveDays} />

                  <SummaryBox label="Paid Days" value={paidDays} />

                  <SummaryBox label="LOP" value={lopDays} />

                  <SummaryBox
                    label="Unpaid Absence"
                    value={unpaidAbsenceDays}
                  />
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
                  <strong>Paid Days =</strong> Present + Holidays + Paid Leave ={" "}
                  <strong>{paidDays}</strong>
                  <span className="mx-2">|</span>
                  <strong>Deducted Days =</strong> LOP + Unpaid Absence ={" "}
                  <strong>{deductibleDays}</strong>
                </div>
              </div>

              {/* =================================================
                    ATTENDANCE TABLE
                ================================================= */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">
                    Attendance & Leave Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Complete {monthName} {year}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Date",
                          "Day",
                          "In",
                          "Out",
                          "Hours",
                          "Late",
                          "Leave",
                          "Payroll",
                          "Status",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {tableRows.map((row) => (
                        <tr
                          key={getDateKey(row.date)}
                          className={
                            row.isSunday ||
                            row.isSecondSaturday ||
                            row.isFourthSaturday ||
                            row.hrHoliday ||
                            row.isBirthday
                              ? "bg-purple-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                            {row.date.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {row.date.toLocaleDateString("en-IN", {
                              weekday: "long",
                            })}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {row.inTime || "-"}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {row.outTime || "-"}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {row.workingHours ? `${row.workingHours} hrs` : "-"}
                          </td>

                          <td className="px-5 py-4">
                            {row.lateMark ? (
                              <div>
                                <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                  Late
                                </span>

                                <p className="text-xs text-orange-500 mt-1">
                                  {row.lateMinutes} min
                                </p>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {row.leaveType ? (
                              <>
                                <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
                                  {row.leaveType}
                                </span>

                                <p className="text-xs text-gray-500 mt-1">
                                  {row.leaveName}
                                </p>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <PayrollBadge type={row.payrollType} />

                            {row.isSecondSaturday && (
                              <p className="text-xs text-purple-600 mt-1">
                                2nd Saturday
                              </p>
                            )}

                            {row.isFourthSaturday && (
                              <p className="text-xs text-purple-600 mt-1">
                                4th Saturday
                              </p>
                            )}

                            {row.hrHoliday && (
                              <p className="text-xs text-purple-600 mt-1">
                                {row.hrHoliday.name}
                              </p>
                            )}

                            {row.isBirthday && (
                              <p className="text-xs text-pink-600 mt-1">
                                Birthday
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={row.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* =================================================
                    LATE MARK PREVIEW
                ================================================= */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Late Mark Deduction
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      First 3 late marks are free. The 4th late mark deducts
                      half-day salary, the 5th deducts one full day, and every
                      late mark after that adds another half-day deduction.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <MiniStat label="Late Marks" value={lateMarks} />

                    <MiniStat
                      label="Deduction Days"
                      value={lateDeductionDays}
                    />

                    <MiniStat
                      label="Late Deduction"
                      value={money(previewLateDeduction)}
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                    CALCULATE
                ================================================= */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Calculate Salary
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Salary will be calculated according to attendance,
                      holidays, approved leaves and late-mark deductions.
                    </p>
                  </div>

                  <button
                    onClick={calculateSalary}
                    disabled={calculating}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {calculating ? "Calculating..." : "Calculate & Save Salary"}
                  </button>
                </div>
              </div>

              {/* =================================================
                    RESULT
                ================================================= */}

              {salary && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-7 text-white">
                    <p className="text-green-100 text-sm">Salary Saved</p>

                    <h2 className="text-4xl font-bold mt-2">
                      {money(salary.netSalary)}
                    </h2>

                    <p className="text-green-100 mt-2">
                      {monthName} {year}
                    </p>
                  </div>

                  <div className="p-6">
                    {/* RESULT BOXES */}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <ResultBox
                        label="Actual Salary"
                        value={money(salary.monthlySalary)}
                      />

                      <ResultBox
                        label="Total Days"
                        value={salary.workingDays}
                      />

                      <ResultBox
                        label="Present Days"
                        value={salary.presentDays}
                      />

                      <ResultBox
                        label="Holiday Days"
                        value={salary.holidayDays}
                      />

                      <ResultBox label="Paid Days" value={salary.payableDays} />
                    </div>

                    {/* CALCULATION */}

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
                      <CalculationRow
                        label="Actual Monthly Salary"
                        value={money(salary.monthlySalary)}
                      />

                      <CalculationRow
                        label="Total Calendar Days"
                        value={`${salary.workingDays} Days`}
                      />

                      <CalculationRow
                        label="Present Days"
                        value={`${salary.presentDays} Days`}
                      />

                      <CalculationRow
                        label="Holiday Days"
                        value={`${salary.holidayDays} Days`}
                        valueClass="text-purple-600"
                      />

                      <CalculationRow
                        label="Paid Leave"
                        value={`${salary.paidLeaveDays} Days`}
                        valueClass="text-green-600"
                      />

                      <CalculationRow
                        label="Paid Days"
                        value={`${salary.payableDays} Days`}
                        valueClass="text-green-600"
                      />

                      <CalculationRow
                        label="LOP"
                        value={`${salary.lopDays} Days`}
                        valueClass="text-red-600"
                      />

                      <CalculationRow
                        label="Unpaid Absence"
                        value={`${salary.unpaidAbsenceDays} Days`}
                        valueClass="text-orange-600"
                      />

                      <CalculationRow
                        label="Deducted Days"
                        value={`${
                          Number(salary.lopDays || 0) +
                          Number(salary.unpaidAbsenceDays || 0)
                        } Days`}
                        valueClass="text-red-600"
                      />

                      <CalculationRow
                        label="Late Marks"
                        value={`${salary.lateMarks || 0} Marks`}
                        valueClass="text-orange-600"
                      />

                      <CalculationRow
                        label="Late Deduction Days"
                        value={`${salary.lateDeductionDays || 0} Days`}
                        valueClass="text-orange-600"
                      />

                      <CalculationRow
                        label="Late Deduction"
                        value={`- ${money(salary.lateDeduction || 0)}`}
                        valueClass="text-orange-600"
                      />

                      <CalculationRow
                        label="Per Day Salary"
                        value={money(salary.perDaySalary)}
                      />

                      <CalculationRow
                        label="Fixed Deduction"
                        value={`- ${money(salary.fixedDeduction || 200)}`}
                        valueClass="text-orange-600"
                      />

                      <CalculationRow
                        label="Total Deduction"
                        value={`- ${money(salary.lopDeduction)}`}
                        valueClass="text-red-600"
                      />

                      {/* NET SALARY */}

                      <div className="mt-6 rounded-2xl bg-green-100 border border-green-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-700">Net Salary</p>

                            <p className="text-3xl font-bold text-green-700 mt-1">
                              {money(salary.netSalary)}
                            </p>
                          </div>

                          <div className="text-4xl">💰</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* =================================================
          SALARY REGISTER
      ================================================= */}

      {activeSection === "register" && (
        <div>
          {/* HEADER */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Salary Register
                </h2>

                <p className="text-gray-500 mt-1">
                  {monthName} {year} monthly salary sheet
                </p>
              </div>

              <button
                onClick={downloadSalaryExcel}
                disabled={!salaryList.length}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-40"
              >
                ↓ Download Excel
              </button>
            </div>
          </div>

          {/* TOTALS */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryBox
              label="Actual Salary"
              value={money(registerTotals.actualSalary)}
            />

            <SummaryBox
              label="Late Deduction"
              value={money(registerTotals.lateDeduction)}
            />

            <SummaryBox
              label="Total Deduction"
              value={money(registerTotals.deduction)}
            />

            <SummaryBox
              label="Net Payroll"
              value={money(registerTotals.netSalary)}
            />
          </div>

          {/* REGISTER */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loadingSalaryList ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

                <p className="text-gray-500">Loading salary register...</p>
              </div>
            ) : salaryList.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">📋</div>

                <h3 className="font-bold text-gray-900">No salary records</h3>

                <p className="text-sm text-gray-500 mt-2">
                  No salary has been calculated for {monthName} {year}.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1800px]">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      {[
                        "S.No",
                        "Employee",
                        "Code",
                        "Actual Salary",
                        "Total Days",
                        "Present",
                        "Holiday",
                        "Paid Leave",
                        "Paid Days",
                        "LOP",
                        "Unpaid Absence",
                        "Deducted Days",
                        "Late Marks",
                        "Late Deduction Days",
                        "Late Deduction",
                        "Per Day",
                        "Total Deduction",
                        "Net Salary",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-4 text-left text-xs font-semibold whitespace-nowrap"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {salaryList.map((item, index) => {
                      const totalDays = item.totalDays ?? item.workingDays ?? 0;

                      const paidDays = item.paidDays ?? item.payableDays ?? 0;

                      const deductedDays =
                        item.deductibleDays ??
                        Number(item.lopDays || 0) +
                          Number(item.unpaidAbsenceDays || 0);

                      const totalDeduction =
                        item.totalDeduction ?? item.lopDeduction ?? 0;

                      return (
                        <tr key={item._id} className="hover:bg-blue-50/40">
                          {/* S.NO */}

                          <td className="px-4 py-4 text-sm font-semibold">
                            {index + 1}
                          </td>

                          {/* EMPLOYEE */}

                          <td className="px-4 py-4">
                            <p className="font-semibold text-gray-900 whitespace-nowrap">
                              {item.employeeName}
                            </p>
                          </td>

                          {/* CODE */}

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.employeeCode}
                          </td>

                          {/* ACTUAL SALARY */}

                          <td className="px-4 py-4 font-semibold whitespace-nowrap">
                            {money(
                              item.actualSalary ?? item.monthlySalary ?? 0
                            )}
                          </td>

                          {/* TOTAL DAYS */}

                          <td className="px-4 py-4">{totalDays}</td>

                          {/* PRESENT */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold">
                              {item.presentDays || 0}
                            </span>
                          </td>

                          {/* HOLIDAY */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs font-bold">
                              {item.holidayDays || 0}
                            </span>
                          </td>

                          {/* PAID LEAVE */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-bold">
                              {item.paidLeaveDays || 0}
                            </span>
                          </td>

                          {/* PAID DAYS */}

                          <td className="px-4 py-4">
                            <span className="font-bold text-green-700">
                              {paidDays}
                            </span>
                          </td>

                          {/* LOP */}


                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-bold">
                              {item.lopDays || 0}
                            </span>
                          </td>

                          {/* UNPAID ABSENCE */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold">
                              {item.unpaidAbsenceDays || 0}
                            </span>
                          </td>

                          {/* DEDUCTED DAYS */}

                          <td className="px-4 py-4 font-semibold text-red-600">
                            {deductedDays}
                          </td>

                          {/* LATE MARKS */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-bold">
                              {item.lateMarks || 0}
                            </span>
                          </td>

                          {/* LATE DEDUCTION DAYS */}

                          <td className="px-4 py-4 font-semibold text-orange-600 whitespace-nowrap">
                            {item.lateDeductionDays || 0} Days
                          </td>

                          {/* LATE DEDUCTION */}

                          <td className="px-4 py-4 font-semibold text-orange-600 whitespace-nowrap">
                            {money(item.lateDeduction || 0)}
                          </td>

                          

                          {/* PER DAY */}

                          <td className="px-4 py-4 font-semibold whitespace-nowrap">
                            {money(item.perDaySalary)}
                          </td>

                          {/* TOTAL DEDUCTION */}

                          <td className="px-4 py-4 font-bold text-red-600 whitespace-nowrap">
                            {money(totalDeduction)}
                          </td>

                          {/* NET */}

                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-bold text-green-700">
                              {money(item.netSalary)}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                              Calculated
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* FOOTER */}

                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td colSpan="3" className="px-4 py-5 font-bold">
                        TOTAL
                      </td>

                      <td className="px-4 py-5 font-bold">
                        {money(registerTotals.actualSalary)}
                      </td>

                      {/* Total Days through Late Marks */}

                      <td colSpan="10"></td>

                      {/* Total Deduction */}

                      <td className="px-4 py-5 font-bold text-red-600">
                        {money(registerTotals.deduction)}
                      </td>

                      {/* Net */}

                      <td className="px-4 py-5 font-bold text-green-700">
                        {money(registerTotals.netSalary)}
                      </td>

                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================
          PETTY CASH
      ================================================= */}

      {activeSection === "pettycash" && (
        <div>
          {/* HEADER */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Petty Cash</h2>

                <p className="text-gray-500 mt-1">
                  Company expense register for {monthName} {year}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Total Expense</p>

                <p className="text-2xl font-bold text-red-600">
                  {money(pettyCashTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* ADD EXPENSE */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold mb-5">Add Expense</h3>

            <form
              onSubmit={addPettyCash}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <PettyField
                label="Date"
                type="date"
                value={pettyCashForm.date}
                onChange={(value) => updatePettyField("date", value)}
              />

              <PettyField
                label="Category"
                value={pettyCashForm.category}
                placeholder="Office Supplies"
                onChange={(value) => updatePettyField("category", value)}
              />

              <PettyField
                label="Description"
                value={pettyCashForm.description}
                placeholder="Printer paper"
                onChange={(value) => updatePettyField("description", value)}
              />

              <PettyField
                label="Amount"
                type="number"
                value={pettyCashForm.amount}
                placeholder="500"
                onChange={(value) => updatePettyField("amount", value)}
              />

              <PettyField
                label="Paid To"
                value={pettyCashForm.paidTo}
                placeholder="Vendor"
                onChange={(value) => updatePettyField("paidTo", value)}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>

                <select
                  value={pettyCashForm.paymentMethod}
                  onChange={(e) =>
                    updatePettyField("paymentMethod", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                >
                  <option value="Cash">Cash</option>

                  <option value="UPI">UPI</option>

                  <option value="Bank">Bank</option>

                  <option value="Card">Card</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              <PettyField
                label="Reference"
                value={pettyCashForm.reference}
                placeholder="Bill No."
                onChange={(value) => updatePettyField("reference", value)}
              />

              <PettyField
                label="Notes"
                value={pettyCashForm.notes}
                placeholder="Notes"
                onChange={(value) => updatePettyField("notes", value)}
              />

              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>

          {/* PETTY TABLE */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {pettyCashLoading ? (
              <div className="p-10 text-center">Loading petty cash...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      {[
                        "Date",
                        "Category",
                        "Description",
                        "Paid To",
                        "Payment",
                        "Amount",
                        "Reference",
                        "Action",
                      ].map((item) => (
                        <th
                          key={item}
                          className="px-5 py-4 text-left text-xs uppercase"
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {pettyCash.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm">
                          {new Date(item.date).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-5 py-4">{item.category}</td>

                        <td className="px-5 py-4">{item.description}</td>

                        <td className="px-5 py-4">{item.paidTo || "-"}</td>

                        <td className="px-5 py-4">{item.paymentMethod}</td>

                        <td className="px-5 py-4 font-bold">
                          {money(item.amount)}
                        </td>

                        <td className="px-5 py-4">{item.reference || "-"}</td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => deletePettyCash(item._id)}
                            className="text-red-600 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// NAVIGATION BUTTON
// =========================================================

function NavigationButton({ active, onClick, icon, title }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-5 py-4 text-left font-semibold ${
        active
          ? "bg-blue-600 text-white shadow"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <span className="text-xl mr-3">{icon}</span>

      {title}
    </button>
  );
}

// =========================================================
// SUMMARY BOX
// =========================================================

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

// =========================================================
// RESULT BOX
// =========================================================

function ResultBox({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="text-lg font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

// =========================================================
// CALCULATION ROW
// =========================================================

function CalculationRow({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      <span className="text-gray-500">{label}</span>

      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

// =========================================================
// MINI STAT
// =========================================================

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 min-w-[120px]">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

// =========================================================
// PAYROLL BADGE
// =========================================================

function PayrollBadge({ type }) {
  const styles = {
    "Paid Holiday": "bg-purple-100 text-purple-700",

    "Paid Birthday": "bg-pink-100 text-pink-700",

    "Paid Leave": "bg-green-100 text-green-700",

    LOP: "bg-red-100 text-red-700",

    "Unpaid Absence": "bg-orange-100 text-orange-700",

    Paid: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[type] || styles.Paid
      }`}
    >
      {type}
    </span>
  );
}

// =========================================================
// STATUS
// =========================================================

function StatusBadge({ status }) {
  if (status === "Holiday") {
    return (
      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        Holiday
      </span>
    );
  }

  if (status === "Absent") {
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

// =========================================================
// PETTY FIELD
// =========================================================

function PettyField({ label, type = "text", value, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}
