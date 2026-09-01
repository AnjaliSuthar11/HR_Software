// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AttendanceManagement() {
//   const [employees, setEmployees] =
//     useState([]);

//   const [employeeId, setEmployeeId] =
//     useState("");

//   const [month, setMonth] =
//     useState(
//       new Date().getMonth() + 1
//     );

//   const [year, setYear] =
//     useState(
//       new Date().getFullYear()
//     );

//   const [pasteData, setPasteData] =
//     useState("");

//   const [previewRows, setPreviewRows] =
//     useState([]);

//   const [savedAttendance, setSavedAttendance] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [loadingSaved, setLoadingSaved] =
//     useState(false);

//   // ==================================================
//   // MONTH INFORMATION
//   // ==================================================

//   const calendarDays =
//     new Date(
//       Number(year),
//       Number(month),
//       0
//     ).getDate();

//   const monthName =
//     new Date(
//       Number(year),
//       Number(month) - 1,
//       1
//     ).toLocaleString(
//       "en-IN",
//       {
//         month: "long",
//       }
//     );

//   // ==================================================
//   // LOAD EMPLOYEES
//   // ==================================================

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   const loadEmployees =
//     async () => {
//       try {
//         const response =
//           await axios.get(
//             "/api/employee/list"
//           );

//         setEmployees(
//           response.data.employees ||
//             []
//         );
//       } catch (error) {
//         console.error(
//           "Load employees error:",
//           error
//         );

//         alert(
//           "Unable to load employees"
//         );
//       }
//     };

//   // ==================================================
//   // TIME TO MINUTES
//   // ==================================================

//   const timeToMinutes =
//     (time) => {
//       if (!time) {
//         return null;
//       }

//       const match =
//         String(time)
//           .trim()
//           .match(
//             /^(\d{1,2}):(\d{2})$/
//           );

//       if (!match) {
//         return null;
//       }

//       const hours =
//         Number(match[1]);

//       const minutes =
//         Number(match[2]);

//       if (
//         hours > 23 ||
//         minutes > 59
//       ) {
//         return null;
//       }

//       return (
//         hours * 60 +
//         minutes
//       );
//     };

//   // ==================================================
//   // WORKING MINUTES
//   // ==================================================

//   const calculateWorkingMinutes =
//     (
//       inTime,
//       outTime
//     ) => {
//       const inMinutes =
//         timeToMinutes(
//           inTime
//         );

//       const outMinutes =
//         timeToMinutes(
//           outTime
//         );

//       if (
//         inMinutes === null ||
//         outMinutes === null
//       ) {
//         return 0;
//       }

//       let difference =
//         outMinutes -
//         inMinutes;

//       if (
//         difference < 0
//       ) {
//         difference +=
//           24 * 60;
//       }

//       return difference;
//     };

//   // ==================================================
//   // LATE
//   // ==================================================

//   const getLateInfo =
//     (inTime) => {
//       const inMinutes =
//         timeToMinutes(
//           inTime
//         );

//       if (
//         inMinutes === null
//       ) {
//         return {
//           lateMark: false,
//           lateMinutes: 0,
//         };
//       }

//       // 10:00 AM = 600
//       if (
//         inMinutes > 600
//       ) {
//         return {
//           lateMark: true,
//           lateMinutes:
//             inMinutes - 600,
//         };
//       }

//       return {
//         lateMark: false,
//         lateMinutes: 0,
//       };
//     };

//   // ==================================================
//   // PARSE ATTENDANCE
//   // ==================================================

//   const parseAttendance =
//     () => {
//       const cleanPaste =
//         pasteData
//           .replace(/\r/g, "")
//           .trimEnd();

//       const lines =
//         cleanPaste
//           ? cleanPaste.split(
//               "\n"
//             )
//           : [];

//       const rows = [];

//       for (
//         let index = 0;
//         index < calendarDays;
//         index++
//       ) {
//         const line =
//           lines[index] || "";

//         const trimmed =
//           line.trim();

//         const date =
//           new Date(
//             Number(year),
//             Number(month) - 1,
//             index + 1
//           );

//         // ==========================================
//         // SUNDAY
//         // ==========================================

//         if (
//           date.getDay() === 0
//         ) {
//           rows.push({
//             inTime: "",
//             outTime: "",
//             status: "Holiday",
//             workingMinutes: 0,
//             workingHours: 0,
//             lateMark: false,
//             lateMinutes: 0,
//           });

//           continue;
//         }

//         // ==========================================
//         // ABSENCE
//         // ==========================================

//         if (
//           trimmed.toLowerCase() ===
//             "absence" ||
//           trimmed.toLowerCase() ===
//             "absent"
//         ) {
//           rows.push({
//             inTime: "",
//             outTime: "",
//             status: "Absent",
//             workingMinutes: 0,
//             workingHours: 0,
//             lateMark: false,
//             lateMinutes: 0,
//           });

//           continue;
//         }

//         // ==========================================
//         // TIME
//         // ==========================================

//         const times =
//           trimmed.match(
//             /\b\d{1,2}:\d{2}\b/g
//           );

//         if (
//           times &&
//           times.length >= 2
//         ) {
//           const inTime =
//             times[0];

