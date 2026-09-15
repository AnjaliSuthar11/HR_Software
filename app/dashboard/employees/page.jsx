// "use client";

// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { useEffect, useState } from "react";

// export default function Employees() {
//   const [employees, setEmployees] = useState([]);
// const router = useRouter();
//   useEffect(() => {
//     getEmployees();
//   }, []);

//   const getEmployees = async () => {
//     const res = await axios.get("/api/employee/list");
//     setEmployees(res.data.employees);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Employees</h1>

//         <Link
//           href="/dashboard/employees/add"
//           className="bg-black text-white px-5 py-2 rounded-lg"
//         >
//           + Add Employee
//         </Link>
//       </div>

//       <div className="grid gap-5">
//         {employees.map((employee) => {
//           const uploaded =
//             employee.employeePhoto &&
//             employee.panCardDocument &&
//             employee.aadharCardDocument &&
//             employee.highestEducationDocument &&
//             employee.experienceLetter &&
//             employee.salarySlip;

//           return (
//             <div
//               key={employee._id}
//               className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
//             >
//               <div className="flex items-center gap-5">
//                 <div className="w-20 h-20 rounded-full overflow-hidden border">
//                   {employee.employeePhoto ? (
//                     <Image
//                       src={employee.employeePhoto}
//                       alt=""
//                       width={80}
//                       height={80}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                       👤
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-semibold">
//                     {employee.employeeFullName}
//                   </h2>

//                   <p className="text-gray-500">{employee.employeeCode}</p>

//                   <p
//                     className={`font-medium ${
//                       uploaded ? "text-green-600" : "text-red-500"
//                     }`}
//                   >
//                     {uploaded ? "Documents Uploaded" : "Documents Pending"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 {!uploaded ? (
//                   <Link
//                     href={`/dashboard/employees/${employee._id}/documents`}
//                     className="bg-blue-600 text-white px-5 py-2 rounded-lg"
//                   >
//                     Upload Documents
//                   </Link>
//                 ) : (
//                   <Link
//                     href={`/dashboard/employees/${employee._id}/documents`}
//                     className="bg-green-600 text-white px-5 py-2 rounded-lg"
//                   >
//                     View Documents
//                   </Link>
//                 )}

//                 <Link
//                   href={`/dashboard/employees/${employee._id}`}
//                   className="border px-5 py-2 rounded-lg"
//                 >
//                   View
//                 </Link>

//                 <button
//                   onClick={() =>
//                     router.push(
//                       `/dashboard/employees/${employee._id}/create-login`
//                     )
//                   }
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//                 >
//                   Create Login
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }



// 3rd employee with filter and working code
// "use client";

// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { RotateCcw } from "lucide-react";
// import { useSearch } from "@/context/SearchContext";

// export default function Employees() {
//   const [employees, setEmployees] = useState([]);

//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [designationFilter, setDesignationFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");

//   const router = useRouter();
//   const { search } = useSearch();

//   useEffect(() => {
//     getEmployees();
//   }, []);

//   const getEmployees = async () => {
//     try {
//       const res = await axios.get("/api/employee/list");

//       if (res.data.success) {
//         setEmployees(res.data.employees);
//       }
//     } catch (error) {
//       console.error("Failed to load employees:", error);
//     }
//   };

//   // =========================
//   // FILTER OPTIONS
//   // =========================

//   const departments = [
//     ...new Set(
//       employees
//         .map((employee) => employee.department)
//         .filter(Boolean)
//     ),
//   ];

//   const designations = [
//     ...new Set(
//       employees
//         .map((employee) => employee.designation)
//         .filter(Boolean)
//     ),
//   ];

//   const statuses = [
//     ...new Set(
//       employees
//         .map((employee) => employee.employeeStatus)
//         .filter(Boolean)
//     ),
//   ];

//   // =========================
//   // FILTER EMPLOYEES
//   // =========================

//   const filteredEmployees = employees.filter((employee) => {
//     const searchText = search.toLowerCase();

//     const matchesSearch =
//       employee.employeeFullName
//         ?.toLowerCase()
//         .includes(searchText) ||
//       employee.employeeCode
//         ?.toLowerCase()
//         .includes(searchText) ||
//       employee.emailId
//         ?.toLowerCase()
//         .includes(searchText);

