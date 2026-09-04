"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Phone,
  Mail,
  LinkIcon,
  RotateCcw,
  CheckCircle2,
  UserRound,
  Search,
  Users,
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [positionFilter, setPositionFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const { search } = useSearch();
  const router = useRouter();

  // ============================================================
  // LOAD CANDIDATES
  // ============================================================

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const { data } = await axios.get(
        "/api/candidates"
      );

      if (data.success) {
        setCandidates(
          data.candidates || []
        );
      }
    } catch (error) {
      console.error(
        "Candidate load error:",
        error
      );
    }
  };

  // ============================================================
  // FILTER OPTIONS
  // ============================================================

  const departments = useMemo(() => {
    return [
      ...new Set(
        candidates
          .map(
            (candidate) =>
              candidate.department
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [candidates]);

  const positions = useMemo(() => {
    return [
      ...new Set(
        candidates
          .map(
            (candidate) =>
              candidate.appliedPosition
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [candidates]);

  const statuses = useMemo(() => {
    return [
      ...new Set(
        candidates
          .map(
            (candidate) =>
              candidate.finalStatus ||
              "New"
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [candidates]);

  // ============================================================
  // FILTER CANDIDATES
  // ============================================================

  const filteredCandidates =
    useMemo(() => {
      const searchText =
        search?.toLowerCase() || "";

      return candidates.filter(
        (candidate) => {
          // -----------------------------
          // SEARCH
          // -----------------------------

          const matchesSearch =
            !searchText ||
            candidate.fullName
              ?.toLowerCase()
              .includes(searchText) ||
            candidate.email
              ?.toLowerCase()
              .includes(searchText) ||
            candidate.mobile
              ?.toLowerCase()
              .includes(searchText) ||
            candidate.appliedPosition
              ?.toLowerCase()
              .includes(searchText);

          // -----------------------------
          // DEPARTMENT
          // -----------------------------

          const matchesDepartment =
            departmentFilter === "All" ||
            candidate.department ===
              departmentFilter;

          // -----------------------------
          // POSITION
          // -----------------------------

          const matchesPosition =
            positionFilter === "All" ||
            candidate.appliedPosition ===
              positionFilter;

          // -----------------------------
          // STATUS
          // -----------------------------

          const candidateStatus =
            candidate.finalStatus ||
            "New";

          const matchesStatus =
            statusFilter === "All" ||
            candidateStatus ===
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
      candidates,
      search,
      departmentFilter,
      positionFilter,
      statusFilter,
    ]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setDepartmentFilter("All");
    setPositionFilter("All");
    setStatusFilter("All");
  };

  // ============================================================
  // EMPLOYEE CHECK
  // ============================================================

  const isConvertedEmployee = (
    candidate
  ) => {
    return (
      candidate?.convertedToEmployee ===
      true
    );
  };

  // ============================================================
  // STATUS LABEL
  // ============================================================

  const getStatusLabel = (
    candidate
  ) => {
    if (
      candidate.finalStatus ===
      "New"
    ) {
      return "In Progress";
    }

    return (
      candidate.finalStatus ||
      "In Progress"
    );
  };

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (
    candidate
  ) => {
    switch (
      candidate.finalStatus
    ) {
      case "Selected":
        return "bg-green-100 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";

      case "On Hold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Joined":
        return "bg-blue-100 text-blue-700 border-blue-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <Link
                href="/dashboard/candidates"
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                <ChevronRight
                  size={19}
                  className="rotate-180 text-gray-600"
                />
              </Link>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Candidates
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage and track all candidates
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadCandidates}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              <RotateCcw
                size={17}
              />
              Refresh
            </button>

            <Link
              href="/dashboard/candidates/share-link"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              <LinkIcon
                size={18}
              />
              Share the Link
            </Link>

          </div>

        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>

              <h2 className="font-semibold text-gray-900">
                Filter Candidates
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Search and filter candidates by
                department, position or status
              </p>

            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <RotateCcw
                size={15}
              />
              Clear Filters
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* SEARCH */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Search
              </label>

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search || ""}
                  readOnly
                  placeholder="Search from dashboard..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />

              </div>

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Department
              </label>

              <div className="relative">

                <Building2
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={
                    departmentFilter
                  }
                  onChange={(e) =>
                    setDepartmentFilter(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Departments
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* POSITION */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Applied Position
              </label>

              <div className="relative">

                <BriefcaseBusiness
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={
                    positionFilter
                  }
                  onChange={(e) =>
                    setPositionFilter(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Positions
                  </option>

                  {positions.map(
                    (position) => (
                      <option
                        key={position}
                        value={position}
                      >
                        {position}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* STATUS */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Status
              </label>

              <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Status
                </option>

                {statuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status ===
                      "New"
                        ? "In Progress"
                        : status}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* ======================================================
            RESULT COUNT
        ====================================================== */}

        <div className="flex items-center justify-between mb-5">

          <div>

            <p className="text-sm text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-900">
                {
                  filteredCandidates.length
                }
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-900">
                {candidates.length}
              </span>

              {" "}candidates

            </p>

          </div>

        </div>

        {/* ======================================================
            CANDIDATE LIST
        ====================================================== */}

        <div className="space-y-5">

          {filteredCandidates.length ===
          0 ? (

            <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">

                <Users
                  size={30}
                  className="text-gray-400"
                />

              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                No candidates found
              </h2>

              <p className="text-gray-400 mt-1">
                Try changing your search
                or filters.
              </p>

            </div>

          ) : (

            filteredCandidates.map(
              (candidate) => {

                const isEmployee =
                  isConvertedEmployee(
                    candidate
                  );

                return (

                  <div
                    key={candidate._id}
                    onClick={() =>
                      router.push(
                        `/dashboard/candidates/${candidate._id}`
                      )
                    }
                    className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                      isEmployee
                        ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300 hover:shadow-md"
                        : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-lg"
                    }`}
                  >

                    {/* ==================================================
                        TOP SECTION
                    ================================================== */}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* LEFT */}

                      <div className="flex gap-4 min-w-0">

                        {/* AVATAR */}

                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
                            isEmployee
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {candidate.fullName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "C"}
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0">

                          {/* NAME */}

                          <div className="flex items-center gap-3 flex-wrap">

                            <h2 className="text-xl font-semibold text-gray-900">
                              {
                                candidate.fullName
                              }
                            </h2>

                            {isEmployee && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                <CheckCircle2
                                  size={13}
                                />
                                EMPLOYEE
                              </span>
                            )}

                          </div>

                          {/* POSITION */}

                          <p className="text-blue-600 font-medium text-sm mt-1">
                            {candidate.appliedPosition ||
                              candidate.previousDesignation ||
                              "Candidate"}
                          </p>

                          {/* DEPARTMENT */}

                          {candidate.department && (
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                              <Building2
                                size={14}
                              />
                              {
                                candidate.department
                              }
                            </p>
                          )}

                          {/* CONTACT */}

                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">

                            {candidate.mobile && (
                              <div className="flex items-center gap-2">
                                <Phone
                                  size={15}
                                />
                                {
                                  candidate.mobile
                                }
                              </div>
                            )}

                            {candidate.email && (
                              <div className="flex items-center gap-2 max-w-[350px]">
                                <Mail
                                  size={15}
                                />
                                <span className="truncate">
                                  {
                                    candidate.email
                                  }
                                </span>
                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className="flex flex-col items-end gap-4">

                        {/* STATUS */}

                        {isEmployee ? (

                          <div className="flex flex-col items-end gap-1">

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-bold">
                              <UserRound
                                size={16}
                              />
                              Employee
                            </span>

                            <span className="text-xs text-emerald-600">
                              Converted from Candidate
                            </span>

                          </div>

                        ) : (

                          <span
                            className={`px-4 py-1.5 rounded-full border text-sm font-medium ${getStatusClass(
                              candidate
                            )}`}
                          >
                            {getStatusLabel(
                              candidate
                            )}
                          </span>

                        )}

                        {/* ACTION */}

                        {isEmployee ? (

                          <Link
                            href={
                              candidate.employeeId
                                ? `/dashboard/employees/${candidate.employeeId}`
                                : "/dashboard/employees"
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                          >
                            <UserRound
                              size={17}
                            />
                            View Employee
                            <ChevronRight
                              size={17}
                            />
                          </Link>

                        ) : (

                          <div>

                            {!candidate
                              .round1
                              ?.communication && (

                              <Link
                                href={`/dashboard/candidates/${candidate._id}`}
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
                              >
                                <Clock3
                                  size={17}
                                />
                                Start Round 1
                              </Link>

                            )}

                            {candidate
                              .round1
                              ?.communication &&
                              !candidate
                                .round2
                                ?.communication && (

                                <Link
                                  href={`/dashboard/candidates/${candidate._id}`}
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
                                >
                                  <Clock3
                                    size={17}
                                  />
                                  Start Round 2
                                </Link>

                              )}

                            {candidate
                              .round2
                              ?.communication &&
                              (candidate.finalStatus ===
                                "New" ||
                                !candidate.finalStatus) && (

                                <Link
                                  href={`/dashboard/candidates/${candidate._id}`}
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition"
                                >
                                  <BriefcaseBusiness
                                    size={17}
                                  />
                                  Final Decision
                                </Link>

                              )}

                          </div>

                        )}

                      </div>

                    </div>

                    {/* ==================================================
                        EMPLOYEE INFORMATION
                    ================================================== */}

                    {isEmployee && (
                      <div className="mt-5 pt-5 border-t border-emerald-200">

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">

                          <div>

                            <span className="text-gray-400">
                              Recruitment Status
                            </span>

                            <p className="font-semibold text-emerald-700 mt-0.5">
                              Successfully Converted
                            </p>

                          </div>

                          {candidate.employeeId && (
                            <div>

                              <span className="text-gray-400">
                                Employee ID
                              </span>

                              <p className="font-semibold text-gray-800 mt-0.5">
                                {
                                  candidate
                                    .employeeId
                                }
                              </p>

                            </div>
                          )}

                          <div>

                            <span className="text-gray-400">
                              Current Stage
                            </span>

                            <p className="font-semibold text-emerald-700 mt-0.5">
                              Employee
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* ==================================================
                        RECRUITMENT PIPELINE
                    ================================================== */}

                    {!isEmployee && (

                      <div className="mt-8">

                        <div className="flex items-center">

                          {/* ROUND 1 */}

                          <div className="flex flex-col items-center w-28">

                            <div
                              className={`w-6 h-6 rounded-full border-4 ${
                                candidate.round1
                                  ?.communication
                                  ? "bg-green-500 border-green-500"
                                  : "bg-white border-gray-300"
                              }`}
                            />

                            <span className="mt-2 text-sm font-medium">
                              Round 1
                            </span>

                            <span className="text-xs text-gray-500">
                              {candidate.round1
                                ?.communication
                                ? "Completed"
                                : "Pending"}
                            </span>

                          </div>

                          {/* LINE */}

                          <div
                            className={`flex-1 h-[2px] ${
                              candidate.round1
                                ?.communication
                                ? "bg-green-400"
                                : "bg-gray-300"
                            }`}
                          />

                          {/* ROUND 2 */}

                          <div className="flex flex-col items-center w-28">

                            <div
                              className={`w-6 h-6 rounded-full border-4 ${
                                candidate.round2
                                  ?.communication
                                  ? "bg-green-500 border-green-500"
                                  : "bg-white border-gray-300"
                              }`}
                            />

                            <span className="mt-2 text-sm font-medium">
                              Round 2
                            </span>

                            <span className="text-xs text-gray-500">
                              {candidate.round2
                                ?.communication
                                ? "Completed"
                                : "Pending"}
                            </span>

                          </div>

                          {/* LINE */}

                          <div
                            className={`flex-1 h-[2px] ${
                              candidate.round2
                                ?.communication
                                ? "bg-green-400"
                                : "bg-gray-300"
                            }`}
                          />

                          {/* FINAL */}

                          <div className="flex flex-col items-center w-36">

                            <div
                              className={`w-6 h-6 rounded-full border-4 ${
                                candidate.finalStatus &&
                                candidate.finalStatus !==
                                  "New"
                                  ? "bg-green-500 border-green-500"
                                  : "bg-white border-gray-300"
                              }`}
                            />

                            <span className="mt-2 text-sm font-medium">
                              Final Decision
                            </span>

                            <span className="text-xs text-gray-500">
                              {candidate.finalStatus &&
                              candidate.finalStatus !==
                                "New"
                                ? candidate.finalStatus
                                : "Pending"}
                            </span>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="mt-7 pt-5 border-t border-gray-100 flex justify-end">

                      <span className="text-sm text-gray-500">
                        {candidate.createdAt
                          ? new Date(
                              candidate.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "-"}
                      </span>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

    </div>
  );
}