//           const outTime =
//             times[1];

//           const workingMinutes =
//             calculateWorkingMinutes(
//               inTime,
//               outTime
//             );

//           const lateInfo =
//             getLateInfo(
//               inTime
//             );

//           rows.push({
//             inTime,
//             outTime,
//             status: "Present",

//             workingMinutes,

//             workingHours:
//               Number(
//                 (
//                   workingMinutes /
//                   60
//                 ).toFixed(2)
//               ),

//             lateMark:
//               lateInfo.lateMark,

//             lateMinutes:
//               lateInfo.lateMinutes,
//           });

//           continue;
//         }

//         // ==========================================
//         // BLANK = WORKING DAY
//         // ==========================================

//         rows.push({
//           inTime: "",
//           outTime: "",
//           status: "Present",
//           workingMinutes: 0,
//           workingHours: 0,
//           lateMark: false,
//           lateMinutes: 0,
//         });
//       }

//       return rows;
//     };

//   // ==================================================
//   // PREVIEW
//   // ==================================================

//   const handlePreview =
//     () => {
//       if (!employeeId) {
//         alert(
//           "Please select employee"
//         );

//         return;
//       }

//       const rows =
//         parseAttendance();

//       setPreviewRows(rows);
//     };

//   // ==================================================
//   // SAVE
//   // ==================================================

//   const handleSave =
//     async () => {
//       if (!employeeId) {
//         alert(
//           "Please select employee"
//         );

//         return;
//       }

//       if (
//         previewRows.length ===
//         0
//       ) {
//         alert(
//           "Please preview attendance first"
//         );

//         return;
//       }

//       try {
//         setLoading(true);

//         const response =
//           await axios.post(
//             "/api/attendance/bulk",
//             {
//               employeeId,

//               month:
//                 Number(month),

//               year:
//                 Number(year),

//               rows:
//                 previewRows,
//             }
//           );

//         alert(
//           response.data.message ||
//             "Attendance imported successfully"
//         );

//         await loadSavedAttendance();

//       } catch (error) {
//         console.error(
//           "Save attendance error:",
//           error
//         );

//         alert(
//           error.response?.data
//             ?.message ||
//             "Unable to save attendance"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//   // ==================================================
//   // LOAD SAVED
//   // ==================================================

//   const loadSavedAttendance =
//     async () => {
//       if (!employeeId) {
//         setSavedAttendance(
//           []
//         );

//         return;
//       }

//       try {
//         setLoadingSaved(
//           true
//         );

//         const response =
//           await axios.get(
//             `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
//           );

//         setSavedAttendance(
//           response.data.attendance ||
//             []
//         );

//       } catch (error) {
//         console.error(
//           "Load saved attendance error:",
//           error
//         );

//         setSavedAttendance(
//           []
//         );
//       } finally {
//         setLoadingSaved(
//           false
//         );
//       }
//     };

//   // ==================================================
//   // SELECTION CHANGE
//   // ==================================================

//   useEffect(() => {
//     setPreviewRows([]);

//     setSavedAttendance([]);

//     if (employeeId) {
//       loadSavedAttendance();
//     }
//   }, [
//     employeeId,
//     month,
//     year,
//   ]);

//   // ==================================================
//   // DISPLAY ROWS
//   // ==================================================

//   const displayRows =
//     savedAttendance.length >
//     0
//       ? savedAttendance
//       : previewRows;

//   // ==================================================
//   // SUMMARY
//   // ==================================================

//   const holidayDays =
//     displayRows.filter(
//       (row) =>
//         row.status ===
//         "Holiday"
//     ).length;

//   const workingDays =
//     calendarDays -
//     holidayDays;

//   const presentDays =
//     displayRows.filter(
//       (row) =>
//         row.status ===
//         "Present"
//     ).length;

//   const absentDays =
//     displayRows.filter(
//       (row) =>
//         row.status ===
//         "Absent"
//     ).length;

//   const lateMarks =
//     displayRows.filter(
//       (row) =>
//         row.lateMark ===
//         true
//     ).length;

//   const totalLateMinutes =
//     displayRows.reduce(
//       (total, row) =>
//         total +
//         Number(
//           row.lateMinutes ||
//             0
//         ),
//       0
//     );

//   const clDays =
//     displayRows
//       .filter(
//         (row) =>
//           row.leaveType ===
//           "CL"
//       )
//       .reduce(
//         (total, row) =>
//           total +
//           Number(
//             row.numberOfDays ||
//               1
//           ),
//         0
//       );

//   const slDays =
//     displayRows
//       .filter(
//         (row) =>
//           row.leaveType ===
//           "SL"
//       )
//       .reduce(
//         (total, row) =>
//           total +
//           Number(
//             row.numberOfDays ||
//               1
//           ),
//         0
//       );

//   const lopDays =
//     displayRows
//       .filter(
//         (row) =>
//           row.leaveType ===
//           "LOP"
//       )
//       .reduce(
//         (total, row) =>
//           total +
//           Number(
//             row.numberOfDays ||
//               1
//           ),
//         0
//       );

//   const paidLeaveDays =
//     clDays + slDays;