//     const matchesDepartment =
//       departmentFilter === "All" ||
//       employee.department === departmentFilter;

//     const matchesDesignation =
//       designationFilter === "All" ||
//       employee.designation === designationFilter;

//     const matchesStatus =
//       statusFilter === "All" ||
//       employee.employeeStatus === statusFilter;

//     return (
//       matchesSearch &&
//       matchesDepartment &&
//       matchesDesignation &&
//       matchesStatus
//     );
//   });

//   // =========================
//   // CLEAR FILTERS
//   // =========================

//   const clearFilters = () => {
//     setDepartmentFilter("All");
//     setDesignationFilter("All");
//     setStatusFilter("All");
//   };

//   return (
//     <div className="max-w-8xl mx-auto p-8">

//       {/* ================= HEADER ================= */}

//       <div className="flex justify-between items-center mb-8">

//         <div>
//           <h1 className="text-3xl font-bold">
//             Employees
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage all employees
//           </p>
//         </div>

//         <Link
//           href="/dashboard/employees/add"
//           className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
//         >
//           + Add Employee
//         </Link>

//       </div>

//       {/* ================= FILTERS ================= */}

//       <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">

//         <div className="flex items-center justify-between mb-4">

//           <div>
//             <h2 className="font-semibold text-gray-800">
//               Filter Employees
//             </h2>

//             <p className="text-sm text-gray-400">
//               Filter by department, designation or status
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={clearFilters}
//             className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
//           >
//             <RotateCcw size={15} />
//             Clear Filters
//           </button>

//         </div>

//         <div className="grid md:grid-cols-3 gap-4">

//           {/* Department */}

//           <div>

//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Department
//             </label>

//             <select
//               value={departmentFilter}
//               onChange={(e) =>
//                 setDepartmentFilter(e.target.value)
//               }
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">
//                 All Departments
//               </option>

//               {departments.map((department) => (
//                 <option
//                   key={department}
//                   value={department}
//                 >
//                   {department}
//                 </option>
//               ))}
//             </select>

//           </div>

//           {/* Designation */}

//           <div>

//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Designation
//             </label>

//             <select
//               value={designationFilter}
//               onChange={(e) =>
//                 setDesignationFilter(e.target.value)
//               }
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">
//                 All Designations
//               </option>

//               {designations.map((designation) => (
//                 <option
//                   key={designation}
//                   value={designation}
//                 >
//                   {designation}
//                 </option>
//               ))}
//             </select>

//           </div>

//           {/* Status */}

//           <div>

//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Employee Status
//             </label>

//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(e.target.value)
//               }
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="All">
//                 All Status
//               </option>

//               {statuses.map((status) => (
//                 <option
//                   key={status}
//                   value={status}
//                 >
//                   {status}
//                 </option>
//               ))}
//             </select>

//           </div>

//         </div>

//       </div>

//       {/* ================= RESULT COUNT ================= */}

//       <div className="mb-5">

//         <p className="text-sm text-gray-500">
//           Showing{" "}
//           <span className="font-semibold text-gray-800">
//             {filteredEmployees.length}
//           </span>{" "}
//           of{" "}
//           <span className="font-semibold text-gray-800">
//             {employees.length}
//           </span>{" "}
//           employees
//         </p>

//       </div>

//       {/* ================= EMPLOYEE LIST ================= */}

//       <div className="grid gap-5">

//         {filteredEmployees.length === 0 ? (

//           <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

//             <div className="text-gray-400 text-4xl mb-3">
//               🔍
//             </div>

//             <h2 className="text-lg font-semibold text-gray-700">
//               No employees found
//             </h2>

//             <p className="text-gray-400 mt-1">
//               Try changing your search or filters.
//             </p>

//           </div>

//         ) : (

//           filteredEmployees.map((employee) => {

//             const uploaded =
//               employee.employeePhoto &&
//               employee.panCardDocument &&
//               employee.aadharCardDocument &&
//               employee.highestEducationDocument &&
//               employee.experienceLetter &&
//               employee.salarySlip;

//             return (
//               <div
//                 key={employee._id}
//                 className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
//               >

//                 {/* ================= LEFT ================= */}

//                 <div className="flex items-center gap-5">

//                   <div className="w-20 h-20 rounded-full overflow-hidden border">

