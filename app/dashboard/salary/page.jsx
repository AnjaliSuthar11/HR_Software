// "use client";

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// export default function SalaryPage() {
//   const [employees, setEmployees] = useState([]);
//   const [employeeId, setEmployeeId] = useState("");

//   const [month, setMonth] = useState(
//     new Date().getMonth() + 1
//   );

//   const [year, setYear] = useState(
//     new Date().getFullYear()
//   );

//   const [monthlySalary, setMonthlySalary] =
//     useState("");

//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);

//   const [salary, setSalary] = useState(null);

//   const [loadingEmployees, setLoadingEmployees] =
//     useState(true);

//   const [loadingData, setLoadingData] =
//     useState(false);

//   const [calculating, setCalculating] =
//     useState(false);


//   // ==================================================
//   // MONTH INFORMATION
//   // ==================================================

//   const daysInMonth = new Date(
//     Number(year),
//     Number(month),
//     0
//   ).getDate();

//   const monthName = new Date(
//     Number(year),
//     Number(month) - 1,
//     1
//   ).toLocaleString("en-IN", {
//     month: "long",
//   });


//   // ==================================================
//   // DATE KEY
//   // ==================================================

//   const getDateKey = (date) => {
//     const d = new Date(date);

//     return `${d.getFullYear()}-${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")}`;
//   };