//   const unpaidAbsenceDays =
//     displayRows.filter(
//       (row) =>
//         row.status ===
//           "Absent" &&
//         !row.leaveType
//     ).length;

//   const paidAbsenceDays =
//     displayRows
//       .filter(
//         (row) =>
//           row.status ===
//             "Absent" &&
//           (
//             row.leaveType ===
//               "CL" ||
//             row.leaveType ===
//               "SL"
//           ) &&
//           row.leaveStatus ===
//             "Paid"
//       )
//       .reduce(
//         (total, row) =>
//           total +
//           Number(
//             row.numberOfDays ||
//               1
//           ),
//         0
//       );

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">

//       {/* ==================================================
//           PAGE HEADER
//       ================================================== */}

//       <div className="mb-8">

//         <h1 className="text-3xl font-bold text-gray-900">
//           Attendance Management
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Manage attendance for one employee at a time.
//         </p>

//       </div>


//       {/* ==================================================
//           SELECTION
//       ================================================== */}

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

//         <h2 className="text-lg font-bold mb-6">
//           Select Employee & Month
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//           {/* EMPLOYEE */}

//           <div>

//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Employee
//             </label>

//             <select
//               value={employeeId}
//               onChange={(e) =>
//                 setEmployeeId(
//                   e.target.value
//                 )
//               }
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
//             >

//               <option value="">
//                 Select Employee
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
//                     -
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
//               onChange={(e) =>
//                 setMonth(
//                   Number(
//                     e.target.value
//                   )
//                 )
//               }
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
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
//               value={year}
//               onChange={(e) =>
//                 setYear(
//                   e.target.value
//                 )
//               }
//               className="w-full border border-gray-200 rounded-xl px-4 py-3"
//             />

//           </div>

//         </div>

//       </div>


//       {/* ==================================================
//           PASTE
//       ================================================== */}

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

//         <div className="flex items-center justify-between mb-3">

//           <div>

//             <h2 className="text-lg font-bold">
//               Paste Attendance
//             </h2>

//             <p className="text-sm text-gray-500 mt-1">
//               Paste one employee's attendance.
//               Keep blank lines.
//               "Absence" means absent.
//             </p>

//           </div>

//         </div>

//         <textarea
//           value={pasteData}
//           onChange={(e) =>
//             setPasteData(
//               e.target.value
//             )
//           }
//           rows={18}
//           placeholder={`Absence
// 09:46    15:08
// 09:46    19:00

// 10:06    19:00
// 10:05    19:00

// 10:04    15:00`}
//           className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-mono text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//         />

//         <div className="flex items-center justify-between mt-5">

//           <div className="flex gap-4">

//             <div className="bg-blue-50 rounded-xl px-4 py-3">

//               <p className="text-xs text-blue-500">
//                 Calendar Days
//               </p>

//               <p className="font-bold text-blue-700">
//                 {calendarDays}
//               </p>

//             </div>

//             <div className="bg-purple-50 rounded-xl px-4 py-3">

//               <p className="text-xs text-purple-500">
//                 Parsed Rows
//               </p>

//               <p className="font-bold text-purple-700">
//                 {
//                   Math.min(
//                     pasteData
//                       ? pasteData
//                           .replace(
//                             /\r/g,
//                             ""
//                           )
//                           .trimEnd()
//                           .split("\n")
//                           .length
//                       : 0,
//                     calendarDays
//                   )
//                 }
//               </p>

//             </div>

//           </div>

//           <button
//             onClick={
//               handlePreview
//             }
//             disabled={
//               !employeeId
//             }
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
//           >
//             Preview Attendance
//           </button>

//         </div>

//       </div>


//       {/* ==================================================
//           SUMMARY
//       ================================================== */}

//       {displayRows.length >
//         0 && (

//         <div className="mb-6">

//           <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">

//             <SummaryCard
//               label="Calendar Days"
//               value={
//                 calendarDays
//               }
//             />

//             <SummaryCard
//               label="Working Days"
//               value={
//                 workingDays
//               }
//             />

//             <SummaryCard
//               label="Holidays"
//               value={
//                 holidayDays
//               }
//             />

//             <SummaryCard
//               label="Present"
//               value={
//                 presentDays
//               }
//             />

//             <SummaryCard
//               label="Absent"
//               value={
//                 absentDays
//               }
//             />

//             <SummaryCard
//               label="Late Marks"
//               value={
//                 lateMarks
//               }
//             />

//             <SummaryCard
//               label="CL"
//               value={
//                 clDays
//               }
//             />

//             <SummaryCard
//               label="SL"
//               value={
//                 slDays
//               }
//             />

//           </div>

//           <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-6 text-sm">

//             <div>
//               Paid Leave:{" "}
//               <strong className="text-green-600">
//                 {paidLeaveDays}
//               </strong>
//             </div>

//             <div>
//               Paid Absence:{" "}
//               <strong className="text-green-600">
//                 {paidAbsenceDays}
//               </strong>
//             </div>

//             <div>
//               Unpaid Absence:{" "}
//               <strong className="text-red-600">
//                 {unpaidAbsenceDays}
//               </strong>
//             </div>

//             <div>
//               LOP:{" "}
//               <strong className="text-red-600">
//                 {lopDays}
//               </strong>
//             </div>

