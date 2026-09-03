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

  const [approvedLeaves, setApprovedLeaves] =
    useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const [loadingData, setLoadingData] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // ==================================================
  // MONTH
  // ==================================================

  const calendarDays = useMemo(() => {
    return new Date(
      Number(year),
      Number(month),
      0
    ).getDate();
  }, [year, month]);


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
  }, [year, month]);


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
      setLoadingEmployees(true);

      const response =
        await axios.get(
          "/api/employee/list"
        );

      setEmployees(
        response.data?.employees || []
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
      setLoadingEmployees(false);
    }
  };


  // ==================================================
  // LOAD HR HOLIDAYS
  // ==================================================

  const loadHolidays = async () => {
    try {

      const response =
        await axios.get(
          `/api/holiday?year=${Number(year)}`
        );

      setHolidays(
        response.data?.holidays || []
      );

    } catch (error) {

      console.error(
        "Holiday loading error:",
        error
      );

      setHolidays([]);
    }
  };


  // ==================================================
  // LOAD APPROVED LEAVES
  // ==================================================

  const loadApprovedLeaves =
    async () => {

      if (!employeeId) {
        setApprovedLeaves([]);
        return;
      }

      try {

        const response =
          await axios.get(
            `/api/employee/leave?employeeId=${employeeId}`
          );

        const allLeaves =
          response.data?.leaves || [];


        const monthStart =
          new Date(
            Number(year),
            Number(month) - 1,
            1
          );

        monthStart.setHours(
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


        const filtered =
          allLeaves
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
                    monthStart
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


        setApprovedLeaves(
          filtered
        );

      } catch (error) {

        console.error(
          "Approved leave loading error:",
          error
        );

        setApprovedLeaves([]);
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

        const response =
          await axios.get(
            `/api/attendance?employeeId=${employeeId}&month=${Number(
              month
            )}&year=${Number(year)}`
          );


        setSavedAttendance(
          response.data?.attendance ||
            []
        );

      } catch (error) {

        console.error(
          "Saved attendance loading error:",
          error
        );

        setSavedAttendance([]);
      }
    };


  // ==================================================
  // LOAD ALL DATA
  // ==================================================

  const loadData = async () => {

    if (!employeeId) {

      setSavedAttendance([]);
      setApprovedLeaves([]);

      return;
    }


    try {

      setLoadingData(true);

      await Promise.all([
        loadSavedAttendance(),
        loadApprovedLeaves(),
      ]);

    } finally {

      setLoadingData(false);
    }
  };


  // ==================================================
  // INITIAL / YEAR LOAD
  // ==================================================

  useEffect(() => {

    loadHolidays();

  }, [year]);


  // ==================================================
  // EMPLOYEE / MONTH / YEAR CHANGE
  // ==================================================

  useEffect(() => {

    setPreviewRows([]);

    loadData();

  }, [
    employeeId,
    month,
    year,
  ]);


  // ==================================================
  // HR HOLIDAY MAP
  // ==================================================

  const holidayMap =
    useMemo(() => {

      const map = {};

      holidays.forEach(
        (holiday) => {

          if (
            !holiday?.date
          ) {
            return;
          }

          /*
            If your Holiday model contains:
            paid: false

            then it should not be treated
            as a paid HR holiday.
          */

          if (
            holiday.paid === false
          ) {
            return;
          }

          map[
            getDateKey(
              holiday.date
            )
          ] = holiday;
        }
      );

      return map;

    }, [
      holidays,
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
  // BIRTHDAY KEY
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
  // IS SECOND / FOURTH SATURDAY
  // ==================================================

  const getSaturdayType =
    (date) => {

      if (
        date.getDay() !== 6
      ) {
        return null;
      }


      /*
        Find which Saturday of the month
        this is.

        Example:

        1st Saturday
        2nd Saturday
        3rd Saturday
        4th Saturday
        5th Saturday
      */

      const occurrence =
        Math.floor(
          (date.getDate() - 1) /
            7
        ) + 1;


      if (
        occurrence === 2
      ) {
        return "2nd Saturday";
      }


      if (
        occurrence === 4
      ) {
        return "4th Saturday";
      }


      if (
        occurrence === 1
      ) {
        return "1st Saturday";
      }


      if (
        occurrence === 3
      ) {
        return "3rd Saturday";
      }


      if (
        occurrence === 5
      ) {
        return "5th Saturday";
      }


      return null;
    };


  // ==================================================
  // ATTENDANCE MAP
  // ==================================================

  const savedAttendanceMap =
    useMemo(() => {

      const map = {};

      savedAttendance.forEach(
        (record) => {

          if (
            !record?.date
          ) {
            return;
          }

          map[
            getDateKey(
              record.date
            )
          ] = record;
        }
      );

      return map;

    }, [
      savedAttendance,
    ]);


  // ==================================================
  // PREVIEW MAP
  // ==================================================

  const previewMap =
    useMemo(() => {

      const map = {};

      previewRows.forEach(
        (record, index) => {

          const date =
            record?.date
              ? new Date(
                  record.date
                )
              : new Date(
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


          map[
            getDateKey(
              date
            )
          ] = {
            ...record,
            date,
          };
        }
      );


      return map;

    }, [
      previewRows,
      year,
      month,
    ]);


  // ==================================================
  // LEAVE MAP
  // ==================================================

  const leaveMap =
    useMemo(() => {

      const map = {};


      for (
        const leave of
          approvedLeaves
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
          new Date(
            start
          );


        while (
          current <= end
        ) {

          const key =
            getDateKey(
              current
            );


          map[key] =
            leave;


          current.setDate(
            current.getDate() + 1
          );
        }
      }


      return map;

    }, [
      approvedLeaves,
    ]);


  // ==================================================
  // PARSE MACHINE DATA
  // ==================================================

  const parseAttendance =
    () => {

      /*
        VERY IMPORTANT:

        Do not trim the beginning.

        This preserves a blank first line.

        Example:

        [blank]
        09:46 15:08
        09:46 19:00

        Day 1 = blank
        Day 2 = 09:46
        Day 3 = 09:46
      */

      const clean =
        String(
          pasteData || ""
        )
          .replace(/\r/g, "")
          .trimEnd();


      const lines =
        clean === ""
          ? []
          : clean.split("\n");


      const rows = [];


      /*
        EXACTLY ONE ROW PER
        CALENDAR DAY
      */

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


        const line =
          lines[day - 1] ??
          "";


        const trimmed =
          line.trim();


        const isSunday =
          date.getDay() === 0;


        const saturdayType =
          getSaturdayType(
            date
          );


        const isSecondSaturday =
          saturdayType ===
          "2nd Saturday";


        const isFourthSaturday =
          saturdayType ===
          "4th Saturday";


        const hrHoliday =
          holidayMap[key];


        const isBirthday =
          birthdayKey ===
          key;


        // =================================================
        // SUNDAY
        // =================================================

        if (
          isSunday
        ) {

          rows.push({

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
        // 2ND SATURDAY
        // =================================================

        if (
          isSecondSaturday
        ) {

          rows.push({

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
              "2nd Saturday",

            holidayName:
              "2nd Saturday",
          });

          continue;
        }


        // =================================================
        // 4TH SATURDAY
        // =================================================

        if (
          isFourthSaturday
        ) {

          rows.push({

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
              "4th Saturday",

            holidayName:
              "4th Saturday",
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
        // EMPLOYEE BIRTHDAY
        // =================================================

        if (
          isBirthday
        ) {

          rows.push({

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
              "Birthday",

            holidayName:
              "Employee Birthday",
          });

          continue;
        }


        // =================================================
        // MACHINE ABSENCE
        // =================================================

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

            workingMinutes: 0,
            workingHours: 0,

            lateMark: false,
            lateMinutes: 0,

            /*
              IMPORTANT:

              Absence stays Absence.

              Leave processing happens later.
            */

            status:
              "Absent",

            holidayType: "",
            holidayName: "",
          });

          continue;
        }


        // =================================================
        // MACHINE TIME
        // =================================================

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


          const inMinutes =
            timeToMinutes(
              inTime
            );

          const outMinutes =
            timeToMinutes(
              outTime
            );


          let workingMinutes =
            0;


          if (
            inMinutes !== null &&
            outMinutes !== null
          ) {

            workingMinutes =
              outMinutes -
              inMinutes;


            if (
              workingMinutes < 0
            ) {
              workingMinutes +=
                24 * 60;
            }
          }


          const late =
            getLateInfo(
              inTime
            );


          rows.push({

            date,

            inTime,

            outTime,

            workingMinutes,

            workingHours:
              Number(
                (
                  workingMinutes /
                  60
                ).toFixed(2)
              ),

            status:
              "Present",

            lateMark:
              late.lateMark,

            lateMinutes:
              late.lateMinutes,

            holidayType: "",
            holidayName: "",
          });

          continue;
        }


        // =================================================
        // BLANK MACHINE ROW
        // =================================================

        /*
          Blank means:

          Not Sunday
          Not 2nd Saturday
          Not 4th Saturday
          Not HR Holiday
          Not Birthday
          No attendance time

          Therefore:

          ABSENT
        */

        rows.push({

          date,

          inTime: "",
          outTime: "",

          workingMinutes: 0,
          workingHours: 0,

          lateMark: false,
          lateMinutes: 0,

          status:
            "Absent",

          holidayType: "",
          holidayName: "",
        });
      }


      return rows;
    };


  // ==================================================
  // TIME TO MINUTES
  // ==================================================

  function timeToMinutes(
    time
  ) {

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
      Number(
        match[1]
      );


    const minutes =
      Number(
        match[2]
      );


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
  }


  // ==================================================
  // LATE
  // ==================================================

  function getLateInfo(
    inTime
  ) {

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
      10:00 = on time
      10:01 = late
    */

    const officeStart =
      10 * 60;


    if (
      inMinutes >
      officeStart
    ) {

      return {

        lateMark: true,

        lateMinutes:
          inMinutes -
          officeStart,
      };
    }


    return {
      lateMark: false,
      lateMinutes: 0,
    };
  }


  // ==================================================
  // PREVIEW
  // ==================================================

  const handlePreview =
    () => {

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
  // FINAL DISPLAY ROWS
  // ==================================================

  const displayRows =
    useMemo(() => {

      /*
        Preview first.

        If there is no preview,
        use saved attendance.
      */

      const source =
        previewRows.length > 0
          ? previewRows
          : savedAttendance;


      const sourceMap = {};


      source.forEach(
        (record, index) => {

          const date =
            record?.date
              ? new Date(
                  record.date
                )
              : new Date(
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


          sourceMap[
            getDateKey(date)
          ] = {

            ...record,

            date,
          };
        }
      );


      const rows = [];


      /*
        This keeps track of the one
        paid CL/SL allowed per month.
      */

      let paidLeaveUsed = 0;


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


        const machine =
          sourceMap[key];


        const isSunday =
          date.getDay() === 0;


        const saturdayType =
          getSaturdayType(
            date
          );


        const isSecondSaturday =
          saturdayType ===
          "2nd Saturday";


        const isFourthSaturday =
          saturdayType ===
          "4th Saturday";


        const hrHoliday =
          holidayMap[key];


        const isBirthday =
          birthdayKey ===
          key;


        const approvedLeave =
          leaveMap[key];


        // =================================================
        // 1. SUNDAY
        // =================================================

        if (
          isSunday
        ) {

          rows.push({

            ...machine,

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

            leaveType: "",
            leaveName: "",
            leavePayment: "",

            payrollStatus:
              "Paid Holiday",
          });


          continue;
        }


        // =================================================
        // 2. 2ND SATURDAY
        // =================================================

        if (
          isSecondSaturday
        ) {

          rows.push({

            ...machine,

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
              "2nd Saturday",

            holidayName:
              "2nd Saturday",

            leaveType: "",
            leaveName: "",
            leavePayment: "",

            payrollStatus:
              "Paid Holiday",
          });


          continue;
        }


        // =================================================
        // 3. 4TH SATURDAY
        // =================================================

        if (
          isFourthSaturday
        ) {

          rows.push({

            ...machine,

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
              "4th Saturday",

            holidayName:
              "4th Saturday",

            leaveType: "",
            leaveName: "",
            leavePayment: "",

            payrollStatus:
              "Paid Holiday",
          });


          continue;
        }


        // =================================================
        // 4. HR HOLIDAY
        // =================================================

        if (
          hrHoliday
        ) {

          rows.push({

            ...machine,

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

            leaveType: "",
            leaveName: "",
            leavePayment: "",

            payrollStatus:
              "Paid Holiday",
          });


          continue;
        }


        // =================================================
        // 5. BIRTHDAY
        // =================================================

        if (
          isBirthday
        ) {

          rows.push({

            ...machine,

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
              "Birthday",

            holidayName:
              "Employee Birthday",

            leaveType: "",
            leaveName: "",
            leavePayment: "",

            payrollStatus:
              "Paid Birthday",
          });


          continue;
        }


        // =================================================
        // 6. PRESENT
        // =================================================

        if (
          machine?.status ===
          "Present"
        ) {

          rows.push({

            ...machine,

            date,

            status:
              "Present",

            payrollStatus:
              "Paid",

            leaveType: "",
            leaveName: "",
            leavePayment: "",
          });


          continue;
        }


        // =================================================
        // 7. ABSENT / BLANK
        // =================================================

        /*
          At this point the date is:

          Not Sunday
          Not 2nd Saturday
          Not 4th Saturday
          Not HR holiday
          Not birthday

          Therefore an absent/blank machine
          row must now check approved leave.
        */

        let leaveType = "";
        let leaveName = "";
        let leavePayment = "";


        let leaveDays =
          1;


        if (
          approvedLeave
        ) {

          leaveType =
            approvedLeave.leaveType;


          leaveDays =
            approvedLeave.duration ===
            "Half Day"
              ? 0.5
              : 1;


          if (
            approvedLeave.leaveType ===
            "CL"
          ) {

            leaveName =
              "Casual Leave";
          }


          if (
            approvedLeave.leaveType ===
            "SL"
          ) {

            leaveName =
              "Sick Leave";
          }


          if (
            approvedLeave.leaveType ===
            "LOP"
          ) {

            leaveName =
              "Loss of Pay";
          }
        }


        // =================================================
        // FIRST CL/SL = PAID
        // =================================================

        if (
          approvedLeave &&
          (
            approvedLeave.leaveType ===
              "CL" ||
            approvedLeave.leaveType ===
              "SL"
          )
        ) {

          if (
            paidLeaveUsed < 1
          ) {

            const available =
              1 -
              paidLeaveUsed;


            const paidDays =
              Math.min(
                leaveDays,
                available
              );


            const extraDays =
              Math.max(
                leaveDays -
                  paidDays,
                0
              );


            paidLeaveUsed +=
              paidDays;


            if (
              extraDays >
              0
            ) {

              /*
                The leave is approved CL/SL,
                but only the first paid day
                is covered.

                Extra = LOP.
              */

              leavePayment =
                "LOP";

            } else {

              leavePayment =
                "Paid";
            }

          } else {

            /*
              Paid leave already used.
            */

            leavePayment =
              "LOP";
          }
        }


        // =================================================
        // DIRECT LOP
        // =================================================

        if (
          approvedLeave?.leaveType ===
          "LOP"
        ) {

          leavePayment =
            "LOP";
        }


        // =================================================
        // NO APPROVED LEAVE
        // =================================================

        if (
          !approvedLeave
        ) {

          leavePayment =
            "Unpaid";
        }


        // =================================================
        // FINAL ABSENCE ROW
        // =================================================

        rows.push({

          ...machine,

          date,

          inTime:
            machine?.inTime ||
            "",

          outTime:
            machine?.outTime ||
            "",

          workingMinutes:
            Number(
              machine?.workingMinutes ||
                0
            ),

          workingHours:
            Number(
              machine?.workingHours ||
                0
            ),

          lateMark:
            machine?.lateMark ===
            true,

          lateMinutes:
            Number(
              machine?.lateMinutes ||
                0
            ),

          status:
            "Absent",

          leaveType,

          leaveName,

          leavePayment,

          payrollStatus:
            leavePayment ===
            "Paid"
              ? "Paid Leave"
              : leavePayment ===
                "LOP"
              ? "LOP"
              : "Unpaid Absence",

          holidayType: "",
          holidayName: "",
        });
      }


      return rows;

    }, [
      previewRows,
      savedAttendance,
      calendarDays,
      year,
      month,
      holidayMap,
      birthdayKey,
      leaveMap,
    ]);


  // ==================================================
  // SUMMARY
  // ==================================================

  const workingDays =
    calendarDays;


  const holidayDays =
    displayRows.filter(
      (row) =>
        row.status ===
        "Holiday"
    ).length;


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


  const paidLeaveDays =
    displayRows.reduce(
      (total, row) => {

        if (
          row.leavePayment ===
          "Paid"
        ) {

          return (
            total +
            (
              row.leaveType
                ? 1
                : 0
            )
          );
        }


        return total;
      },
      0
    );


  const lopDays =
    displayRows.reduce(
      (total, row) => {

        if (
          row.leavePayment ===
          "LOP"
        ) {

          return (
            total +
            1
          );
        }

        return total;
      },
      0
    );


  const unpaidAbsenceDays =
    displayRows.filter(
      (row) =>
        row.payrollStatus ===
        "Unpaid Absence"
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
  // SELECTED MONTH HR HOLIDAYS
  // ==================================================

  const selectedMonthHolidays =
    holidays.filter(
      (holiday) => {

        if (
          !holiday?.date
        ) {
          return false;
        }

        const date =
          new Date(
            holiday.date
          );

        return (
          date.getFullYear() ===
            Number(year) &&
          date.getMonth() + 1 ===
            Number(month)
        );
      }
    );


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


        /*
          Send the complete month.

          Blank machine rows have already
          been converted to Absent.

          Sunday / 2nd / 4th Saturday /
          HR holiday / birthday have already
          been converted to Holiday.
        */

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


        setPreviewRows([]);


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
  // ROW CLASS
  // ==================================================

  const getRowClass =
    (row) => {

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


      return "hover:bg-gray-50";
    };


  // ==================================================
  // RETURN UI
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
          SELECTION
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

                setPreviewRows([]);

              }}
              disabled={
                loadingEmployees
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
            >

              <option value="">
                {
                  loadingEmployees
                    ? "Loading employees..."
                    : "Select Employee"
                }
              </option>


              {
                employees.map(
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
                )
              }

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

                setPreviewRows([]);

              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
            >

              {
                [
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
                )
              }

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

                setPreviewRows([]);

              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          MACHINE DATA
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-bold">
            Paste Machine Attendance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Blank or Absence is checked against holidays,
            birthday and approved leave.
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
10:05    19:00`}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-mono text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />


        <div className="flex flex-wrap gap-3 mt-5">


          <InfoPill
            label="Calendar Days"
            value={
              calendarDays
            }
          />


          <InfoPill
            label="HR Holidays"
            value={
              selectedMonthHolidays.length
            }
          />


          <InfoPill
            label="Approved Leaves"
            value={
              approvedLeaves.length
            }
          />

        </div>


        <div className="flex justify-end mt-5">

          <button
            onClick={
              handlePreview
            }
            disabled={
              !employeeId ||
              loadingData
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >

            {
              loadingData
                ? "Loading..."
                : "Preview Attendance"
            }

          </button>

        </div>

      </div>


      {/* ==================================================
          SUMMARY
      ================================================== */}

      {displayRows.length > 0 && (

        <div className="mb-6">

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">


            <SummaryBox
              label="Working Days"
              value={
                workingDays
              }
            />
            <SummaryBox
              label="holiday Days"
              value={
                holidayDays
              }
            />


            <SummaryBox
              label="Present"
              value={
                presentDays
              }
            />


            <SummaryBox
              label="Absent"
              value={
                absentDays
              }
            />


            <SummaryBox
              label="Paid Leave"
              value={
                paidLeaveDays
              }
            />


            <SummaryBox
              label="LOP"
              value={
                lopDays
              }
            />


            <SummaryBox
              label="Unpaid Absence"
              value={
                unpaidAbsenceDays
              }
            />


            <SummaryBox
              label="Late Marks"
              value={
                lateMarks
              }
            />

          </div>


          <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-sm text-gray-600">

            <strong className="text-gray-900">
              Holidays:
            </strong>{" "}

            {
              holidayDays
            }

            {" • "}

            <strong className="text-gray-900">
              Late Minutes:
            </strong>{" "}

            {
              totalLateMinutes
            }{" "}

            min

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

              <h2 className="text-lg font-bold text-gray-900">
                Attendance & Leave Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {monthName}{" "}
                {year}
              </p>

            </div>


            {previewRows.length > 0 && (

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

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Day
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    In
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Out
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Hours
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Late
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Leave
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Payroll
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">


                {displayRows.map(
                  (row) => {

                    const date =
                      new Date(
                        row.date
                      );


                    return (

                      <tr
                        key={
                          getDateKey(
                            date
                          )
                        }
                        className={
                          getRowClass(
                            row
                          )
                        }
                      >


                        {/* DATE */}

                        <td className="px-4 py-4 text-sm font-semibold whitespace-nowrap">

                          {
                            date.toLocaleDateString(
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

                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">

                          {
                            date.toLocaleDateString(
                              "en-IN",
                              {
                                weekday:
                                  "long",
                              }
                            )
                          }

                        </td>


                        {/* IN */}

                        <td className="px-4 py-4 text-sm">

                          {
                            row.status ===
                            "Holiday"
                              ? "-"
                              : row.inTime ||
                                "-"
                          }

                        </td>


                        {/* OUT */}

                        <td className="px-4 py-4 text-sm">

                          {
                            row.status ===
                            "Holiday"
                              ? "-"
                              : row.outTime ||
                                "-"
                          }

                        </td>


                        {/* HOURS */}

                        <td className="px-4 py-4 text-sm">

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

                        <td className="px-4 py-4">

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


                        {/* LEAVE */}

                        <td className="px-4 py-4">

                          {
                            row.leaveType
                              ? (

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

                              )
                              : (

                                <span className="text-gray-400">
                                  -
                                </span>

                              )
                          }

                        </td>


                        {/* PAYROLL */}

                        <td className="px-4 py-4">

                          {
                            row.payrollStatus ===
                            "Paid Holiday"
                              ? (

                                <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                  Paid Holiday
                                </span>

                              )
                              : row.payrollStatus ===
                                "Paid Birthday"
                              ? (

                                <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                                  Paid Birthday
                                </span>

                              )
                              : row.payrollStatus ===
                                "Paid Leave"
                              ? (

                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  Paid Leave
                                </span>

                              )
                              : row.payrollStatus ===
                                "LOP"
                              ? (

                                <span className="inline-flex rounded-full bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-semibold">
                                  LOP
                                </span>

                              )
                              : row.payrollStatus ===
                                "Unpaid Absence"
                              ? (

                                <span className="inline-flex rounded-full bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
                                  Unpaid Absence
                                </span>

                              )
                              : (

                                <span className="inline-flex rounded-full bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
                                  Paid
                                </span>

                              )
                          }


                          {
                            row.holidayName && (
                              <p className="text-xs text-purple-600 mt-1">
                                {
                                  row.holidayName
                                }
                              </p>
                            )
                          }

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4">

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
// INFO PILL
// ======================================================

function InfoPill({
  label,
  value,
}) {

  return (

    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="font-bold text-gray-800">
        {value}
      </p>

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