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



// 3rd employee with filter
"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const router = useRouter();
  const { search } = useSearch();

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/list");

      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  // =========================
  // FILTER OPTIONS
  // =========================

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const designations = [
    ...new Set(
      employees
        .map((employee) => employee.designation)
        .filter(Boolean)
    ),
  ];

  const statuses = [
    ...new Set(
      employees
        .map((employee) => employee.employeeStatus)
        .filter(Boolean)
    ),
  ];

  // =========================
  // FILTER EMPLOYEES
  // =========================

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.employeeFullName
        ?.toLowerCase()
        .includes(searchText) ||
      employee.employeeCode
        ?.toLowerCase()
        .includes(searchText) ||
      employee.emailId
        ?.toLowerCase()
        .includes(searchText);

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    const matchesDesignation =
      designationFilter === "All" ||
      employee.designation === designationFilter;

    const matchesStatus =
      statusFilter === "All" ||
      employee.employeeStatus === statusFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesDesignation &&
      matchesStatus
    );
  });

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setDepartmentFilter("All");
    setDesignationFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="max-w-8xl mx-auto p-8">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Employees
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all employees
          </p>
        </div>

        <Link
          href="/dashboard/employees/add"
          className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
        >
          + Add Employee
        </Link>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="font-semibold text-gray-800">
              Filter Employees
            </h2>

            <p className="text-sm text-gray-400">
              Filter by department, designation or status
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <RotateCcw size={15} />
            Clear Filters
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {/* Department */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Department
            </label>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

          {/* Designation */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Designation
            </label>

            <select
              value={designationFilter}
              onChange={(e) =>
                setDesignationFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Designations
              </option>

              {designations.map((designation) => (
                <option
                  key={designation}
                  value={designation}
                >
                  {designation}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Employee Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* ================= RESULT COUNT ================= */}

      <div className="mb-5">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredEmployees.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {employees.length}
          </span>{" "}
          employees
        </p>

      </div>

      {/* ================= EMPLOYEE LIST ================= */}

      <div className="grid gap-5">

        {filteredEmployees.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-gray-400 text-4xl mb-3">
              🔍
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              No employees found
            </h2>

            <p className="text-gray-400 mt-1">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          filteredEmployees.map((employee) => {

            const uploaded =
              employee.employeePhoto &&
              employee.panCardDocument &&
              employee.aadharCardDocument &&
              employee.highestEducationDocument &&
              employee.experienceLetter &&
              employee.salarySlip;

            return (
              <div
                key={employee._id}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
              >

                {/* ================= LEFT ================= */}

                <div className="flex items-center gap-5">

                  <div className="w-20 h-20 rounded-full overflow-hidden border">

                    {employee.employeePhoto ? (

                      <Image
                        src={employee.employeePhoto}
                        alt={employee.employeeFullName || "Employee"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        👤
                      </div>

                    )}

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      {employee.employeeFullName}
                    </h2>

                    {/* Designation */}

                    <p className="text-blue-600 font-medium mt-1">
                      {employee.designation || "Designation not assigned"}
                    </p>

                    {/* Department + Employee Code */}

                    <div className="flex flex-wrap items-center gap-3 mt-1">

                      <span className="text-gray-500 text-sm">
                        {employee.department || "Department not assigned"}
                      </span>

                      <span className="text-gray-300">
                        |
                      </span>

                      <span className="text-gray-500 text-sm">
                        {employee.employeeCode}
                      </span>

                    </div>

                    {/* Documents */}

                    <p
                      className={`font-medium mt-2 ${
                        uploaded
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {uploaded
                        ? "Documents Uploaded"
                        : "Documents Pending"}
                    </p>

                  </div>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="flex gap-3">

                  {!uploaded ? (

                    <Link
                      href={`/dashboard/employees/${employee._id}/documents`}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Upload Documents
                    </Link>

                  ) : (

                    <Link
                      href={`/dashboard/employees/${employee._id}/documents`}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                    >
                      View Documents
                    </Link>

                  )}

                  <Link
                    href={`/dashboard/employees/${employee._id}`}
                    className="border px-5 py-2 rounded-lg hover:bg-gray-50"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/employees/${employee._id}/create-login`
                      )
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Login
                  </button>

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}