//             <div>
//               Late Minutes:{" "}
//               <strong className="text-orange-600">
//                 {totalLateMinutes}
//               </strong>
//             </div>

//           </div>

//         </div>
//       )}


//       {/* ==================================================
//           ATTENDANCE TABLE
//       ================================================== */}

//       {displayRows.length >
//         0 && (

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

//             <div>

//               <h2 className="text-lg font-bold">
//                 Attendance Details
//               </h2>

//               <p className="text-sm text-gray-500 mt-1">
//                 {monthName}{" "}
//                 {year}
//               </p>

//             </div>

//             {!savedAttendance.length && (

//               <button
//                 onClick={
//                   handleSave
//                 }
//                 disabled={
//                   loading
//                 }
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
//               >
//                 {loading
//                   ? "Saving..."
//                   : "Save Attendance"}
//               </button>

//             )}

//           </div>


//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead className="bg-gray-50">

//                 <tr>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Date
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Weekday
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     In
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Out
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Working Hours
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Late
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Leave
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Payment
//                   </th>

//                   <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                     Status
//                   </th>

//                 </tr>

//               </thead>

//               <tbody className="divide-y divide-gray-100">

//                 {displayRows.map(
//                   (row, index) => {

//                     const recordDate =
//                       row.date
//                         ? new Date(
//                             row.date
//                           )
//                         : new Date(
//                             Number(
//                               year
//                             ),
//                             Number(
//                               month
//                             ) - 1,
//                             index + 1
//                           );

//                     const weekday =
//                       recordDate.toLocaleDateString(
//                         "en-IN",
//                         {
//                           weekday:
//                             "long",
//                         }
//                       );

//                     let leaveName =
//                       "";

//                     if (
//                       row.leaveType ===
//                       "CL"
//                     ) {
//                       leaveName =
//                         "Casual Leave";
//                     }

//                     if (
//                       row.leaveType ===
//                       "SL"
//                     ) {
//                       leaveName =
//                         "Sick Leave";
//                     }

//                     if (
//                       row.leaveType ===
//                       "LOP"
//                     ) {
//                       leaveName =
//                         "Loss of Pay";
//                     }

//                     return (
//                       <tr
//                         key={
//                           row._id ||
//                           index
//                         }
//                         className="hover:bg-gray-50"
//                       >

//                         {/* DATE */}

//                         <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">

//                           {recordDate.toLocaleDateString(
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

//                           {weekday}

//                         </td>

//                         {/* IN */}

//                         <td className="px-5 py-4 text-sm">

//                           {row.inTime ||
//                             "-"}

//                         </td>

//                         {/* OUT */}

//                         <td className="px-5 py-4 text-sm">

//                           {row.outTime ||
//                             "-"}

//                         </td>

//                         {/* HOURS */}

//                         <td className="px-5 py-4 text-sm">

//                           {row.workingHours
//                             ? `${row.workingHours} hrs`
//                             : "-"}

//                         </td>

//                         {/* LATE */}

//                         <td className="px-5 py-4">

//                           {row.lateMark ? (

//                             <div>

//                               <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
//                                 Late
//                               </span>

//                               <p className="text-xs text-gray-400 mt-1">
//                                 {
//                                   row.lateMinutes
//                                 }{" "}
//                                 min late
//                               </p>

//                             </div>

//                           ) : (

//                             <span className="text-sm text-gray-400">
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
//                                   "LOP"
//                                     ? "bg-red-100 text-red-700"
//                                     : row.leaveType ===
//                                       "SL"
//                                     ? "bg-blue-100 text-blue-700"
//                                     : "bg-green-100 text-green-700"
//                                 }`}
//                               >
//                                 {
//                                   row.leaveType
//                                 }
//                               </span>

//                               <p className="text-xs text-gray-500 mt-1">
//                                 {
//                                   leaveName
//                                 }
//                               </p>

//                             </div>

//                           ) : (

//                             <span className="text-gray-400">
//                               -
//                             </span>

//                           )}

//                         </td>

//                         {/* PAYMENT */}

//                         <td className="px-5 py-4">

//                           {row.leaveStatus ? (

//                             row.leaveStatus ===
//                             "Paid" ? (

//                               <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                                 Paid
//                               </span>

//                             ) : (

//                               <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
//                                 LOP
//                               </span>

//                             )

//                           ) : (

//                             <span className="text-gray-400">
//                               -
//                             </span>

//                           )}

//                         </td>

//                         {/* STATUS */}

//                         <td className="px-5 py-4">

//                           <AttendanceStatus
//                             status={
//                               row.status
//                             }
//                           />

//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }


// // ======================================================
// // SUMMARY CARD
// // ======================================================

// function SummaryCard({
//   label,
//   value,
// }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">

//       <p className="text-xs text-gray-400">
//         {label}
//       </p>

//       <p className="text-2xl font-bold mt-2 text-gray-900">
//         {value}
//       </p>

//     </div>
//   );
// }


// // ======================================================
// // STATUS
// // ======================================================

// function AttendanceStatus({
//   status,
// }) {
//   if (
//     status ===
//     "Holiday"
//   ) {
//     return (
//       <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
//         Holiday
//       </span>
//     );
//   }