//                     {employee.employeePhoto ? (

//                       <Image
//                         src={employee.employeePhoto}
//                         alt={employee.employeeFullName || "Employee"}
//                         width={80}
//                         height={80}
//                         className="w-full h-full object-cover"
//                       />

//                     ) : (

//                       <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                         👤
//                       </div>

//                     )}

//                   </div>

//                   <div>

//                     <h2 className="text-xl font-semibold">
//                       {employee.employeeFullName}
//                     </h2>

//                     {/* Designation */}

//                     <p className="text-blue-600 font-medium mt-1">
//                       {employee.designation || "Designation not assigned"}
//                     </p>

//                     {/* Department + Employee Code */}

//                     <div className="flex flex-wrap items-center gap-3 mt-1">

//                       <span className="text-gray-500 text-sm">
//                         {employee.department || "Department not assigned"}
//                       </span>

//                       <span className="text-gray-300">
//                         |
//                       </span>

//                       <span className="text-gray-500 text-sm">
//                         {employee.employeeCode}
//                       </span>

//                     </div>

//                     {/* Documents */}

//                     <p
//                       className={`font-medium mt-2 ${
//                         uploaded
//                           ? "text-green-600"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {uploaded
//                         ? "Documents Uploaded"
//                         : "Documents Pending"}
//                     </p>

//                   </div>

//                 </div>

//                 {/* ================= RIGHT ================= */}

//                 <div className="flex gap-3">

//                   {!uploaded ? (

//                     <Link
//                       href={`/dashboard/employees/${employee._id}/documents`}
//                       className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
//                     >
//                       Upload Documents
//                     </Link>

//                   ) : (

//                     <Link
//                       href={`/dashboard/employees/${employee._id}/documents`}
//                       className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
//                     >
//                       View Documents
//                     </Link>

//                   )}

//                   <Link
//                     href={`/dashboard/employees/${employee._id}`}
//                     className="border px-5 py-2 rounded-lg hover:bg-gray-50"
//                   >
//                     View
//                   </Link>

//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/dashboard/employees/${employee._id}/create-login`
//                       )
//                     }
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                   >
//                     Create Login
//                   </button>

//                 </div>

//               </div>
//             );
//           })

//         )}

//       </div>

//     </div>
//   );
// }


// on 15th september trying to design like candiate
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSearch,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

