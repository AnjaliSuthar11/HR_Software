"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  Phone,
  Search,
  UserRound,
  Users,
  XCircle,
  BriefcaseBusiness,
  Building2,
  RotateCcw,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function InterviewQueuePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [positionFilter, setPositionFilter] =
    useState("All");

  const [stageFilter, setStageFilter] =
    useState("All");

  const { search } = useSearch();

  // ============================================================
  // LOAD CANDIDATES
  // ============================================================

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "/api/candidates"
      );

      if (data.success) {
        setCandidates(data.candidates || []);
      }
    } catch (error) {
      console.error(
        "Error loading candidates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getStage = (candidate) => {
    /*
      NEW CANDIDATE
      Round 1 pending
    */

    if (
      !candidate.round1?.communication
    ) {
      return "Round 1 Pending";
    }

    /*
      ROUND 1 COMPLETED
      Round 2 pending
    */

    if (
      candidate.round1?.communication &&
      !candidate.round2?.communication
    ) {
      return "Round 2 Pending";
    }

    /*
      BOTH ROUNDS COMPLETED
      Final decision pending

      Candidates with an actual final
      decision are excluded from queue.
    */

    if (
      candidate.round1?.communication &&
      candidate.round2?.communication &&
      (!candidate.finalStatus ||
        candidate.finalStatus === "New")
    ) {
      return "Final Decision";
    }

    return "Completed";
  };

  const isInInterviewQueue = (candidate) => {
    const finalStatus =
      candidate.finalStatus;

    /*
      Once HR has made the final decision,
      candidate leaves the interview queue.
    */

    const hasFinalDecision =
      finalStatus &&
      finalStatus !== "New";

    return !hasFinalDecision;
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

  // ============================================================
  // FILTER CANDIDATES
  // ============================================================

  const queueCandidates = useMemo(() => {
    const searchText =
      search?.toLowerCase() || "";

    return candidates.filter(
      (candidate) => {
        /*
          Only active interview candidates
        */

        if (
          !isInInterviewQueue(
            candidate
          )
        ) {
          return false;
        }

        /*
          SEARCH
        */

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

        /*
          DEPARTMENT
        */

        const matchesDepartment =
          departmentFilter === "All" ||
          candidate.department ===
            departmentFilter;

        /*
          POSITION
        */

        const matchesPosition =
          positionFilter === "All" ||
          candidate.appliedPosition ===
            positionFilter;

        /*
          STAGE
        */

        const candidateStage =
          getStage(candidate);

        const matchesStage =
          stageFilter === "All" ||
          candidateStage === stageFilter;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesPosition &&
          matchesStage
        );
      }
    );
  }, [
    candidates,
    search,
    departmentFilter,
    positionFilter,
    stageFilter,
  ]);

  // ============================================================
  // STATS
  // ============================================================

  const round1Pending = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        isInInterviewQueue(candidate) &&
        !candidate.round1?.communication
    ).length;
  }, [candidates]);

  const round2Pending = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        isInInterviewQueue(candidate) &&
        candidate.round1?.communication &&
        !candidate.round2?.communication
    ).length;
  }, [candidates]);

  const finalDecisionPending = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        isInInterviewQueue(candidate) &&
        candidate.round1?.communication &&
        candidate.round2?.communication
    ).length;
  }, [candidates]);

  const totalQueue =
    round1Pending +
    round2Pending +
    finalDecisionPending;

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setDepartmentFilter("All");
    setPositionFilter("All");
    setStageFilter("All");
  };

  // ============================================================
  // STAGE COLORS
  // ============================================================

  const getStageConfig = (stage) => {
    switch (stage) {
      case "Round 1 Pending":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
          icon: <Clock3 size={18} />,
        };

      case "Round 2 Pending":
        return {
          bg: "bg-indigo-50",
          border: "border-indigo-200",
          text: "text-indigo-700",
          badge: "bg-indigo-100 text-indigo-700",
          icon: <Clock3 size={18} />,
        };

      case "Final Decision":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          badge: "bg-amber-100 text-amber-700",
          icon: <CheckCircle2 size={18} />,
        };

      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
          icon: <Users size={18} />,
        };
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-xl w-80" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="h-32 bg-gray-200 rounded-2xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
            </div>

            <div className="h-40 bg-gray-200 rounded-2xl" />

            <div className="h-72 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div className="flex items-start gap-4">

            <Link
              href="/dashboard/candidates"
              className="mt-1 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600"
              />
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Interview Queue
                </h1>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  {totalQueue} Active
                </span>
              </div>

              <p className="text-gray-500 mt-1">
                Manage candidates waiting for
                Round 1, Round 2 and final decision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadCandidates}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              <RotateCcw size={17} />
              Refresh
            </button>

            <Link
              href="/dashboard/candidates/view"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            >
              <Users size={18} />
              All Candidates
            </Link>

          </div>
        </div>

        {/* =====================================================
            OVERVIEW CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* ROUND 1 */}

          <button
            onClick={() =>
              setStageFilter(
                stageFilter ===
                  "Round 1 Pending"
                  ? "All"
                  : "Round 1 Pending"
              )
            }
            className={`text-left bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
              stageFilter ===
              "Round 1 Pending"
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Round 1 Pending
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {round1Pending}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  New candidates ready for interview
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock3 size={23} />
              </div>

            </div>
          </button>

          {/* ROUND 2 */}

          <button
            onClick={() =>
              setStageFilter(
                stageFilter ===
                  "Round 2 Pending"
                  ? "All"
                  : "Round 2 Pending"
              )
            }
            className={`text-left bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
              stageFilter ===
              "Round 2 Pending"
                ? "border-indigo-500 ring-2 ring-indigo-100"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Round 2 Pending
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {round2Pending}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Candidates who completed Round 1
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <CheckCircle2 size={23} />
              </div>

            </div>
          </button>

          {/* FINAL DECISION */}

          <button
            onClick={() =>
              setStageFilter(
                stageFilter ===
                  "Final Decision"
                  ? "All"
                  : "Final Decision"
              )
            }
            className={`text-left bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
              stageFilter ===
              "Final Decision"
                ? "border-amber-500 ring-2 ring-amber-100"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Final Decision
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {finalDecisionPending}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Both interview rounds completed
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <BriefcaseBusiness
                  size={23}
                />
              </div>

            </div>
          </button>

        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>
              <h2 className="font-semibold text-gray-900">
                Interview Filters
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Find candidates by department,
                position or interview stage
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* SEARCH */}

            <div className="md:col-span-1">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Search
              </label>

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search || ""}
                  readOnly
                  placeholder="Use dashboard search..."
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 bg-gray-50 outline-none"
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
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={positionFilter}
                  onChange={(e) =>
                    setPositionFilter(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* STAGE */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Interview Stage
              </label>

              <select
                value={stageFilter}
                onChange={(e) =>
                  setStageFilter(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Stages
                </option>

                <option value="Round 1 Pending">
                  Round 1 Pending
                </option>

                <option value="Round 2 Pending">
                  Round 2 Pending
                </option>

                <option value="Final Decision">
                  Final Decision
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* =====================================================
            RESULT HEADER
        ===================================================== */}

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Interview Candidates
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {queueCandidates.length}
              </span>{" "}
              active candidates
            </p>
          </div>

        </div>

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {queueCandidates.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <Users
                size={30}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No candidates found
            </h2>

            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              There are no candidates matching
              the selected interview stage,
              department or position.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {queueCandidates.map(
              (candidate) => {

                const stage =
                  getStage(candidate);

                const config =
                  getStageConfig(stage);

                return (
                  <Link
                    key={candidate._id}
                    href={`/dashboard/candidates/${candidate._id}`}
                    className="block"
                  >

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        {/* =================================================
                            LEFT
                        ================================================= */}

                        <div className="flex gap-4 min-w-0">

                          {/* AVATAR */}

                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                            {candidate.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          {/* INFO */}

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="text-lg font-bold text-gray-900">
                                {candidate.fullName}
                              </h3>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}
                              >
                                {stage}
                              </span>

                            </div>

                            <p className="text-blue-600 font-medium text-sm mt-1">
                              {candidate.appliedPosition ||
                                "Position not specified"}
                            </p>

                            {candidate.department && (
                              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                                <Building2
                                  size={14}
                                />
                                {candidate.department}
                              </p>
                            )}

                            {/* CONTACT */}

                            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-500">

                              {candidate.mobile && (
                                <div className="flex items-center gap-1.5">
                                  <Phone
                                    size={14}
                                  />
                                  {candidate.mobile}
                                </div>
                              )}

                              {candidate.email && (
                                <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                                  <Mail
                                    size={14}
                                  />
                                  <span className="truncate">
                                    {candidate.email}
                                  </span>
                                </div>
                              )}

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            PIPELINE
                        ================================================= */}

                        <div className="flex-1 max-w-xl mx-0 lg:mx-8">

                          <div className="flex items-center">

                            {/* ROUND 1 */}

                            <div className="flex flex-col items-center min-w-[90px]">

                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                  candidate.round1
                                    ?.communication
                                    ? "bg-green-100 text-green-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {candidate.round1
                                  ?.communication ? (
                                  <CheckCircle2
                                    size={19}
                                  />
                                ) : (
                                  <Clock3
                                    size={19}
                                  />
                                )}
                              </div>

                              <span className="text-xs font-semibold text-gray-700 mt-2">
                                Round 1
                              </span>

                              <span className="text-[11px] text-gray-400">
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
                                  : "bg-gray-200"
                              }`}
                            />

                            {/* ROUND 2 */}

                            <div className="flex flex-col items-center min-w-[90px]">

                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                  candidate.round2
                                    ?.communication
                                    ? "bg-green-100 text-green-600"
                                    : candidate.round1
                                        ?.communication
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {candidate.round2
                                  ?.communication ? (
                                  <CheckCircle2
                                    size={19}
                                  />
                                ) : (
                                  <Clock3
                                    size={19}
                                  />
                                )}
                              </div>

                              <span className="text-xs font-semibold text-gray-700 mt-2">
                                Round 2
                              </span>

                              <span className="text-[11px] text-gray-400">
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
                                  : "bg-gray-200"
                              }`}
                            />

                            {/* FINAL */}

                            <div className="flex flex-col items-center min-w-[90px]">

                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                  candidate.round2
                                    ?.communication
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {candidate.round2
                                  ?.communication ? (
                                  <BriefcaseBusiness
                                    size={18}
                                  />
                                ) : (
                                  <Clock3
                                    size={18}
                                  />
                                )}
                              </div>

                              <span className="text-xs font-semibold text-gray-700 mt-2">
                                Final
                              </span>

                              <span className="text-[11px] text-gray-400">
                                {candidate.round2
                                  ?.communication
                                  ? "Pending"
                                  : "Locked"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            RIGHT
                        ================================================= */}

                        <div className="flex items-center justify-between lg:justify-end gap-4">

                          <div className="text-right hidden md:block">

                            <p className="text-xs text-gray-400">
                              Applied
                            </p>

                            <p className="text-sm font-medium text-gray-700 mt-1">
                              {candidate.createdAt
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

                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                            <ChevronRight
                              size={20}
                            />
                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
}