//   if (
//     status ===
//     "Absent"
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





// 1st september
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function AttendanceManagement() {
  // ==================================================
  // STATE
  // ==================================================

  const [employees, setEmployees] = useState([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [pasteData, setPasteData] =
    useState("");

  const [previewRows, setPreviewRows] =
    useState([]);

  const [savedAttendance, setSavedAttendance] =
    useState([]);

  const [holidays, setHolidays] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingSaved, setLoadingSaved] =
    useState(false);

  const [loadingHolidays, setLoadingHolidays] =
    useState(false);


  // ==================================================
  // MONTH INFORMATION
  // ==================================================

  const calendarDays = useMemo(() => {
    return new Date(
      Number(year),
      Number(month),
      0
    ).getDate();
  }, [month, year]);


  const monthName = useMemo(() => {
    return new Date(
      Number(year),
      Number(month) - 1,
      1
    ).toLocaleString(
      "en-IN",
      {
        month: "long",
      }
    );
  }, [month, year]);


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
  // LOAD EMPLOYEES
  // ==================================================

  useEffect(() => {
    loadEmployees();
  }, []);


  const loadEmployees = async () => {
    try {
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
        "Load employees error:",
        error
      );

      alert(
        "Unable to load employees"
      );
    }
  };


  // ==================================================
  // LOAD HR HOLIDAYS
  // ==================================================

  const loadHolidays = async () => {
    try {
      setLoadingHolidays(true);

      const response =
        await axios.get(
          `/api/holiday?year=${Number(
            year
          )}`
        );

      setHolidays(
        response.data?.holidays ||
          []
      );

    } catch (error) {

      console.error(
        "Load holidays error:",
        error
      );

      setHolidays([]);

      /*
        We don't stop attendance if
        holiday API fails.
      */
    } finally {
      setLoadingHolidays(false);
    }
  };


  useEffect(() => {
    loadHolidays();
  }, [year]);


  // ==================================================
  // HOLIDAY MAP
  // ==================================================

  const holidayMap = useMemo(() => {
    const map = {};

    for (
      const holiday of holidays
    ) {
      if (
        holiday?.paid === false
      ) {
        continue;
      }

      if (
        !holiday?.date
      ) {
        continue;
      }

      map[
        getDateKey(
          holiday.date
        )
      ] = holiday;
    }

    return map;
  }, [holidays]);


  // ==================================================
  // TIME TO MINUTES
  // ==================================================

  const timeToMinutes = (
    time
  ) => {
    if (!time) {
      return null;
    }

    const match =
      String(time)
        .trim()
        .match(
          /^(\d{1,2}):(\d{2})$/
        );

    if (!match) {
      return null;
    }

    const hours =
      Number(match[1]);

    const minutes =
      Number(match[2]);

    if (
      hours > 23 ||
      minutes > 59
    ) {
      return null;
    }

    return (
      hours * 60 +
      minutes
    );
  };


  // ==================================================
  // WORKING MINUTES
  // ==================================================

  const calculateWorkingMinutes = (
    inTime,
    outTime
  ) => {
    const inMinutes =
      timeToMinutes(inTime);

    const outMinutes =
      timeToMinutes(outTime);

    if (
      inMinutes === null ||
      outMinutes === null
    ) {
      return 0;
    }

    let difference =
      outMinutes -
      inMinutes;

    if (
      difference < 0
    ) {
      difference +=
        24 * 60;
    }

    return difference;
  };


  // ==================================================
  // LATE
  // ==================================================

  const getLateInfo = (
    inTime
  ) => {

    const inMinutes =
      timeToMinutes(
        inTime
      );

    if (
      inMinutes === null
    ) {
      return {
        lateMark: false,
        lateMinutes: 0,
      };
    }

    /*
      10:00 AM = 600 minutes.

      10:00 exactly = NOT late.

      10:01 or later = late.
    */

    if (
      inMinutes > 600
    ) {
      return {
        lateMark: true,

        lateMinutes:
          inMinutes -
          600,
      };
    }

    return {
      lateMark: false,
      lateMinutes: 0,
    };
  };


  // ==================================================
  // PARSE PASTED ATTENDANCE
  // ==================================================
  //
  // IMPORTANT:
  //
  // We do NOT trim the beginning.
  //
  // This means:
  //
  // "\n09:46 15:08"
  //
  // keeps the first blank row.
  //
  // ==================================================

  const parseAttendance = () => {

    const cleanPaste =
      String(
        pasteData || ""
      )
        .replace(/\r/g, "")
        .trimEnd();

    const lines =
      cleanPaste
        ? cleanPaste.split("\n")
        : [];


    const rows = [];


    for (
      let index = 0;
      index < calendarDays;
      index++
    ) {

      const line =
        lines[index] || "";

      const trimmed =
        line.trim();


      const date =
        new Date(
          Number(year),
          Number(month) - 1,
          index + 1
        );


      date.setHours(
        0,
        0,
        0,
        0
      );


      const key =
        getDateKey(date);


      const hrHoliday =
        holidayMap[key];


      const isSunday =
        date.getDay() === 0;


      // ==================================================
      // SUNDAY
      // ==================================================

      if (
        isSunday
      ) {

        rows.push({
          date,
          inTime: "",
          outTime: "",

          status:
            "Holiday",

          workingMinutes: 0,
          workingHours: 0,

          lateMark: false,
          lateMinutes: 0,

          holidayType:
            "Sunday",

          holidayName:
            "Sunday",
        });

        continue;
      }


      // ==================================================
      // HR HOLIDAY
      // ==================================================

      if (
        hrHoliday
      ) {

        rows.push({
          date,

          inTime: "",
          outTime: "",

          /*
            HR holiday always wins.
          */

          status:
            "Holiday",

          workingMinutes: 0,
          workingHours: 0,

          lateMark: false,
          lateMinutes: 0,

          holidayType:
            "HR Holiday",

          holidayName:
            hrHoliday.name ||
            hrHoliday.title ||
            "HR Holiday",
        });

        continue;
      }


      // ==================================================
      // ABSENCE
      // ==================================================

      if (
        trimmed.toLowerCase() ===
          "absence" ||
        trimmed.toLowerCase() ===
          "absent"
      ) {

        rows.push({

          date,

          inTime: "",
          outTime: "",

          status:
            "Absent",

          workingMinutes: 0,
          workingHours: 0,

          lateMark: false,
          lateMinutes: 0,

          holidayType: "",
          holidayName: "",
        });

        continue;
      }


      // ==================================================
      // TIMES
      // ==================================================

      const times =
        trimmed.match(
          /\b\d{1,2}:\d{2}\b/g
        );


      if (
        times &&
        times.length >= 2
      ) {

        const inTime =
          times[0];

        const outTime =
          times[1];


        const workingMinutes =
          calculateWorkingMinutes(
            inTime,
            outTime
          );


        const lateInfo =
          getLateInfo(
            inTime
          );


        rows.push({

          date,

          inTime,

          outTime,

          status:
            "Present",

          workingMinutes,

          workingHours:
            Number(
              (
                workingMinutes /
                60
              ).toFixed(2)
            ),

          lateMark:
            lateInfo.lateMark,

          lateMinutes:
            lateInfo.lateMinutes,

          holidayType: "",
          holidayName: "",
        });

        continue;
      }


      // ==================================================
      // BLANK
      // ==================================================

      /*
        IMPORTANT:

        Empty machine row is NOT Present.

        It is Blank.

        Payroll can later decide how Blank
        is treated, but attendance must
        preserve the fact that the machine
        supplied no attendance.
      */

      rows.push({

        date,

        inTime: "",
        outTime: "",

        status:
          "Blank",

        workingMinutes: 0,
        workingHours: 0,

        lateMark: false,
        lateMinutes: 0,

        holidayType: "",
        holidayName: "",
      });
    }


    return rows;
  };


  // ==================================================
  // PREVIEW
  // ==================================================

  const handlePreview = () => {

    if (!employeeId) {
      alert(
        "Please select employee"
      );

      return;
    }


    const rows =
      parseAttendance();


    setPreviewRows(
      rows
    );
  };


  // ==================================================
  // SAVE
  // ==================================================

  const handleSave =
    async () => {

      if (!employeeId) {

        alert(
          "Please select employee"
        );

        return;
      }


      if (
        previewRows.length !==
        calendarDays
      ) {

        alert(
          `Please preview the complete ${calendarDays}-day attendance first.`
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

              month:
                Number(month),

              year:
                Number(year),

              rows:
                previewRows,
            }
          );


        alert(
          response.data?.message ||
            "Attendance imported successfully"
        );


        await loadSavedAttendance();


      } catch (error) {

        console.error(
          "Save attendance error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to save attendance"
        );

      } finally {

        setLoading(false);
      }
    };


  // ==================================================
  // LOAD SAVED ATTENDANCE
  // ==================================================

  const loadSavedAttendance =
    async () => {

      if (!employeeId) {

        setSavedAttendance([]);

        return;
      }


      try {

        setLoadingSaved(
          true
        );


        const response =
          await axios.get(
            `/api/attendance?employeeId=${employeeId}&month=${month}&year=${year}`
          );


        setSavedAttendance(
          response.data?.attendance ||
            []
        );


      } catch (error) {

        console.error(
          "Load saved attendance error:",
          error
        );

        setSavedAttendance([]);

      } finally {

        setLoadingSaved(
          false
        );
      }
    };


  // ==================================================
  // SELECTION CHANGE
  // ==================================================

  useEffect(() => {

    setPreviewRows([]);

    setSavedAttendance([]);

    if (employeeId) {
      loadSavedAttendance();
    }

  }, [
    employeeId,
    month,
    year,
  ]);


  // ==================================================
  // ATTENDANCE MAP
  // ==================================================

  const savedAttendanceMap =
    useMemo(() => {

      const map = {};

      savedAttendance.forEach(
        (row) => {

          if (!row?.date) {
            return;
          }

          map[
            getDateKey(
              row.date
            )
          ] = row;
        }
      );

      return map;

    }, [
      savedAttendance,
    ]);


  // ==================================================
  // PREVIEW MAP
  // ==================================================

  const previewAttendanceMap =
    useMemo(() => {

      const map = {};

      previewRows.forEach(
        (row) => {

          if (!row?.date) {
            return;
          }

          map[
            getDateKey(
              row.date
            )
          ] = row;
        }
      );

      return map;

    }, [
      previewRows,
    ]);


  // ==================================================
  // COMPLETE MONTH DISPLAY
  // ==================================================
  //
  // This is the important part.
  //
  // We generate every calendar date ourselves.
  //
  // Therefore:
  //
  // 01 May holiday works.
  // 31 May holiday works.
  // 01 June holiday works.
  //
  // We never depend on attendance records
  // to decide whether the calendar date exists.
  //
  // ==================================================

  const displayRows =
    useMemo(() => {

      const rows = [];

      for (
        let day = 1;
        day <= calendarDays;
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


        const isSunday =
          date.getDay() === 0;


        const hrHoliday =
          holidayMap[key];


        /*
          Saved data has priority for
          machine attendance.

          Preview is used when there is
          no saved data.
        */

        const sourceRow =
          savedAttendance.length > 0
            ? savedAttendanceMap[key]
            : previewAttendanceMap[key];


        // =================================================
        // SUNDAY
        // =================================================

        if (
          isSunday
        ) {

          rows.push({

            ...(sourceRow || {}),

            date,

            inTime: "",
            outTime: "",

            workingMinutes: 0,
            workingHours: 0,

            lateMark: false,
            lateMinutes: 0,

            status:
              "Holiday",

            holidayType:
              "Sunday",

            holidayName:
              "Sunday",
          });

          continue;
        }


        // =================================================
        // HR HOLIDAY
        // =================================================

        if (
          hrHoliday
        ) {

          rows.push({

            ...(sourceRow || {}),

            date,

            inTime: "",
            outTime: "",

            workingMinutes: 0,
            workingHours: 0,

            lateMark: false,
            lateMinutes: 0,

            status:
              "Holiday",

            holidayType:
              "HR Holiday",

            holidayName:
              hrHoliday.name ||
              hrHoliday.title ||
              "HR Holiday",
          });

          continue;
        }


        // =================================================
        // SAVED / PREVIEW RECORD
        // =================================================

        if (
          sourceRow
        ) {

          rows.push({

            ...sourceRow,

            date,

          });

          continue;
        }


        // =================================================
        // NO RECORD
        // =================================================

        rows.push({

          date,

          inTime: "",
          outTime: "",

          workingMinutes: 0,
          workingHours: 0,

          lateMark: false,
          lateMinutes: 0,

          status:
            "Blank",

          holidayType: "",
          holidayName: "",
        });
      }


      return rows;

    }, [
      calendarDays,
      year,
      month,
      holidayMap,
      savedAttendance.length,
      savedAttendanceMap,
      previewAttendanceMap,
    ]);


  // ==================================================
  // SUMMARY
  // ==================================================

  const holidayDays =
    displayRows.filter(
      (row) =>
        row.status ===
        "Holiday"
    ).length;


  /*
    Working Days means the full payroll
    calendar days.

    Example:
    May = 31
    June = 30

    Holiday does NOT get removed.
  */

  const workingDays =
    calendarDays;


  const presentDays =
    displayRows.filter(
      (row) =>
        row.status ===
        "Present"
    ).length;


  const absentDays =
    displayRows.filter(
      (row) =>
        row.status ===
        "Absent"
    ).length;


  const blankDays =
    displayRows.filter(
      (row) =>
        row.status ===
        "Blank"
    ).length;


  const lateMarks =
    displayRows.filter(
      (row) =>
        row.lateMark ===
        true
    ).length;


  const totalLateMinutes =
    displayRows.reduce(
      (total, row) =>
        total +
        Number(
          row.lateMinutes ||
            0
        ),
      0
    );


  // ==================================================
  // STYLES
  // ==================================================

  const rowClass = (row) => {

    if (
      row.status ===
      "Holiday"
    ) {
      return "bg-purple-50";
    }

    if (
      row.status ===
      "Absent"
    ) {
      return "bg-red-50";
    }

    if (
      row.status ===
      "Blank"
    ) {
      return "bg-gray-50";
    }

    return "hover:bg-gray-50";
  };


  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage attendance for one employee at a time.
        </p>

      </div>


      {/* ==================================================
          EMPLOYEE / MONTH / YEAR
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <h2 className="text-lg font-bold mb-6">
          Select Employee & Month
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


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

              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
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

              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
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

              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          PASTE ATTENDANCE
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-bold">
            Paste Attendance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Paste one employee's machine attendance.
            Blank = no machine attendance.
            "Absence" = absent.
            Time after 10:00 AM = late.
          </p>

        </div>


        <textarea
          value={
            pasteData
          }
          onChange={(e) =>
            setPasteData(
              e.target.value
            )
          }
          rows={18}
          placeholder={`Absence
09:46    15:08
09:46    19:00

10:06    19:00
10:05    19:00

10:04    15:00`}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-mono text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">


          <div className="flex flex-wrap gap-4">

            <div className="bg-blue-50 rounded-xl px-4 py-3">

              <p className="text-xs text-blue-500">
                Calendar Days
              </p>

              <p className="font-bold text-blue-700">
                {
                  calendarDays
                }
              </p>

            </div>


            <div className="bg-purple-50 rounded-xl px-4 py-3">

              <p className="text-xs text-purple-500">
                HR Holidays
              </p>

              <p className="font-bold text-purple-700">
                {
                  holidays.filter(
                    (holiday) =>
                      holiday?.paid !== false &&
                      holiday?.date &&
                      new Date(
                        holiday.date
                      ).getFullYear() ===
                        Number(year)
                  ).length
                }
              </p>

            </div>


            <div className="bg-gray-50 rounded-xl px-4 py-3">

              <p className="text-xs text-gray-500">
                Sundays
              </p>

              <p className="font-bold text-gray-700">
                {
                  displayRows.filter(
                    (row) =>
                      row.holidayType ===
                      "Sunday"
                  ).length
                }
              </p>

            </div>

          </div>


          <button
            onClick={
              handlePreview
            }
            disabled={
              !employeeId
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Preview Attendance
          </button>

        </div>

      </div>


      {/* ==================================================
          LOADING SAVED
      ================================================== */}

      {loadingSaved && (

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-center">

          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />

          <p className="text-gray-500">
            Loading saved attendance...
          </p>

        </div>

      )}


      {/* ==================================================
          SUMMARY
      ================================================== */}

      {displayRows.length > 0 && (

        <div className="mb-6">

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">

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
              label="Holidays"
              value={
                holidayDays
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
              label="Blank"
              value={
                blankDays
              }
            />

            <SummaryCard
              label="Late Marks"
              value={
                lateMarks
              }
            />

          </div>


          <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-6 text-sm">

            <div>
              Late Minutes:{" "}
              <strong className="text-orange-600">
                {
                  totalLateMinutes
                }
              </strong>
            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          ATTENDANCE TABLE
      ================================================== */}

      {displayRows.length > 0 && (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-lg font-bold">
                Attendance Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {monthName}{" "}
                {year}
              </p>

            </div>


            {!savedAttendance.length &&
              previewRows.length > 0 && (

              <button
                onClick={
                  handleSave
                }
                disabled={
                  loading
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {
                  loading
                    ? "Saving..."
                    : "Save Attendance"
                }
              </button>

            )}

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Weekday
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    In
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Out
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Working Hours
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Late
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Holiday
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {displayRows.map(
                  (row, index) => {

                    const recordDate =
                      row.date
                        ? new Date(
                            row.date
                          )
                        : new Date(
                            Number(year),
                            Number(month) - 1,
                            index + 1
                          );


                    const weekday =
                      recordDate.toLocaleDateString(
                        "en-IN",
                        {
                          weekday:
                            "long",
                        }
                      );


                    return (

                      <tr
                        key={
                          getDateKey(
                            recordDate
                          )
                        }
                        className={
                          rowClass(
                            row
                          )
                        }
                      >

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm font-semibold whitespace-nowrap">

                          {
                            recordDate.toLocaleDateString(
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


                        {/* WEEKDAY */}

                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">

                          {
                            weekday
                          }

                        </td>


                        {/* IN */}

                        <td className="px-5 py-4 text-sm">

                          {
                            row.status ===
                            "Holiday"
                              ? "-"
                              : row.inTime ||
                                "-"
                          }

                        </td>


                        {/* OUT */}

                        <td className="px-5 py-4 text-sm">

                          {
                            row.status ===
                            "Holiday"
                              ? "-"
                              : row.outTime ||
                                "-"
                          }

                        </td>


                        {/* HOURS */}

                        <td className="px-5 py-4 text-sm">

                          {
                            row.status ===
                            "Holiday"
                              ? "-"
                              : row.workingHours
                              ? `${row.workingHours} hrs`
                              : "-"
                          }

                        </td>


                        {/* LATE */}

                        <td className="px-5 py-4">

                          {
                            row.status ===
                            "Holiday"
                              ? (

                                <span className="text-gray-400">
                                  -
                                </span>

                              )
                              : row.lateMark
                              ? (

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

                              )
                              : (

                                <span className="text-gray-400">
                                  -
                                </span>

                              )
                          }

                        </td>


                        {/* HOLIDAY */}

                        <td className="px-5 py-4">

                          {
                            row.status ===
                            "Holiday"
                              ? (

                                <div>

                                  <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                    {
                                      row.holidayType ===
                                      "Sunday"
                                        ? "Sunday"
                                        : "Paid Holiday"
                                    }
                                  </span>

                                  {
                                    row.holidayName && (
                                      <p className="text-xs text-purple-600 mt-1">
                                        {
                                          row.holidayName
                                        }
                                      </p>
                                    )
                                  }

                                </div>

                              )
                              : (

                                <span className="text-gray-400">
                                  -
                                </span>

                              )
                          }

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <AttendanceStatus
                            status={
                              row.status
                            }
                          />

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
// STATUS
// ======================================================

function AttendanceStatus({
  status,
}) {

  if (
    status ===
    "Holiday"
  ) {
    return (
      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        Holiday
      </span>
    );
  }


  if (
    status ===
    "Absent"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Absent
      </span>
    );
  }


  if (
    status ===
    "Blank"
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