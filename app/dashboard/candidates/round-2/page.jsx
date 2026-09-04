"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  FileSearch,
  RotateCcw,
  Users,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Search,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function Round2Page() {
  const [candidates, setCandidates] = useState([]);
  const [department, setDepartment] = useState("All");
  const [position, setPosition] = useState("All");
  const [decision, setDecision] = useState("All");
  const [loading, setLoading] = useState(true);

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

      if (data?.success) {
        setCandidates(
          data.candidates || []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load candidates:",
        error
      );
    } finally {
      setLoading(false);
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

  // ============================================================
  // ROUND 2 COMPLETED
  //
  // IMPORTANT:
  // Round 2 must be completed
  // AND candidate must NOT already
  // be converted into an employee.
  // ============================================================

  const completed = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate?.round2?.communication &&
        candidate?.convertedToEmployee !== true
    );
  }, [candidates]);

  // ============================================================
  // FILTERED CANDIDATES
  // ============================================================

  const filtered = useMemo(() => {
    const q =
      (search || "").toLowerCase().trim();

    return completed.filter(
      (candidate) => {
        // ------------------------------------------------------
        // SEARCH
        // ------------------------------------------------------

        const searchMatch =
          !q ||
          candidate.fullName
            ?.toLowerCase()
            .includes(q) ||
          candidate.email
            ?.toLowerCase()
            .includes(q) ||
          candidate.mobile
            ?.toLowerCase()
            .includes(q) ||
          candidate.appliedPosition
            ?.toLowerCase()
            .includes(q);

        // ------------------------------------------------------
        // DEPARTMENT
        // ------------------------------------------------------

        const departmentMatch =
          department === "All" ||
          candidate.department ===
            department;

        // ------------------------------------------------------
        // POSITION
        // ------------------------------------------------------

        const positionMatch =
          position === "All" ||
          candidate.appliedPosition ===
            position;

        // ------------------------------------------------------
        // DECISION
        // ------------------------------------------------------

        const status =
          candidate.finalStatus || "New";

        let decisionMatch = true;

        if (
          decision ===
          "Pending Final Decision"
        ) {
          decisionMatch =
            !candidate.finalStatus ||
            candidate.finalStatus === "New";
        }

        if (decision === "Selected") {
          decisionMatch =
            status === "Selected";
        }

        if (decision === "Rejected") {
          decisionMatch =
            status === "Rejected";
        }

        if (decision === "On Hold") {
          decisionMatch =
            status === "On Hold";
        }

        if (decision === "Joined") {
          decisionMatch =
            status === "Joined";
        }

        return (
          searchMatch &&
          departmentMatch &&
          positionMatch &&
          decisionMatch
        );
      }
    );
  }, [
    completed,
    search,
    department,
    position,
    decision,
  ]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clear = () => {
    setDepartment("All");
    setPosition("All");
    setDecision("All");
  };

  // ============================================================
  // STATUS STYLING
  // ============================================================

  const getDecisionClass = (
    status
  ) => {
    if (
      status === "Selected" ||
      status === "Joined"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (status === "On Hold") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-5 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-7">

          <Link
            href="/dashboard/candidates"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Candidate Dashboard
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <FileSearch size={23} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Round 2 Completed
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Final-stage candidates ready
                  for a recruitment decision.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={loadCandidates}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Refresh
            </button>

          </div>

        </div>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Round 2 Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completed.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Showing
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filtered.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Pending Final Decision
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {
                    completed.filter(
                      (candidate) =>
                        !candidate.finalStatus ||
                        candidate.finalStatus ===
                          "New"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Round 2 Filters
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Narrow final-stage candidates
                before making a decision.
              </p>

            </div>

            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>

          </div>

          <div className="grid gap-4 md:grid-cols-4">

            {/* SEARCH */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Search
              </label>

              <div className="relative">

                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search || ""}
                  readOnly
                  placeholder="Search from dashboard..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none"
                />

              </div>

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Department
              </label>

              <div className="relative">

                <Building2
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="All">
                    All Departments
                  </option>

                  {departments.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* POSITION */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Applied Position
              </label>

              <div className="relative">

                <BriefcaseBusiness
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={position}
                  onChange={(e) =>
                    setPosition(
                      e.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="All">
                    All Positions
                  </option>

                  {positions.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* DECISION */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Decision
              </label>

              <select
                value={decision}
                onChange={(e) =>
                  setDecision(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >

                <option value="All">
                  All Decisions
                </option>

                <option value="Pending Final Decision">
                  Pending Final Decision
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="On Hold">
                  On Hold
                </option>

                <option value="Joined">
                  Joined
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ======================================================
            RESULT COUNT
        ====================================================== */}

        <div className="mb-4 text-sm text-slate-500">

          Showing{" "}

          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>

          {" "}Round 2 candidates

        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-sm">

              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">

                <tr>

                  <th className="px-5 py-4">
                    Candidate
                  </th>

                  <th className="px-5 py-4">
                    Position
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Round 1
                  </th>

                  <th className="px-5 py-4">
                    Round 2
                  </th>

                  <th className="px-5 py-4">
                    Decision
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                      <p className="mt-3 text-sm text-slate-400">
                        Loading Round 2 candidates...
                      </p>

                    </td>

                  </tr>

                ) : filtered.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">

                        <Users
                          size={26}
                          className="text-slate-400"
                        />

                      </div>

                      <p className="font-semibold text-slate-700">
                        No Round 2 candidates found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filtered.map(
                    (candidate) => {

                      const status =
                        candidate.finalStatus ||
                        "New";

                      return (

                        <tr
                          key={candidate._id}
                          className="border-t border-slate-100 transition hover:bg-slate-50/70"
                        >

                          {/* CANDIDATE */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">

                                {candidate.fullName
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "C"}

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-slate-900">
                                  {
                                    candidate.fullName
                                  }
                                </p>

                                <p className="max-w-[220px] truncate text-xs text-slate-400">
                                  {
                                    candidate.email ||
                                    "—"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* POSITION */}

                          <td className="px-5 py-4 font-medium text-slate-700">

                            <div className="flex items-center gap-2">

                              <BriefcaseBusiness
                                size={14}
                                className="text-slate-400"
                              />

                              {candidate.appliedPosition ||
                                "—"}

                            </div>

                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-5 py-4 text-slate-500">

                            <div className="flex items-center gap-2">

                              <Building2
                                size={14}
                                className="text-slate-400"
                              />

                              {candidate.department ||
                                "—"}

                            </div>

                          </td>

                          {/* ROUND 1 */}

                          <td className="px-5 py-4">

                            {candidate.round1
                              ?.communication ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                                <CheckCircle2
                                  size={13}
                                />

                                Completed

                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">

                                Pending

                              </span>

                            )}

                          </td>

                          {/* ROUND 2 */}

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                              <CheckCircle2
                                size={13}
                              />

                              Completed

                            </span>

                          </td>

                          {/* DECISION */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getDecisionClass(
                                status
                              )}`}
                            >

                              {status === "New"
                                ? "Pending Final Decision"
                                : status}

                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">

                            <Link
                              href={`/dashboard/candidates/${candidate._id}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >

                              <Eye
                                size={15}
                              />

                              Open

                            </Link>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}