//   // ==================================================
//   // LOAD EMPLOYEES
//   // ==================================================

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   const loadEmployees = async () => {
//     try {
//       setLoadingEmployees(true);

//       const response = await axios.get(
//         "/api/employee/list"
//       );

//       setEmployees(
//         response.data?.employees || []
//       );
//     } catch (error) {
//       console.error(
//         "Employee loading error:",
//         error
//       );

//       alert(
//         error.response?.data?.message ||
//           "Unable to load employees"
//       );
//     } finally {
//       setLoadingEmployees(false);
//     }
//   };


//   // ==================================================
//   // LOAD ATTENDANCE + LEAVES
//   // ==================================================

//   const loadPayrollData = async () => {
//     if (!employeeId) {
//       setAttendance([]);
//       setLeaves([]);
//       setSalary(null);
//       return;
//     }

//     try {
//       setLoadingData(true);
//       setSalary(null);

//       const [
//         attendanceResponse,
//         leaveResponse,
//       ] = await Promise.all([
//         axios.get(
//           `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
//         ),

//         axios.get(
//           `/api/employee/leave?employeeId=${employeeId}`
//         ),
//       ]);

//       setAttendance(
//         attendanceResponse.data?.attendance || []
//       );

//       setLeaves(
//         leaveResponse.data?.leaves || []
//       );

//     } catch (error) {
//       console.error(
//         "Payroll data error:",
//         error
//       );

//       setAttendance([]);
//       setLeaves([]);
//       setSalary(null);

//       alert(
//         error.response?.data?.message ||
//           "Unable to load payroll data"
//       );
//     } finally {
//       setLoadingData(false);
//     }
//   };


//   // ==================================================
//   // LOAD WHEN SELECTION CHANGES
//   // ==================================================

//   useEffect(() => {
//     loadPayrollData();
//   }, [
//     employeeId,
//     month,
//     year,
//   ]);


//   // ==================================================
//   // ATTENDANCE MAP
//   // ==================================================

//   const attendanceMap = useMemo(() => {
//     const map = {};

//     attendance.forEach((record) => {
//       map[getDateKey(record.date)] =
//         record;
//     });

//     return map;
//   }, [attendance]);


//   // ==================================================
//   // APPROVED LEAVES FOR THIS MONTH
//   // ==================================================

//   const approvedLeaves = useMemo(() => {
//     const firstDate = new Date(
//       Number(year),
//       Number(month) - 1,
//       1
//     );

//     const nextDate = new Date(
//       Number(year),
//       Number(month),
//       1
//     );

//     return leaves
//       .filter(
//         (leave) =>
//           leave.status === "Approved"
//       )
//       .filter((leave) => {
//         const from =
//           new Date(leave.fromDate);

//         const to =
//           new Date(leave.toDate);

//         return (
//           from < nextDate &&
//           to >= firstDate
//         );
//       })
//       .sort(
//         (a, b) =>
//           new Date(a.fromDate) -
//           new Date(b.fromDate)
//       );
//   }, [
//     leaves,
//     month,
//     year,
//   ]);


//   // ==================================================
//   // CREATE LEAVE MAP
//   // ==================================================
//   //
//   // IMPORTANT:
//   //
//   // We only consider a leave for payroll when
//   // the corresponding attendance row is ABSENT.
//   //
//   // First CL OR SL absence in month = PAID
//   // Later CL / SL = LOP
//   // LOP = LOP
//   // ==================================================

//   const leaveTreatmentMap = useMemo(() => {
//     const map = {};

//     let paidLeaveUsed = 0;

//     approvedLeaves.forEach((leave) => {
//       const start =
//         new Date(leave.fromDate);

//       const end =
//         new Date(leave.toDate);

//       start.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       end.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       const current =
//         new Date(start);

//       while (
//         current <= end
//       ) {
//         const currentMonth =
//           current.getMonth() + 1;

//         const currentYear =
//           current.getFullYear();

//         if (
//           currentMonth ===
//             Number(month) &&
//           currentYear ===
//             Number(year)
//         ) {
//           const key =
//             getDateKey(current);

//           const attendanceRecord =
//             attendanceMap[key];

//           /*
//             Leave should only affect payroll
//             when machine attendance says Absent.
//           */

//           if (
//             attendanceRecord?.status ===
//             "Absent"
//           ) {

//             // ==========================================
//             // CL / SL
//             // ==========================================

//             if (
//               leave.leaveType === "CL" ||
//               leave.leaveType === "SL"
//             ) {

//               const requestedDays =
//                 leave.duration ===
//                 "Half Day"
//                   ? 0.5
//                   : 1;


//               // ----------------------------------------
//               // FIRST PAID LEAVE
//               // ----------------------------------------

//               if (
//                 paidLeaveUsed < 1
//               ) {

//                 const remainingPaid =
//                   1 -
//                   paidLeaveUsed;

//                 const paidDays =
//                   Math.min(
//                     requestedDays,
//                     remainingPaid
//                   );

//                 const lopDays =
//                   requestedDays -
//                   paidDays;

//                 paidLeaveUsed +=
//                   paidDays;


//                 map[key] = {
//                   leaveId:
//                     leave._id,

//                   leaveType:
//                     leave.leaveType,

//                   leaveName:
//                     leave.leaveType ===
//                     "CL"
//                       ? "Casual Leave"
//                       : "Sick Leave",

//                   payment:
//                     "Paid",

//                   paidDays,

//                   lopDays,
//                 };

//               } else {

//                 // --------------------------------------
//                 // PAID LEAVE ALREADY USED
//                 // --------------------------------------

//                 map[key] = {
//                   leaveId:
//                     leave._id,

//                   leaveType:
//                     leave.leaveType,

//                   leaveName:
//                     leave.leaveType ===
//                     "CL"
//                       ? "Casual Leave"
//                       : "Sick Leave",

//                   payment:
//                     "LOP",

//                   paidDays: 0,

//                   lopDays:
//                     requestedDays,
//                 };
//               }
//             }


//             // ==========================================
//             // DIRECT LOP
//             // ==========================================

//             if (
//               leave.leaveType ===
//               "LOP"
//             ) {

//               const lopDays =
//                 leave.duration ===
//                 "Half Day"
//                   ? 0.5
//                   : 1;

//               map[key] = {
//                 leaveId:
//                   leave._id,

//                 leaveType:
//                   "LOP",

//                 leaveName:
//                   "Loss of Pay",

//                 payment:
//                   "LOP",

//                 paidDays: 0,

//                 lopDays,
//               };
//             }
//           }
//         }

//         current.setDate(
//           current.getDate() + 1
//         );
//       }
//     });

//     return map;

//   }, [
//     approvedLeaves,
//     attendanceMap,
//     month,
//     year,
//   ]);


//   // ==================================================
//   // COMPLETE MONTH TABLE
//   // ==================================================

//   const tableRows = useMemo(() => {
//     const rows = [];

//     for (
//       let day = 1;
//       day <= daysInMonth;
//       day++
//     ) {

//       const date =
//         new Date(
//           Number(year),
//           Number(month) - 1,
//           day
//         );

//       date.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       const key =
//         getDateKey(date);

//       const record =
//         attendanceMap[key];

//       const leaveInfo =
//         leaveTreatmentMap[key];

//       const weekday =
//         date.toLocaleDateString(
//           "en-IN",
//           {
//             weekday:
//               "long",
//           }
//         );


//       // ==============================================
//       // SUNDAY
//       // ==============================================

//       if (
//         date.getDay() === 0
//       ) {

//         rows.push({
//           date,
//           weekday,

//           inTime: "",
//           outTime: "",
//           workingHours: 0,

//           lateMark: false,
//           lateMinutes: 0,

//           leaveType: "",
//           leaveName: "",
//           leavePayment: "",

//           status:
//             "Holiday",
//         });

//         continue;
//       }


//       // ==============================================
//       // NORMAL DAY
//       // ==============================================

//       const status =
//         record?.status ||
//         "Present";

//       const inTime =
//         record?.inTime || "";

//       const outTime =
//         record?.outTime || "";

//       const workingHours =
//         Number(
//           record?.workingHours ||
//             0
//         );

//       const lateMark =
//         record?.lateMark === true;

//       const lateMinutes =
//         Number(
//           record?.lateMinutes ||
//             0
//         );


//       // ==============================================
//       // LEAVE
//       // ==============================================

//       let leaveType = "";
//       let leaveName = "";
//       let leavePayment = "";

//       if (
//         status === "Absent" &&
//         leaveInfo
//       ) {

//         leaveType =
//           leaveInfo.leaveType;

//         leaveName =
//           leaveInfo.leaveName;

//         leavePayment =
//           leaveInfo.payment;
//       }


//       rows.push({
//         date,
//         weekday,

//         inTime,
//         outTime,
//         workingHours,

//         lateMark,
//         lateMinutes,

//         leaveType,
//         leaveName,
//         leavePayment,

//         status,
//       });
//     }

//     return rows;

//   }, [
//     daysInMonth,
//     year,
//     month,
//     attendanceMap,
//     leaveTreatmentMap,
//   ]);


//   // ==================================================
//   // SUMMARY
//   // ==================================================

//   const totalDays =
//     tableRows.length;


//   const workingDays =
//     totalDays;


//   const holidayDays =
//     tableRows.filter(
//       (row) =>
//         row.status ===
//         "Holiday"
//     ).length;


//   const presentDays =
//     tableRows.filter(
//       (row) =>
//         row.status ===
//         "Present"
//     ).length;


//   const absenceRows =
//     tableRows.filter(
//       (row) =>
//         row.status ===
//         "Absent"
//     );


//   // ==================================================
//   // PAID CL
//   // ==================================================

//   const paidClDays =
//     absenceRows.filter(
//       (row) =>
//         row.leaveType ===
//           "CL" &&
//         row.leavePayment ===
//           "Paid"
//     ).reduce(
//       (total, row) => {

//         const leave =
//           approvedLeaves.find(
//             (item) =>
//               item._id ===
//               getLeaveId(
//                 row,
//                 approvedLeaves
//               )
//           );

//         return (
//           total +
//           (
//             leave?.duration ===
//             "Half Day"
//               ? 0.5
//               : 1
//           )
//         );

//       },
//       0
//     );


//   // ==================================================
//   // PAID SL
//   // ==================================================

//   const paidSlDays =
//     absenceRows.filter(
//       (row) =>
//         row.leaveType ===
//           "SL" &&
//         row.leavePayment ===
//           "Paid"
//     ).reduce(
//       (total, row) => {

//         const leave =
//           approvedLeaves.find(
//             (item) =>
//               item._id ===
//               getLeaveId(
//                 row,
//                 approvedLeaves
//               )
//           );

//         return (
//           total +
//           (
//             leave?.duration ===
//             "Half Day"
//               ? 0.5
//               : 1
//           )
//         );

//       },
//       0
//     );


//   // ==================================================
//   // LOP
//   // ==================================================

//   const lopDays =
//     absenceRows.filter(
//       (row) =>
//         row.leavePayment ===
//         "LOP"
//     ).reduce(
//       (total, row) => {

//         const leave =
//           approvedLeaves.find(
//             (item) =>
//               item._id ===
//               getLeaveId(
//                 row,
//                 approvedLeaves
//               )
//           );

//         return (
//           total +
//           (
//             leave?.duration ===
//             "Half Day"
//               ? 0.5
//               : 1
//           )
//         );

//       },
//       0
//     );


//   // ==================================================
//   // UNPAID ABSENCE
//   // ==================================================

//   const unpaidAbsenceDays =
//     absenceRows.filter(
//       (row) =>
//         !row.leaveType
//     ).length;


//   // ==================================================
//   // PAID LEAVE
//   // ==================================================

//   const paidLeaveDays =
//     paidClDays +
//     paidSlDays;


//   // ==================================================
//   // TOTAL DEDUCTIBLE
//   // ==================================================

//   const deductibleDays =
//     lopDays +
//     unpaidAbsenceDays;


//   // ==================================================
//   // PAID DAYS
//   // ==================================================

//   const paidDays =
//     Math.max(
//       totalDays -
//         deductibleDays,
//       0
//     );


//   // ==================================================
//   // LATE
//   // ==================================================

//   const lateMarks =
//     tableRows.filter(
//       (row) =>
//         row.lateMark ===
//         true
//     ).length;


//   const totalLateMinutes =
//     tableRows.reduce(
//       (total, row) =>
//         total +
//         Number(
//           row.lateMinutes ||
//             0
//         ),
//       0
//     );


//   // ==================================================
//   // CALCULATE SALARY
//   // ==================================================

//   const calculateSalary =
//     async () => {

//       if (!employeeId) {
//         alert(
//           "Please select employee"
//         );
//         return;
//       }


//       if (!monthlySalary) {
//         alert(
//           "Please enter monthly salary"
//         );
//         return;
//       }


//       if (
//         attendance.length ===
//         0
//       ) {
//         alert(
//           "No attendance found for this employee and month"
//         );
//         return;
//       }


//       try {

//         setCalculating(
//           true
//         );


//         const response =
//           await axios.post(
//             "/api/salary/calculate",
//             {
//               employeeId,

//               month:
//                 Number(month),

//               year:
//                 Number(year),

//               monthlySalary:
//                 Number(
//                   monthlySalary
//                 ),
//             }
//           );


//         if (
//           response.data.success
//         ) {

//           const perDaySalary =
//             Number(
//               monthlySalary
//             ) /
//             totalDays;


//           const totalDeduction =
//             deductibleDays *
//             perDaySalary;


//           const netSalary =
//             Math.max(
//               Number(
//                 monthlySalary
//               ) -
//                 totalDeduction,
//               0
//             );


//           /*
//             Use our current page calculation
//             so the result always matches the
//             table visible to HR.
//           */

//           setSalary({

//             ...(response.data.salary ||
//               {}),

//             totalDays,

//             workingDays,

//             holidayDays,

//             presentDays,

//             paidDays,

//             absenceDays:
//               deductibleDays,

//             paidLeaveDays,

//             casualLeaveDays:
//               paidClDays,

//             sickLeaveDays:
//               paidSlDays,

//             lopDays,

//             unpaidAbsenceDays,

//             lateMarks,

//             totalLateMinutes,

//             perDaySalary,

//             totalDeduction,

//             lopDeduction:
//               totalDeduction,

//             netSalary,
//           });

//         } else {

//           alert(
//             response.data.message ||
//               "Salary calculation failed"
//           );

//         }

//       } catch (error) {

//         console.error(
//           "Salary calculation error:",
//           error
//         );

//         alert(
//           error.response?.data
//             ?.message ||
//             "Unable to calculate salary"
//         );

//       } finally {

//         setCalculating(
//           false
//         );
//       }
//     };


//   // ==================================================
//   // MONEY
//   // ==================================================

//   const money = (value) => {
//     return new Intl.NumberFormat(
//       "en-IN",
//       {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//       }
//     ).format(
//       Number(value || 0)
//     );
//   };


//   // ==================================================
//   // SELECTED EMPLOYEE
//   // ==================================================

//   const selectedEmployee =
//     employees.find(
//       (employee) =>
//         employee._id ===
//         employeeId
//     );


//   // ==================================================
//   // UI
//   // ==================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

//       {/* ==================================================
//           HEADER
//       ================================================== */}

//       <div className="mb-8">

//         <h1 className="text-3xl font-bold text-gray-900">
//           Salary Management
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Review attendance and leave details before calculating salary.
//         </p>

//       </div>


//       {/* ==================================================
//           PAYROLL DETAILS
//       ================================================== */}

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

//         <h2 className="text-lg font-bold mb-6">
//           Payroll Details
//         </h2>


//         <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


//           {/* EMPLOYEE */}

//           <div>

//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Employee
//             </label>

//             <select
//               value={employeeId}
//               onChange={(e) => {

//                 setEmployeeId(
//                   e.target.value
//                 );

//                 setSalary(
//                   null
//                 );

//               }}
//               disabled={
//                 loadingEmployees
//               }
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white outline-none focus:border-blue-500"
//             >

//               <option value="">
//                 {
//                   loadingEmployees
//                     ? "Loading employees..."
//                     : "Select Employee"
//                 }
//               </option>

//               {employees.map(
//                 (employee) => (

//                   <option
//                     key={
//                       employee._id
//                     }
//                     value={
//                       employee._id
//                     }
//                   >

//                     {
//                       employee.employeeFullName
//                     }{" "}
//                     -{" "}
//                     {
//                       employee.employeeCode
//                     }

//                   </option>

//                 )
//               )}

//             </select>

//           </div>


//           {/* MONTH */}

//           <div>

//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Month
//             </label>

//             <select
//               value={month}
//               onChange={(e) => {

//                 setMonth(
//                   Number(
//                     e.target.value
//                   )
//                 );

//                 setSalary(
//                   null
//                 );

//               }}
//               className="w-full rounded-xl border border-gray-200 px-4 py-3"
//             >

//               {[
//                 "January",
//                 "February",
//                 "March",
//                 "April",
//                 "May",
//                 "June",
//                 "July",
//                 "August",
//                 "September",
//                 "October",
//                 "November",
//                 "December",
//               ].map(
//                 (
//                   name,
//                   index
//                 ) => (

//                   <option
//                     key={
//                       name
//                     }
//                     value={
//                       index + 1
//                     }
//                   >
//                     {name}
//                   </option>

//                 )
//               )}

//             </select>

//           </div>


//           {/* YEAR */}

//           <div>

//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Year
//             </label>

//             <input
//               type="number"
//               value={
//                 year
//               }
//               onChange={(e) => {

//                 setYear(
//                   e.target.value
//                 );

//                 setSalary(
//                   null
//                 );

//               }}
//               className="w-full rounded-xl border border-gray-200 px-4 py-3"
//             />

//           </div>


//           {/* SALARY */}

//           <div>

//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Monthly Salary
//             </label>

//             <input
//               type="number"
//               min="0"
//               value={
//                 monthlySalary
//               }
//               onChange={(e) => {

//                 setMonthlySalary(
//                   e.target.value
//                 );

//                 setSalary(
//                   null
//                 );

//               }}
//               placeholder="20000"
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
//             />

//           </div>

//         </div>

//       </div>


//       {/* ==================================================
//           LOADING
//       ================================================== */}

//       {loadingData && (

//         <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center mb-6">

//           <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

//           <p className="text-gray-500">
//             Loading attendance and leave records...
//           </p>

//         </div>

//       )}


//       {/* ==================================================
//           EMPLOYEE HEADER
//       ================================================== */}

//       {!loadingData &&
//         selectedEmployee && (

//           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6">

//             <p className="text-blue-100 text-sm">
//               Payroll Employee
//             </p>

//             <h2 className="text-2xl font-bold mt-1">
//               {
//                 selectedEmployee.employeeFullName
//               }
//             </h2>

//             <p className="text-blue-100 mt-1">
//               {
//                 selectedEmployee.employeeCode
//               }{" "}
//               •{" "}
//               {monthName}{" "}
//               {year}
//             </p>

//           </div>

//         )}


//       {/* ==================================================
//           SUMMARY
//       ================================================== */}

//       {!loadingData &&
//         selectedEmployee &&
//         tableRows.length > 0 && (

//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

//             <SummaryBox
//               label="Total Days"
//               value={
//                 totalDays
//               }
//             />

//             <SummaryBox
//               label="Working Days"
//               value={
//                 workingDays
//               }
//             />

//             <SummaryBox
//               label="Sunday / Holiday"
//               value={
//                 holidayDays
//               }
//             />

//             <SummaryBox
//               label="Present"
//               value={
//                 presentDays
//               }
//             />

//             <SummaryBox
//               label="Absence / Deducted"
//               value={
//                 deductibleDays
//               }
//             />

//             <SummaryBox
//               label="Late Marks"
//               value={
//                 lateMarks
//               }
//             />

//           </div>

//         )}


//       {/* ==================================================
//           LEAVE SUMMARY
//       ================================================== */}

//       {!loadingData &&
//         selectedEmployee &&
//         tableRows.length > 0 && (

//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

//             <h3 className="font-bold text-gray-900 mb-4">
//               Leave Summary
//             </h3>


//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


//               <LeaveSummaryBox
//                 title="Paid CL"
//                 value={
//                   paidClDays
//                 }
//                 subtitle="First paid leave"
//                 type="green"
//               />


//               <LeaveSummaryBox
//                 title="Paid SL"
//                 value={
//                   paidSlDays
//                 }
//                 subtitle="First paid leave"
//                 type="blue"
//               />


//               <LeaveSummaryBox
//                 title="LOP"
//                 value={
//                   lopDays
//                 }
//                 subtitle="Salary deducted"
//                 type="red"
//               />


//               <LeaveSummaryBox
//                 title="Unpaid Absence"
//                 value={
//                   unpaidAbsenceDays
//                 }
//                 subtitle="Salary deducted"
//                 type="orange"
//               />

//             </div>

//           </div>

//         )}


//       {/* ==================================================
//           ATTENDANCE TABLE
//       ================================================== */}

//       {!loadingData &&
//         selectedEmployee &&
//         tableRows.length > 0 && (

//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

//             <div className="px-6 py-5 border-b border-gray-100">

//               <h2 className="text-lg font-bold text-gray-900">
//                 Attendance & Leave Details
//               </h2>

//               <p className="text-sm text-gray-500 mt-1">
//                 Complete {monthName}{" "}
//                 {year} attendance
//               </p>

//             </div>


//             <div className="overflow-x-auto">

//               <table className="w-full">

//                 <thead className="bg-gray-50">

//                   <tr>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">
//                       Date
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Weekday
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       In
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Out
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Working Hours
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Late
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Leave
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Payroll
//                     </th>

//                     <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                       Status
//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody className="divide-y divide-gray-100">

//                   {tableRows.map(
//                     (row) => (

//                       <tr
//                         key={getDateKey(
//                           row.date
//                         )}
//                         className={
//                           row.status ===
//                           "Holiday"
//                             ? "bg-purple-50"
//                             : "hover:bg-gray-50"
//                         }
//                       >

//                         {/* DATE */}

//                         <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
//                           {row.date.toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             }
//                           )}
//                         </td>


//                         {/* WEEKDAY */}

//                         <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
//                           {row.weekday}
//                         </td>


//                         {/* IN */}

//                         <td className="px-5 py-4 text-sm">
//                           {row.status ===
//                           "Holiday"
//                             ? "-"
//                             : row.inTime ||
//                               "-"}
//                         </td>


//                         {/* OUT */}

//                         <td className="px-5 py-4 text-sm">
//                           {row.status ===
//                           "Holiday"
//                             ? "-"
//                             : row.outTime ||
//                               "-"}
//                         </td>


//                         {/* HOURS */}

//                         <td className="px-5 py-4 text-sm">
//                           {row.status ===
//                           "Holiday"
//                             ? "-"
//                             : row.workingHours
//                             ? `${row.workingHours} hrs`
//                             : "-"}
//                         </td>


//                         {/* LATE */}

//                         <td className="px-5 py-4">

//                           {row.status ===
//                           "Holiday" ? (

//                             <span className="text-gray-400">
//                               -
//                             </span>

//                           ) : row.lateMark ? (

//                             <div>

//                               <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
//                                 Late
//                               </span>

//                               <p className="text-xs text-orange-500 mt-1">
//                                 {
//                                   row.lateMinutes
//                                 }{" "}
//                                 min
//                               </p>

//                             </div>

//                           ) : (

//                             <span className="text-gray-400">
//                               -
//                             </span>

//                           )}

//                         </td>


//                         {/* LEAVE */}

//                         <td className="px-5 py-4">

//                           {row.leaveType ? (

//                             <div>

//                               <span
//                                 className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                                   row.leaveType ===
//                                   "CL"
//                                     ? "bg-green-100 text-green-700"
//                                     : row.leaveType ===
//                                       "SL"
//                                     ? "bg-blue-100 text-blue-700"
//                                     : "bg-red-100 text-red-700"
//                                 }`}
//                               >
//                                 {
//                                   row.leaveType
//                                 }
//                               </span>

//                               <p className="text-xs text-gray-500 mt-1">
//                                 {
//                                   row.leaveName
//                                 }
//                               </p>

//                             </div>

//                           ) : (

//                             <span className="text-gray-400">
//                               -
//                             </span>

//                           )}

//                         </td>


//                         {/* PAYROLL */}

//                         <td className="px-5 py-4">

//                           {row.status ===
//                           "Holiday" ? (

//                             <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
//                               Paid Holiday
//                             </span>

//                           ) : row.leavePayment ===
//                             "Paid" ? (

//                             <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                               Paid Leave
//                             </span>

//                           ) : row.leavePayment ===
//                             "LOP" ? (

//                             <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
//                               LOP
//                             </span>

//                           ) : row.status ===
//                             "Absent" ? (

//                             <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
//                               Unpaid Absence
//                             </span>

//                           ) : (

//                             <span className="text-gray-400">
//                               Paid
//                             </span>

//                           )}

//                         </td>


//                         {/* STATUS */}

//                         <td className="px-5 py-4">

//                           <StatusBadge
//                             status={
//                               row.status
//                             }
//                           />

//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         )}


//       {/* ==================================================
//           CALCULATE SALARY BUTTON
//       ================================================== */}

//       {!loadingData &&
//         selectedEmployee &&
//         attendance.length > 0 && (

//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

//               <div>

//                 <h3 className="text-lg font-bold text-gray-900">
//                   Calculate Salary
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1">
//                   Check the complete table before generating the final salary.
//                 </p>

//               </div>


//               <button
//                 onClick={
//                   calculateSalary
//                 }
//                 disabled={
//                   calculating
//                 }
//                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-sm disabled:opacity-50"
//               >

//                 {calculating
//                   ? "Calculating Salary..."
//                   : "Calculate Salary"}

//               </button>

//             </div>

//           </div>

//         )}


//       {/* ==================================================
//           FINAL SALARY
//       ================================================== */}

//       {salary && (

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">

//           {/* HEADER */}

//           <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-7 text-white">

//             <p className="text-green-100 text-sm">
//               Final Salary
//             </p>

//             <h2 className="text-4xl font-bold mt-2">
//               {money(
//                 salary.netSalary
//               )}
//             </h2>

//             <p className="text-green-100 mt-2">
//               {monthName}{" "}
//               {year}
//             </p>

//           </div>


//           <div className="p-6">

//             {/* SIMPLE SUMMARY */}

//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

//               <ResultBox
//                 label="Monthly Salary"
//                 value={money(
//                   salary.monthlySalary
//                 )}
//               />

//               <ResultBox
//                 label="Total Days"
//                 value={
//                   salary.totalDays
//                 }
//               />

//               <ResultBox
//                 label="Paid Days"
//                 value={
//                   salary.paidDays
//                 }
//               />

//               <ResultBox
//                 label="Absence Days"
//                 value={
//                   salary.absenceDays
//                 }
//               />

//               <ResultBox
//                 label="Per Day Salary"
//                 value={money(
//                   salary.perDaySalary
//                 )}
//               />

//             </div>


//             {/* CALCULATION */}

//             <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">


//               <CalculationRow
//                 label="Monthly Salary"
//                 value={money(
//                   salary.monthlySalary
//                 )}
//               />


//               <CalculationRow
//                 label="Total Days"
//                 value={
//                   `${salary.totalDays} Days`
//                 }
//               />


//               <CalculationRow
//                 label="Paid Days"
//                 value={
//                   `${salary.paidDays} Days`
//                 }
//                 valueClass="text-green-600"
//               />


//               <CalculationRow
//                 label="Absence Days"
//                 value={
//                   `${salary.absenceDays} Days`
//                 }
//                 valueClass="text-red-600"
//               />


//               <CalculationRow
//                 label="Per Day Salary"
//                 value={money(
//                   salary.perDaySalary
//                 )}
//               />


//               {/* DEDUCTION */}

//               <div className="flex items-center justify-between border-b border-gray-200 py-5">

//                 <div>

//                   <p className="font-bold text-gray-700">
//                     Total Deduction
//                   </p>

//                   <p className="text-xs text-gray-400 mt-1">
//                     Absence Days × Per Day Salary
//                   </p>

//                 </div>


//                 <p className="text-xl font-bold text-red-600">
//                   -{" "}
//                   {money(
//                     salary.totalDeduction
//                   )}
//                 </p>

//               </div>


//               {/* NET SALARY */}

//               <div className="mt-6 rounded-2xl bg-green-100 border border-green-200 p-6">

//                 <div className="flex items-center justify-between">

//                   <div>

//                     <p className="text-sm text-green-700">
//                       Net Salary
//                     </p>

//                     <p className="text-3xl font-bold text-green-700 mt-1">
//                       {money(
//                         salary.netSalary
//                       )}
//                     </p>

//                   </div>

//                   <div className="text-4xl">
//                     💰
//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }


// // ======================================================
// // FIND LEAVE ID FOR ROW
// // ======================================================

// function getLeaveId(
//   row,
//   leaves
// ) {
//   const rowKey =
//     formatDateKey(row.date);

//   const leave =
//     leaves.find(
//       (item) => {

//         if (
//           item.status !==
//           "Approved"
//         ) {
//           return false;
//         }

//         const from =
//           formatDateKey(
//             item.fromDate
//           );

//         const to =
//           formatDateKey(
//             item.toDate
//           );

//         return (
//           row.leaveType ===
//             item.leaveType &&
//           rowKey >= from &&
//           rowKey <= to
//         );
//       }
//     );

//   return leave?._id;
// }


// // ======================================================
// // DATE KEY
// // ======================================================

// function formatDateKey(date) {
//   const d =
//     new Date(date);

//   return `${d.getFullYear()}-${String(
//     d.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;
// }


// // ======================================================
// // SUMMARY BOX
// // ======================================================

// function SummaryBox({
//   label,
//   value,
// }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">

//       <p className="text-xs text-gray-400">
//         {label}
//       </p>

//       <p className="text-2xl font-bold text-gray-900 mt-2">
//         {value}
//       </p>

//     </div>
//   );
// }


// // ======================================================
// // LEAVE SUMMARY BOX
// // ======================================================

// function LeaveSummaryBox({
//   title,
//   value,
//   subtitle,
//   type,
// }) {
//   const classes = {
//     green:
//       "bg-green-50 border-green-100 text-green-700",

//     blue:
//       "bg-blue-50 border-blue-100 text-blue-700",

//     red:
//       "bg-red-50 border-red-100 text-red-700",

//     orange:
//       "bg-orange-50 border-orange-100 text-orange-700",
//   };

//   return (
//     <div
//       className={`rounded-xl border p-4 ${classes[type]}`}
//     >

//       <p className="text-xs">
//         {title}
//       </p>

//       <p className="text-xl font-bold mt-1">
//         {value}{" "}
//         {value === 1
//           ? "Day"
//           : "Days"}
//       </p>

//       <p className="text-xs mt-1">
//         {subtitle}
//       </p>

//     </div>
//   );
// }


// // ======================================================
// // RESULT BOX
// // ======================================================

// function ResultBox({
//   label,
//   value,
// }) {
//   return (
//     <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

//       <p className="text-xs text-gray-400">
//         {label}
//       </p>

//       <p className="text-lg font-bold text-gray-900 mt-2">
//         {value}
//       </p>

//     </div>
//   );
// }


// // ======================================================
// // CALCULATION ROW
// // ======================================================

// function CalculationRow({
//   label,
//   value,
//   valueClass =
//     "text-gray-900",
// }) {
//   return (
//     <div className="flex items-center justify-between border-b border-gray-200 py-4">

//       <span className="text-gray-500">
//         {label}
//       </span>

//       <span
//         className={`font-semibold ${valueClass}`}
//       >
//         {value}
//       </span>

//     </div>
//   );
// }


// // ======================================================
// // STATUS
// // ======================================================

// function StatusBadge({
//   status,
// }) {
//   if (
//     status === "Holiday"
//   ) {
//     return (
//       <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
//         Holiday
//       </span>
//     );
//   }

//   if (
//     status === "Absent"
//   ) {
//     return (
//       <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
//         Absent
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//       Present
//     </span>
//   );
// }


// 31st holiday hr
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function SalaryPage() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [monthlySalary, setMonthlySalary] =
    useState("");

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [holidays, setHolidays] =
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
  // DATE KEY
  // ==================================================

  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };


  // ==================================================
  // EMPLOYEES
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
          response.data?.employees ||
            []
        );

      } catch (error) {

        console.error(
          "Employee loading error:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Unable to load employees"
        );

      } finally {

        setLoadingEmployees(
          false
        );
      }
    };


  // ==================================================
  // LOAD ATTENDANCE
  // ==================================================

  const loadAttendance =
    async () => {

      const response =
        await axios.get(
          `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
        );

      setAttendance(
        response.data?.attendance ||
          []
      );
    };


  // ==================================================
  // LOAD LEAVES
  // ==================================================

  const loadLeaves =
    async () => {

      const response =
        await axios.get(
          `/api/employee/leave?employeeId=${employeeId}`
        );

      setLeaves(
        response.data?.leaves ||
          []
      );
    };


  // ==================================================
  // LOAD HR HOLIDAYS
  // ==================================================

  const loadHolidays =
    async () => {

      const response =
        await axios.get(
          `/api/holiday?year=${year}`
        );

      setHolidays(
        response.data?.holidays ||
          []
      );
    };


  // ==================================================
  // LOAD PAYROLL DATA
  // ==================================================

  const loadPayrollData =
    async () => {

      if (!employeeId) {

        setAttendance([]);
        setLeaves([]);
        setHolidays([]);
        setSalary(null);

        return;
      }

      try {

        setLoadingData(true);

        setSalary(null);

        await Promise.all([
          loadAttendance(),
          loadLeaves(),
          loadHolidays(),
        ]);

      } catch (error) {

        console.error(
          "Payroll data error:",
          error
        );

        setAttendance([]);
        setLeaves([]);
        setHolidays([]);

        alert(
          error.response?.data?.message ||
            "Unable to load payroll data"
        );

      } finally {

        setLoadingData(false);
      }
    };


  // ==================================================
  // RELOAD
  // ==================================================

  useEffect(() => {

    loadPayrollData();

  }, [
    employeeId,
    month,
    year,
  ]);


  // ==================================================
  // SELECTED EMPLOYEE
  // ==================================================

  const selectedEmployee =
    employees.find(
      (employee) =>
        employee._id ===
        employeeId
    );


  // ==================================================
  // ATTENDANCE MAP
  // ==================================================

  const attendanceMap =
    useMemo(() => {

      const map = {};

      attendance.forEach(
        (record) => {

          map[
            getDateKey(
              record.date
            )
          ] = record;

        }
      );

      return map;

    }, [attendance]);


  // ==================================================
  // HOLIDAY MAP
  // ==================================================

  const holidayMap =
    useMemo(() => {

      const map = {};

      holidays
        .filter(
          (holiday) =>
            holiday.paid !== false
        )
        .forEach(
          (holiday) => {

            map[
              getDateKey(
                holiday.date
              )
            ] = holiday;

          }
        );

      return map;

    }, [holidays]);


  // ==================================================
  // BIRTHDAY
  // ==================================================

  const birthdayKey =
    useMemo(() => {

      if (
        !selectedEmployee?.dateOfBirth
      ) {
        return null;
      }

      const dob =
        new Date(
          selectedEmployee.dateOfBirth
        );

      const birthday =
        new Date(
          Number(year),
          dob.getMonth(),
          dob.getDate()
        );

      birthday.setHours(
        0,
        0,
        0,
        0
      );

      return getDateKey(
        birthday
      );

    }, [
      selectedEmployee,
      year,
    ]);


  // ==================================================
  // APPROVED LEAVES
  // ==================================================

  const approvedLeaves =
    useMemo(() => {

      const firstDay =
        new Date(
          Number(year),
          Number(month) - 1,
          1
        );

      firstDay.setHours(
        0,
        0,
        0,
        0
      );

      const nextMonth =
        new Date(
          Number(year),
          Number(month),
          1
        );

      nextMonth.setHours(
        0,
        0,
        0,
        0
      );

      return leaves
        .filter(
          (leave) =>
            leave.status ===
            "Approved"
        )
        .filter(
          (leave) => {

            const from =
              new Date(
                leave.fromDate
              );

            const to =
              new Date(
                leave.toDate
              );

            return (
              from <
                nextMonth &&
              to >=
                firstDay
            );

          }
        )
        .sort(
          (a, b) =>
            new Date(
              a.fromDate
            ) -
            new Date(
              b.fromDate
            )
        );

    }, [
      leaves,
      month,
      year,
    ]);


  // ==================================================
  // LEAVE TREATMENT
  // ==================================================
  //
  // FIRST CL OR SL = PAID
  // NEXT CL OR SL = LOP
  // DIRECT LOP = LOP
  //
  // BUT:
  // Sunday / HR Holiday / Birthday
  // completely ignores leave.
  // ==================================================

  const leaveTreatmentMap =
    useMemo(() => {

      const map = {};

      let paidLeaveUsed =
        0;

      for (
        const leave of approvedLeaves
      ) {

        const start =
          new Date(
            leave.fromDate
          );

        const end =
          new Date(
            leave.toDate
          );

        start.setHours(
          0,
          0,
          0,
          0
        );

        end.setHours(
          0,
          0,
          0,
          0
        );

        const current =
          new Date(start);


        while (
          current <= end
        ) {

          const key =
            getDateKey(
              current
            );


          const isSunday =
            current.getDay() ===
            0;


          const hrHoliday =
            holidayMap[key];


          const isBirthday =
            birthdayKey ===
            key;


          /*
            HOLIDAY ALWAYS WINS.

            Do not consume the leave.
          */

          if (
            !isSunday &&
            !hrHoliday &&
            !isBirthday
          ) {

            const record =
              attendanceMap[key];


            /*
              Leave only matters when
              machine says ABSENT.
            */

            if (
              record?.status ===
              "Absent"
            ) {

              // =======================================
              // CL / SL
              // =======================================

              if (
                leave.leaveType ===
                  "CL" ||
                leave.leaveType ===
                  "SL"
              ) {

                const requestedDays =
                  leave.duration ===
                  "Half Day"
                    ? 0.5
                    : 1;


                if (
                  paidLeaveUsed < 1
                ) {

                  const available =
                    1 -
                    paidLeaveUsed;


                  const paid =
                    Math.min(
                      requestedDays,
                      available
                    );


                  const lop =
                    Math.max(
                      requestedDays -
                        paid,
                      0
                    );


                  paidLeaveUsed +=
                    paid;


                  map[key] = {

                    leaveId:
                      leave._id,

                    leaveType:
                      leave.leaveType,

                    leaveName:
                      leave.leaveType ===
                      "CL"
                        ? "Casual Leave"
                        : "Sick Leave",

                    payment:
                      lop > 0
                        ? "LOP"
                        : "Paid",

                    paidDays:
                      paid,

                    lopDays:
                      lop,
                  };

                } else {

                  map[key] = {

                    leaveId:
                      leave._id,

                    leaveType:
                      leave.leaveType,

                    leaveName:
                      leave.leaveType ===
                      "CL"
                        ? "Casual Leave"
                        : "Sick Leave",

                    payment:
                      "LOP",

                    paidDays:
                      0,

                    lopDays:
                      requestedDays,
                  };
                }
              }


              // =======================================
              // DIRECT LOP
              // =======================================

              if (
                leave.leaveType ===
                "LOP"
              ) {

                const requestedDays =
                  leave.duration ===
                  "Half Day"
                    ? 0.5
                    : 1;


                map[key] = {

                  leaveId:
                    leave._id,

                  leaveType:
                    "LOP",

                  leaveName:
                    "Loss of Pay",

                  payment:
                    "LOP",

                  paidDays:
                    0,

                  lopDays:
                    requestedDays,
                };
              }
            }
          }


          current.setDate(
            current.getDate() + 1
          );
        }
      }

      return map;

    }, [
      approvedLeaves,
      attendanceMap,
      holidayMap,
      birthdayKey,
    ]);


  // ==================================================
  // COMPLETE MONTH TABLE
  // ==================================================

  const tableRows =
    useMemo(() => {

      const rows = [];

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
          getDateKey(
            date
          );


        const record =
          attendanceMap[key];


        const hrHoliday =
          holidayMap[key];


        const isSunday =
          date.getDay() ===
          0;


        const isBirthday =
          birthdayKey ===
          key;


        const leaveInfo =
          leaveTreatmentMap[
            key
          ];


        const weekday =
          date.toLocaleDateString(
            "en-IN",
            {
              weekday:
                "long",
            }
          );


        /*
          IMPORTANT:

          Machine status is preserved.

          No record = Blank.
        */

        const machineStatus =
          record?.status ||
          "Blank";


        let leaveType = "";
        let leaveName = "";
        let leavePayment = "";
        let leaveId = "";


        /*
          Do not display leave as payroll leave
          when the date is a holiday.

          Holiday wins.
        */

        if (
          machineStatus ===
            "Absent" &&
          !isSunday &&
          !hrHoliday &&
          !isBirthday &&
          leaveInfo
        ) {

          leaveType =
            leaveInfo.leaveType;

          leaveName =
            leaveInfo.leaveName;

          leavePayment =
            leaveInfo.payment;

          leaveId =
            leaveInfo.leaveId;
        }


        let payrollType =
          "Paid";


        if (
          isSunday
        ) {

          payrollType =
            "Paid Holiday";

        } else if (
          hrHoliday
        ) {

          payrollType =
            "Paid Holiday";

        } else if (
          isBirthday
        ) {

          payrollType =
            "Paid Birthday";

        } else if (
          leavePayment ===
          "Paid"
        ) {

          payrollType =
            "Paid Leave";

        } else if (
          leavePayment ===
          "LOP"
        ) {

          payrollType =
            "LOP";

        } else if (
          machineStatus ===
          "Absent"
        ) {

          payrollType =
            "Unpaid Absence";

        } else {

          payrollType =
            "Paid";
        }


        rows.push({

          date,

          weekday,

          inTime:
            record?.inTime ||
            "",

          outTime:
            record?.outTime ||
            "",

          workingHours:
            Number(
              record?.workingHours ||
                0
            ),

          lateMark:
            record?.lateMark ===
            true,

          lateMinutes:
            Number(
              record?.lateMinutes ||
                0
            ),

          status:
            machineStatus,

          leaveId,

          leaveType,

          leaveName,

          leavePayment,

          payrollType,

          isSunday,

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


  // ==================================================
  // SIMPLE SUMMARY
  // ==================================================

  const workingDays =
    tableRows.length;


  const presentDays =
    tableRows.filter(
      (row) =>
        row.status ===
        "Present"
    ).length;


  const actualAbsentDays =
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


  // ==================================================
  // PRE-CALCULATION LEAVE SUMMARY
  // ==================================================

  const previewPaidLeaveDays =
    tableRows.filter(
      (row) =>
        row.leavePayment ===
        "Paid"
    ).reduce(
      (total, row) =>
        total +
        Number(
          leaveTreatmentMap[
            getDateKey(
              row.date
            )
          ]?.paidDays ||
            0
        ),
      0
    );


  const previewLopDays =
    tableRows.filter(
      (row) =>
        row.leavePayment ===
        "LOP"
    ).reduce(
      (total, row) =>
        total +
        Number(
          leaveTreatmentMap[
            getDateKey(
              row.date
            )
          ]?.lopDays ||
            0
        ),
      0
    );


  const previewUnpaidAbsence =
    tableRows.filter(
      (row) =>
        row.status ===
          "Absent" &&
        !row.leaveType &&
        !row.isSunday &&
        !row.hrHoliday &&
        !row.isBirthday
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
          !response.data?.success
        ) {

          alert(
            response.data?.message ||
              "Salary calculation failed"
          );

          return;
        }


        /*
          IMPORTANT:

          Do NOT calculate salary again
          in the frontend.

          API is the single source
          of truth.
        */

        setSalary(
          response.data.salary
        );

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

  const money = (value) => {

    return new Intl.NumberFormat(
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
  };


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Salary Management
        </h1>

        <p className="text-gray-500 mt-2">
          Review attendance and leave before calculating salary.
        </p>

      </div>


      {/* ==================================================
          PAYROLL DETAILS
      ================================================== */}

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
                {
                  loadingEmployees
                    ? "Loading employees..."
                    : "Select Employee"
                }
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
              value={
                month
              }
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
                  Number(
                    e.target.value
                  )
                );

                setSalary(
                  null
                );

              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />

          </div>


          {/* SALARY */}

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
              placeholder="10000"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          LOADING
      ================================================== */}

      {loadingData && (

        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center mb-6">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading attendance and leave records...
          </p>

        </div>

      )}


      {/* ==================================================
          EMPLOYEE
      ================================================== */}

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


      {/* ==================================================
          SIMPLE SUMMARY
      ================================================== */}

      {!loadingData &&
        selectedEmployee &&
        tableRows.length > 0 && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Attendance Summary
          </h3>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            <SummaryBox
              label="Working Days"
              value={
                workingDays
              }
            />

            <SummaryBox
              label="Present Days"
              value={
                presentDays
              }
            />

            <SummaryBox
              label="Absent Days"
              value={
                actualAbsentDays
              }
            />

            <SummaryBox
              label="Paid Leave"
              value={
                previewPaidLeaveDays
              }
            />

            <SummaryBox
              label="LOP Days"
              value={
                previewLopDays
              }
            />

            <SummaryBox
              label="Late Marks"
              value={
                lateMarks
              }
            />

          </div>


          <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">

            <span>
              HR Holidays:{" "}
              <strong>
                {
                  tableRows.filter(
                    (row) =>
                      row.hrHoliday
                  ).length
                }
              </strong>
            </span>

            <span>
              Sundays:{" "}
              <strong>
                {
                  tableRows.filter(
                    (row) =>
                      row.isSunday
                  ).length
                }
              </strong>
            </span>

            <span>
              Birthday:{" "}
              <strong>
                {
                  tableRows.filter(
                    (row) =>
                      row.isBirthday
                  ).length
                }
              </strong>
            </span>

            <span>
              Unpaid Absence:{" "}
              <strong className="text-red-600">
                {
                  previewUnpaidAbsence
                }
              </strong>
            </span>

          </div>

        </div>

      )}


      {/* ==================================================
          ATTENDANCE TABLE
      ================================================== */}

      {!loadingData &&
        selectedEmployee &&
        tableRows.length > 0 && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-gray-900">
              Attendance & Leave Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete {monthName}{" "}
              {year}
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Day
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    In
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Out
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Hours
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Late
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Leave
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Payroll
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {tableRows.map(
                  (row) => (

                  <tr
                    key={
                      getDateKey(
                        row.date
                      )
                    }
                    className={
                      row.isSunday ||
                      row.hrHoliday ||
                      row.isBirthday
                        ? "bg-purple-50"
                        : "hover:bg-gray-50"
                    }
                  >

                    {/* DATE */}

                    <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">
                      {
                        row.date.toLocaleDateString(
                          "en-IN",
                          {
                            day:
                              "2-digit",
                            month:
                              "short",
                            year:
                              "numeric",
                          }
                        )
                      }
                    </td>


                    {/* DAY */}

                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {
                        row.weekday
                      }
                    </td>


                    {/* IN */}

                    <td className="px-5 py-4 text-sm">
                      {
                        row.inTime ||
                        "-"
                      }
                    </td>


                    {/* OUT */}

                    <td className="px-5 py-4 text-sm">
                      {
                        row.outTime ||
                        "-"
                      }
                    </td>


                    {/* HOURS */}

                    <td className="px-5 py-4 text-sm">
                      {
                        row.workingHours
                          ? `${row.workingHours} hrs`
                          : "-"
                      }
                    </td>


                    {/* LATE */}

                    <td className="px-5 py-4">

                      {row.lateMark ? (

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


                    {/* PAYROLL */}

                    <td className="px-5 py-4">

                      {row.payrollType ===
                        "Paid Holiday" ? (

                        <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          Paid Holiday
                        </span>

                      ) : row.payrollType ===
                        "Paid Birthday" ? (

                        <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                          Paid Birthday
                        </span>

                      ) : row.payrollType ===
                        "Paid Leave" ? (

                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Paid Leave
                        </span>

                      ) : row.payrollType ===
                        "LOP" ? (

                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          LOP
                        </span>

                      ) : row.payrollType ===
                        "Unpaid Absence" ? (

                        <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          Unpaid Absence
                        </span>

                      ) : (

                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          Paid
                        </span>

                      )}

                      {row.hrHoliday && (

                        <p className="text-xs text-purple-600 mt-1">
                          {
                            row.hrHoliday.name
                          }
                        </p>

                      )}

                    </td>


                    {/* MACHINE STATUS */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={
                          row.status
                        }
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* ==================================================
          CALCULATE BUTTON
      ================================================== */}

      {!loadingData &&
        selectedEmployee &&
        tableRows.length > 0 && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h3 className="text-lg font-bold text-gray-900">
                Calculate Salary
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Review the complete attendance table before calculating salary.
              </p>

            </div>


            <button
              onClick={
                calculateSalary
              }
              disabled={
                calculating
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold disabled:opacity-50"
            >

              {
                calculating
                  ? "Calculating Salary..."
                  : "Calculate Salary"
              }

            </button>

          </div>

        </div>

      )}


      {/* ==================================================
          FINAL SALARY
      ================================================== */}

      {salary && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-7 text-white">

            <p className="text-green-100 text-sm">
              Final Salary
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {
                money(
                  salary.netSalary
                )
              }
            </h2>

            <p className="text-green-100 mt-2">
              {monthName}{" "}
              {year}
            </p>

          </div>


          <div className="p-6">

            {/* SIMPLE SUMMARY */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

              <ResultBox
                label="Monthly Salary"
                value={money(
                  salary.monthlySalary
                )}
              />

              <ResultBox
                label="Working Days"
                value={
                  salary.workingDays
                }
              />

              <ResultBox
                label="Present Days"
                value={
                  salary.presentDays
                }
              />

              <ResultBox
                label="Paid Leave"
                value={
                  `${salary.paidLeaveDays} Days`
                }
              />

              <ResultBox
                label="Deducted Days"
                value={
                  salary.deductibleDays
                }
              />

            </div>


            {/* CALCULATION */}

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">

              <CalculationRow
                label="Monthly Salary"
                value={money(
                  salary.monthlySalary
                )}
              />


              <CalculationRow
                label="Working Days"
                value={
                  `${salary.workingDays} Days`
                }
              />


              <CalculationRow
                label="Present Days"
                value={
                  `${salary.presentDays} Days`
                }
              />


              <CalculationRow
                label="Paid Leave"
                value={
                  `${salary.paidLeaveDays} Days`
                }
                valueClass="text-green-600"
              />


              <CalculationRow
                label="LOP Days"
                value={
                  `${salary.lopDays} Days`
                }
                valueClass="text-red-600"
              />


              <CalculationRow
                label="Unpaid Absence"
                value={
                  `${salary.unpaidAbsenceDays} Days`
                }
                valueClass="text-orange-600"
              />


              <CalculationRow
                label="Per Day Salary"
                value={money(
                  salary.perDaySalary
                )}
              />


              {/* DEDUCTION */}

              <div className="flex items-center justify-between border-b border-gray-200 py-5">

                <div>

                  <p className="font-bold text-gray-700">
                    Total Deduction
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    (LOP + Unpaid Absence) × Per Day Salary
                  </p>

                </div>


                <p className="text-xl font-bold text-red-600">
                  -{" "}
                  {
                    money(
                      salary.totalDeduction
                    )
                  }
                </p>

              </div>


              {/* NET */}

              <div className="mt-6 rounded-2xl bg-green-100 border border-green-200 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-green-700">
                      Net Salary
                    </p>

                    <p className="text-3xl font-bold text-green-700 mt-1">
                      {
                        money(
                          salary.netSalary
                        )
                      }
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
// SUMMARY BOX
// ======================================================

function SummaryBox({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold text-gray-900 mt-2">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// RESULT BOX
// ======================================================

function ResultBox({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-lg font-bold text-gray-900 mt-2">
        {value}
      </p>

    </div>
  );
}


// ======================================================
// CALCULATION ROW
// ======================================================

function CalculationRow({
  label,
  value,
  valueClass =
    "text-gray-900",
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">

      <span className="text-gray-500">
        {label}
      </span>

      <span
        className={`font-semibold ${valueClass}`}
      >
        {value}
      </span>

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

  if (
    status === "Blank"
  ) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
        Blank
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      Present
    </span>
  );
}