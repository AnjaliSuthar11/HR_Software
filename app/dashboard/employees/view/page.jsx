"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  UserPlus,
} from "lucide-react";

export default function EmployeeViewPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [designation, setDesignation] = useState("All");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/employee/list");
console.log("EMPLOYEE API DATA",res.data)
      setEmployees(res.data?.employees || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const designations = useMemo(() => {
    const values = employees
      .map((employee) => employee.designation)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        employee.employeeFullName
          ?.toLowerCase()
          .includes(searchText) ||
        employee.employeeCode
          ?.toLowerCase()
          .includes(searchText) ||
        employee.emailId
          ?.toLowerCase()
          .includes(searchText) ||
        employee.mobileNo
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        employee.employeeStatus === status;

      const matchesDesignation =
        designation === "All" ||
        employee.designation === designation;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDesignation
      );
    });
  }, [employees, search, status, designation]);

  const getDocumentCount = (employee) => {
    const documents = [
      employee.employeePhoto,
      employee.panCardDocument,
      employee.aadharCardDocument,
      employee.highestEducationDocument,
      employee.experienceLetter,
      employee.salarySlip,
    ];

    return documents.filter(Boolean).length;
  };

  const getDocumentStatus = (employee) => {
    const count = getDocumentCount(employee);

    if (count === 6) {
      return {
        text: "Complete",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }

    return {
      text: `${count}/6 Uploaded`,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    };
  };

  const getStatusStyle = (employeeStatus) => {
    switch (employeeStatus) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Inactive":
        return "bg-slate-100 text-slate-600 border-slate-200";

      case "Resigned":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "Terminated":
        return "bg-rose-50 text-rose-700 border-rose-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Employee Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Employees
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all employee records
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/employees"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/employees/add"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Plus size={17} />
              Add Employee
            </Link>
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

            {/* SEARCH */}
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search name, employee code, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>

            {/* DESIGNATION */}
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
            >
              {designations.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Designations"
                    : item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {employees.length}
              </span>{" "}
              employees
            </p>

            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          /* EMPTY */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search size={25} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No Employees Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* EMPLOYEE CARDS */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEmployees.map((employee) => {
              const documentStatus =
                getDocumentStatus(employee);

              return (
                <div
                  key={employee._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* TOP GRADIENT */}
                  <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

                  <div className="p-5">

                    {/* EMPLOYEE HEADER */}
                    <div className="flex items-start gap-4">

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {employee.employeePhoto ? (
                          <Image
                            src={employee.employeePhoto}
                            alt={
                              employee.employeeFullName ||
                              "Employee"
                            }
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-600">
                            {employee.employeeFullName
                              ?.charAt(0)
                              ?.toUpperCase() || "E"}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold text-slate-900">
                          {employee.employeeFullName ||
                            "Unnamed Employee"}
                        </h2>

                        <p className="mt-0.5 truncate text-sm text-slate-500">
                          {employee.designation ||
                            "Designation not assigned"}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          {employee.employeeCode ||
                            "No Employee Code"}
                        </p>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-500">
                          Department
                        </span>

                        <span className="text-right font-semibold text-slate-800">
                          {employee.department ||
                            "Not Assigned"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-500">
                          Email
                        </span>

                        <span className="max-w-[190px] truncate text-right font-medium text-slate-700">
                          {employee.emailId || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-500">
                          Mobile
                        </span>

                        <span className="font-medium text-slate-700">
                          {employee.mobileNo || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            employee.employeeStatus
                          )}`}
                        >
                          {employee.employeeStatus ||
                            "Active"}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${documentStatus.className}`}
                        >
                          {documentStatus.text}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 grid grid-cols-3 gap-2">

                      <Link
                        href={`/dashboard/employees/${employee._id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:shadow-md"
                      >
                        <Eye size={15} />
                        View
                      </Link>

                      <Link
                        href={`/dashboard/employees/${employee._id}/documents`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                      >
                        <FileText size={15} />
                        Docs
                      </Link>

                      <Link
                        href={`/dashboard/employees/${employee._id}/create-login`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <UserPlus size={15} />
                        Login
                      </Link>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}