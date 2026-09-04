"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  RotateCcw,
  Search,
  UserRound,
  Users,
  Phone,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

function getStatus(candidate) {
  return candidate?.finalStatus || "Selected";
}

function getStatusClass(status) {
  switch (status) {
    case "Joined":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Selected":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "On Hold":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function ConvertedCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { search } = useSearch();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/candidates");

      if (data?.success) {
        setCandidates(
          Array.isArray(data.candidates)
            ? data.candidates
            : []
        );
      } else {
        setError(
          data?.message ||
            "Unable to load converted employees"
        );
      }
    } catch (err) {
      console.error(
        "Converted employees error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load converted employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const convertedCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate?.convertedToEmployee === true
    );
  }, [candidates]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        convertedCandidates
          .map((candidate) => candidate?.department)
          .filter(Boolean)
      ),
    ].sort();
  }, [convertedCandidates]);

  const positions = useMemo(() => {
    return [
      ...new Set(
        convertedCandidates
          .map(
            (candidate) =>
              candidate?.appliedPosition
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [convertedCandidates]);

  const statuses = useMemo(() => {
    return [
      ...new Set(
        convertedCandidates.map((candidate) =>
          getStatus(candidate)
        )
      ),
    ].sort();
  }, [convertedCandidates]);

  const filteredCandidates = useMemo(() => {
    const searchText =
      search?.trim().toLowerCase() || "";

    return convertedCandidates.filter(
      (candidate) => {
        const matchesSearch =
          !searchText ||
          candidate?.fullName
            ?.toLowerCase()
            .includes(searchText) ||
          candidate?.email
            ?.toLowerCase()
            .includes(searchText) ||
          candidate?.mobile
            ?.toLowerCase()
            .includes(searchText) ||
          candidate?.appliedPosition
            ?.toLowerCase()
            .includes(searchText);

        const matchesDepartment =
          departmentFilter === "All" ||
          candidate?.department ===
            departmentFilter;

        const matchesPosition =
          positionFilter === "All" ||
          candidate?.appliedPosition ===
            positionFilter;

        const matchesStatus =
          statusFilter === "All" ||
          getStatus(candidate) ===
            statusFilter;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesPosition &&
          matchesStatus
        );
      }
    );
  }, [
    convertedCandidates,
    search,
    departmentFilter,
    positionFilter,
    statusFilter,
  ]);

  const clearFilters = () => {
    setDepartmentFilter("All");
    setPositionFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/candidates"
              className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Converted Employees
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={13} />
                  {convertedCandidates.length} Converted
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500 md:text-base">
                Candidates who completed recruitment and were converted into employees.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadCandidates}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Refresh
            </button>

            <Link
              href="/dashboard/employees"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <UserRound size={17} />
              Employees
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Total Converted
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {convertedCandidates.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                <UserRound size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Visible Results
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredCandidates.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Employee Records
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Conversion history retained
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Candidate records remain available for recruitment history.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Filter Converted Employees
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Find converted candidates by department, position or final status.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Search
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search || ""}
                  readOnly
                  placeholder="Search from dashboard..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Department
              </label>
              <div className="relative">
                <Building2
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Applied Position
              </label>
              <div className="relative">
                <BriefcaseBusiness
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={positionFilter}
                  onChange={(e) =>
                    setPositionFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="All">
                    All Positions
                  </option>
                  {positions.map((position) => (
                    <option
                      key={position}
                      value={position}
                    >
                      {position}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Final Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="All">All Status</option>
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
        </section>

        {/* RESULTS */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Employee Conversion History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredCandidates.length} of {convertedCandidates.length} converted records
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
              />
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <UserRound
                size={30}
                className="text-slate-400"
              />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              No converted employees found
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => {
              const status = getStatus(candidate);

              return (
                <div
                  key={candidate._id}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm transition hover:border-emerald-300 hover:bg-white hover:shadow-md md:p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                        {candidate?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "E"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900">
                            {candidate?.fullName ||
                              "Unnamed Candidate"}
                          </h3>

                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 size={13} />
                            EMPLOYEE
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-semibold text-blue-600">
                          {candidate?.appliedPosition ||
                            "Position not assigned"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          {candidate?.department && (
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 size={14} />
                              {candidate.department}
                            </span>
                          )}

                          {candidate?.mobile && (
                            <span className="inline-flex items-center gap-1.5">
                              <Phone size={14} />
                              {candidate.mobile}
                            </span>
                          )}

                          {candidate?.email && (
                            <span className="inline-flex max-w-[320px] items-center gap-1.5 truncate">
                              <Mail size={14} />
                              <span className="truncate">
                                {candidate.email}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          Employee ID
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {candidate?.employeeId ||
                            "Linked Employee"}
                        </p>
                      </div>

                      <Link
                        href={
                          candidate?.employeeId
                            ? `/dashboard/employees/${candidate.employeeId}`
                            : "/dashboard/employees"
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <UserRound size={16} />
                        View Employee
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-emerald-200 pt-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Recruitment
                        </p>
                        <p className="mt-1 font-semibold text-emerald-700">
                          Completed
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Round 1 / Round 2
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          ✓ Completed / ✓ Completed
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Converted On
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {candidate?.updatedAt
                            ? new Date(
                                candidate.updatedAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : candidate?.createdAt
                            ? new Date(
                                candidate.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </p>
                      </div>
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