function getStatus(employee) {
  return employee?.employeeStatus || "Active";
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  tone = "blue",
}) {
  const tones = {
    blue: "from-blue-500/10 to-indigo-500/5 text-blue-700 bg-blue-50 border-blue-100",

    violet:
      "from-violet-500/10 to-fuchsia-500/5 text-violet-700 bg-violet-50 border-violet-100",

    amber:
      "from-amber-500/10 to-orange-500/5 text-amber-700 bg-amber-50 border-amber-100",

    green:
      "from-emerald-500/10 to-teal-500/5 text-emerald-700 bg-emerald-50 border-emerald-100",

    rose:
      "from-rose-500/10 to-pink-500/5 text-rose-700 bg-rose-50 border-rose-100",
  };

  const toneClasses = tones[tone] || tones.blue;

  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${toneClasses}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-80">
        Open section

        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  icon: Icon,
  title,
  text,
  tone = "blue",
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${
          tones[tone] || tones.blue
        }`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>

        <p className="mt-0.5 text-sm text-slate-500">{text}</p>
      </div>

      <ChevronRight
        size={18}
        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500"
      />
    </Link>
  );
}

/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({ value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all"
        style={{
          width: `${Math.min(percentage, 100)}%`,
        }}
      />
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function EmployeesDashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD EMPLOYEES
  ======================================================= */

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/employee/list");

      if (data?.success) {
        setEmployees(
          Array.isArray(data.employees)
            ? data.employees
            : []
        );
      } else {
        setError(
          data?.message || "Unable to load employees"
        );
      }
    } catch (err) {
      console.error("Employee dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load employee dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EMPLOYEE STATS
  ======================================================= */

  const stats = useMemo(() => {
    const today = new Date();

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    let active = 0;
    let inactive = 0;
    let resigned = 0;
    let terminated = 0;

    let documentsComplete = 0;
    let documentsPending = 0;

    let monthEmployees = 0;

    employees.forEach((employee) => {
      const status = getStatus(employee);

      /* STATUS */

      if (status === "Active") {
        active++;
      }

      if (status === "Inactive") {
        inactive++;
      }

      if (status === "Resigned") {
        resigned++;
      }

      if (status === "Terminated") {
        terminated++;
      }

      /* DOCUMENTS */

      const documents = [
        employee?.employeePhoto,
        employee?.panCardDocument,
        employee?.aadharCardDocument,
        employee?.highestEducationDocument,
        employee?.experienceLetter,
        employee?.salarySlip,
      ];

      const completedDocuments =
        documents.filter(Boolean).length;

      if (completedDocuments === documents.length) {
        documentsComplete++;
      } else {
        documentsPending++;
      }

      /* JOINING THIS MONTH */

      const joiningDate = employee?.joiningDate
        ? new Date(employee.joiningDate)
        : null;

      if (
        joiningDate &&
        !Number.isNaN(joiningDate.getTime()) &&
        joiningDate >= startOfMonth
      ) {
        monthEmployees++;
      }
    });

    return {
      total: employees.length,

      active,
      inactive,
      resigned,
      terminated,

      documentsComplete,
      documentsPending,

      monthEmployees,
    };
  }, [employees]);

  /* =======================================================
     MONTHLY JOINING TREND
  ======================================================= */

  const monthlyTrend = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (5 - index),
        1
      );

      const nextMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      );

      const count = employees.filter((employee) => {
        const joiningDate = employee?.joiningDate
          ? new Date(employee.joiningDate)
          : null;

        return (
          joiningDate &&
          !Number.isNaN(joiningDate.getTime()) &&
          joiningDate >= date &&
          joiningDate < nextMonth
        );
      }).length;

      return {
        key: getMonthKey(date),

        label: date.toLocaleString("en-IN", {
          month: "short",
        }),

        count,
      };
    });
  }, [employees]);

  const maxMonthly = Math.max(
    ...monthlyTrend.map((item) => item.count),
    1
  );

  /* =======================================================
     STATUS DATA
  ======================================================= */

  const statusData = useMemo(() => {
    return [
      {
        label: "Active",
        value: stats.active,
        icon: UserCheck,
        className: "text-emerald-700 bg-emerald-50",
      },

      {
        label: "Inactive",
        value: stats.inactive,
        icon: Clock3,
        className: "text-blue-700 bg-blue-50",
      },

      {
        label: "Resigned",
        value: stats.resigned,
        icon: UserX,
        className: "text-amber-700 bg-amber-50",
      },

      {
        label: "Terminated",
        value: stats.terminated,
        icon: UserX,
        className: "text-rose-700 bg-rose-50",
      },
    ];
  }, [stats]);

  /* =======================================================
     DEPARTMENT / DESIGNATION PIPELINE
  ======================================================= */

  const departmentData = useMemo(() => {
    const map = new Map();

    employees.forEach((employee) => {
      const department =
        employee?.department ||
        employee?.designation ||
        "Department Not Assigned";

      const existing = map.get(department) || {
        department,
        total: 0,
        active: 0,
        inactive: 0,
        resigned: 0,
        terminated: 0,
      };

      existing.total++;

      if (getStatus(employee) === "Active") {
        existing.active++;
      }

      if (getStatus(employee) === "Inactive") {
        existing.inactive++;
      }

      if (getStatus(employee) === "Resigned") {
        existing.resigned++;
      }

      if (getStatus(employee) === "Terminated") {
        existing.terminated++;
      }

      map.set(department, existing);
    });

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [employees]);

  /* =======================================================
     RECENT EMPLOYEES
  ======================================================= */

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => {
        const dateA = new Date(
          a?.joiningDate || a?.createdAt || 0
        );

        const dateB = new Date(
          b?.joiningDate || b?.createdAt || 0
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [employees]);

  /* =======================================================
     CURRENT MONTH
  ======================================================= */

  const currentMonthLabel = new Date().toLocaleString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  /* =======================================================
     DOCUMENT PERCENTAGE
  ======================================================= */

  const documentPercentage =
    stats.total > 0
      ? Math.round(
          (stats.documentsComplete / stats.total) * 100
        )
      : 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-5 md:p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles size={14} />

            Workforce Overview
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Employee Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Manage employees, records, documents and workforce
            activity from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/dashboard/employees/view"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <Users size={18} />

            View Employees
          </Link>

          <Link
            href="/dashboard/employees/add"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
          >
            <UserPlus size={18} />

            Add Employee
          </Link>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* ======================================================
          TOP STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Employees"
          value={loading ? "—" : stats.total}
          subtitle={`${stats.monthEmployees} joined this month`}
          icon={Users}
          href="/dashboard/employees"
          tone="blue"
        />

        <StatCard
          title="Active Employees"
          value={loading ? "—" : stats.active}
          subtitle="Currently working employees"
          icon={UserCheck}
          href="/dashboard/employees"
          tone="green"
        />

        <StatCard
          title="Employee Records"
          value={loading ? "—" : stats.total}
          subtitle={`${stats.inactive} inactive records`}
          icon={BriefcaseBusiness}
          href="/dashboard/employees"
          tone="violet"
        />

        <StatCard
          title="Documents Pending"
          value={loading ? "—" : stats.documentsPending}
          subtitle="Employees with incomplete documents"
          icon={FileSearch}
          href="/dashboard/employees"
          tone="amber"
        />

        <StatCard
          title="Documents Complete"
          value={loading ? "—" : stats.documentsComplete}
          subtitle={`${documentPercentage}% records complete`}
          icon={CheckCircle2}
          href="/dashboard/employees"
          tone="green"
        />

        <StatCard
          title="Separated Employees"
          value={
            loading
              ? "—"
              : stats.resigned + stats.terminated
          }
          subtitle={`${stats.resigned} resigned • ${stats.terminated} terminated`}
          icon={UserX}
          href="/dashboard/employees"
          tone="rose"
        />
      </div>

      {/* ======================================================
          MAIN GRID
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">

        {/* ====================================================
            JOINING ACTIVITY
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Joining Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee joining activity over the last 6 months
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Current Month
              </p>

              <p className="text-sm font-semibold text-slate-700">
                {currentMonthLabel}
              </p>
            </div>
          </div>

          <div className="mt-7 flex h-64 items-end gap-3 sm:gap-5">

            {monthlyTrend.map((item) => {
              const height = Math.max(
                (item.count / maxMonthly) * 100,
                item.count ? 10 : 3
              );

              return (
                <div
                  key={item.key}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-xs font-semibold text-slate-600">
                    {item.count}
                  </div>

                  <div className="flex h-48 items-end rounded-xl bg-slate-50 p-1">

                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-700"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.count} employees in ${item.label}`}
                    />
                  </div>

                  <p className="mt-2 text-center text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            EMPLOYEE STATUS
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Employee Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current workforce distribution
            </p>
          </div>

          <div className="mt-6 space-y-5">

            {statusData.map((item) => {
              const percentage = stats.total
                ? Math.round(
                    (item.value / stats.total) * 100
                  )
                : 0;

              const Icon = item.icon;

              return (
                <div key={item.label}>

                  <div className="mb-2 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2.5">

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.className}`}
                      >
                        <Icon size={16} />
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">

                    <ProgressBar
                      value={item.value}
                      total={stats.total}
                    />

                    <span className="w-10 text-right text-xs font-medium text-slate-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ======================================================
          QUICK ACTIONS + DEPARTMENT
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.65fr]">

        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jump directly to common employee tasks
            </p>
          </div>

          <div className="mt-5 space-y-3">

            <QuickAction
              href="/dashboard/employees/view"
              icon={Users}
              title="View Employees"
              text="Search, filter and manage employee records"
              tone="blue"
            />

            <QuickAction
              href="/dashboard/employees/add"
              icon={UserPlus}
              title="Add Employee"
              text="Create a new employee profile"
              tone="indigo"
            />

            <QuickAction
              href="/dashboard/employees/view"
              icon={FileText}
              title="Employee Documents"
              text={`${stats.documentsPending} employee records need documents`}
              tone="amber"
            />

            <QuickAction
              href="/dashboard/attendance"
              icon={CalendarDays}
              title="Attendance"
              text="Manage employee attendance and records"
              tone="green"
            />
          </div>
        </section>

        {/* ====================================================
            DEPARTMENT / WORKFORCE
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Workforce Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee distribution by department or designation
              </p>
            </div>

            <BriefcaseBusiness
              size={20}
              className="text-slate-300"
            />
          </div>

          <div className="mt-5 overflow-x-auto">

            {departmentData.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                No workforce data available.
              </div>
            ) : (
              <table className="w-full min-w-[650px] text-sm">

                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">

                    <th className="pb-3 pr-4 font-semibold">
                      Department
                    </th>

                    <th className="pb-3 pr-4 font-semibold">
                      Employees
                    </th>

                    <th className="pb-3 pr-4 font-semibold">
                      Active
                    </th>

                    <th className="pb-3 pr-4 font-semibold">
                      Inactive
                    </th>

                    <th className="pb-3 pr-4 font-semibold">
                      Separated
                    </th>

                    <th className="pb-3 text-right font-semibold">
                      Workforce
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {departmentData.map((department) => (
                    <tr
                      key={department.department}
                      className="border-b border-slate-50 last:border-0"
                    >

                      <td className="py-4 pr-4 font-semibold text-slate-800">
                        {department.department}
                      </td>

                      <td className="py-4 pr-4 font-medium text-slate-600">
                        {department.total}
                      </td>

                      <td className="py-4 pr-4">

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {department.active}
                        </span>

                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {department.inactive}
                      </td>

                      <td className="py-4 pr-4">

                        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          {department.resigned +
                            department.terminated}
                        </span>

                      </td>

                      <td className="py-4 pl-4 text-right">

                        <div className="inline-flex w-28 flex-col gap-1.5 align-middle">

                          <ProgressBar
                            value={department.active}
                            total={department.total}
                          />

                          <span className="text-[11px] text-slate-400">
                            {department.total > 0
                              ? Math.round(
                                  (department.active /
                                    department.total) *
                                    100
                                )
                              : 0}
                            % active
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* ======================================================
          RECENT EMPLOYEES
      ====================================================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Employees
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest employees added to the workforce
            </p>
          </div>

          <Link
            href="/dashboard/employees"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all

            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-5">

          {recentEmployees.length === 0 ? (
            <div className="lg:col-span-5 rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
              No employees available.
            </div>
          ) : (
            recentEmployees.map((employee) => {

              const status = getStatus(employee);

              const statusClass =
                status === "Active"
                  ? "bg-emerald-50 text-emerald-700"
                  : status === "Inactive"
                  ? "bg-slate-100 text-slate-600"
                  : status === "Resigned"
                  ? "bg-amber-50 text-amber-700"
                  : status === "Terminated"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-600";

              return (
                <Link
                  key={employee._id}
                  href={`/dashboard/employees/${employee._id}`}
                  className="group rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-white hover:shadow-md"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white">

                      {employee?.employeePhoto ? (
                        <img
                          src={employee.employeePhoto}
                          alt={
                            employee?.employeeFullName ||
                            "Employee"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        employee?.employeeFullName
                          ?.charAt(0)
                          ?.toUpperCase() || "E"
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-semibold text-slate-900">
                        {employee?.employeeFullName ||
                          "Unnamed Employee"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {employee?.designation ||
                          employee?.department ||
                          "Designation not assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                    >
                      {status}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {formatDate(employee?.joiningDate)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">

                    <span>
                      {employee?.employeeCode ||
                        "No employee code"}
                    </span>

                    <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      Open

                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* ======================================================
          MONTH SUMMARY
      ====================================================== */}

      <section className="mt-6 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            This Month
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.monthEmployees}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            new employees
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Active Workforce
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.active}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            currently active
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Documents
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {documentPercentage}%
          </p>

          <p className="mt-1 text-sm text-slate-500">
            employee records complete
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Workforce
          </p>

          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">

            {stats.total}

            <TrendingUp
              size={19}
              className="text-emerald-500"
            />
          </p>

          <p className="mt-1 text-sm text-slate-500">
            total employees
          </p>
        </div>
      </section>

      {/* ======================================================
          DOCUMENT SUMMARY
      ====================================================== */}

      {stats.documentsPending > 0 && (
        <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Employee documents need attention
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {stats.documentsPending} employee
                  {stats.documentsPending !== 1
                    ? "s"
                    : ""}{" "}
                  currently have incomplete document records.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/employees"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Review Documents

              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}