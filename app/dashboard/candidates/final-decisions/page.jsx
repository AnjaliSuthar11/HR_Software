"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  RotateCcw,
  Users,
  Building2,
  BriefcaseBusiness,
  Search,
  UserCheck,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function FinalDecisionsPage() {
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
  // FINAL DECISION CANDIDATES
  //
  // MUST HAVE:
  // Round 1 completed
  // Round 2 completed
  // NOT converted into employee
  //
  // This prevents already converted employees
  // from appearing here.
  // ============================================================

  const decisionCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate?.round1?.communication &&
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

    return decisionCandidates.filter(
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

        if (decision === "Pending") {
          decisionMatch =
            status === "New";
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
    decisionCandidates,
    search,
    department,
    position,
    decision,
  ]);

  // ============================================================
  // GROUP BY SAME ROLE
  //
  // Example:
  //
  // Marketing
  // Social Media Executive
  //
  // Candidate A
  // Candidate B
  // Candidate C
  // ============================================================

  const roleGroups = useMemo(() => {
    const map = new Map();

    filtered.forEach((candidate) => {
      const role =
        candidate.appliedPosition ||
        "Position not assigned";

      const dept =
        candidate.department ||
        "Department not assigned";

      const key =
        `${dept}__${role}`;

      if (!map.has(key)) {
        map.set(key, {
          role,
          department: dept,
          candidates: [],
        });
      }

      map.get(key).candidates.push(
        candidate
      );
    });

    return [...map.values()].sort(
      (a, b) =>
        b.candidates.length -
        a.candidates.length
    );
  }, [filtered]);

  // ============================================================
  // COUNTS
  // ============================================================

  const counts = useMemo(() => {
    return {
      total: decisionCandidates.length,

      pending:
        decisionCandidates.filter(
          (candidate) =>
            !candidate.finalStatus ||
            candidate.finalStatus === "New"
        ).length,

      selected:
        decisionCandidates.filter(
          (candidate) =>
            candidate.finalStatus ===
            "Selected"
        ).length,

      rejected:
        decisionCandidates.filter(
          (candidate) =>
            candidate.finalStatus ===
            "Rejected"
        ).length,

      onHold:
        decisionCandidates.filter(
          (candidate) =>
            candidate.finalStatus ===
            "On Hold"
        ).length,
    };
  }, [decisionCandidates]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clear = () => {
    setDepartment("All");
    setPosition("All");
    setDecision("All");
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusClass = (status) => {
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

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <CheckCircle2 size={23} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Final Decisions
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Compare candidates who have
                  completed both interview rounds.
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
            SUMMARY
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Pending Decision
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {counts.pending}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>

            </div>

          </div>

          {/* SELECTED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Selected
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {counts.selected}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={21} />
              </div>

            </div>

          </div>

          {/* REJECTED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Rejected
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {counts.rejected}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                ×
              </div>

            </div>

          </div>

          {/* ON HOLD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  On Hold
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {counts.onHold}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ClockIcon />
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
                Decision Filters
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Compare final-stage candidates
                by role, department and decision.
              </p>

            </div>

            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >

                <option value="All">
                  All Decisions
                </option>

                <option value="Pending">
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
            ROLE GROUPS
        ====================================================== */}

        <section className="mb-7">

          <div className="mb-4">

            <h2 className="text-xl font-bold text-slate-900">
              Candidates by Role
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Candidates applying for the same
              position are grouped together for
              easier comparison.
            </p>

          </div>

          {loading ? (

            <div className="grid gap-5 lg:grid-cols-2">

              {[1, 2].map(
                (item) => (
                  <div
                    key={item}
                    className="h-64 animate-pulse rounded-2xl bg-white border border-slate-200"
                  />
                )
              )}

            </div>

          ) : roleGroups.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">

                <Users
                  size={26}
                  className="text-slate-400"
                />

              </div>

              <p className="font-semibold text-slate-700">
                No final-stage candidates found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Candidates will appear here after
                completing both interview rounds.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {roleGroups.map(
                (group) => (

                  <div
                    key={`${group.department}-${group.role}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    {/* GROUP HEADER */}

                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <BriefcaseBusiness
                            size={18}
                            className="text-blue-600"
                          />

                          <h3 className="text-lg font-bold text-slate-900">
                            {group.role}
                          </h3>

                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                          <Building2 size={14} />

                          {group.department}

                        </div>

                      </div>

                      <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">

                        {group.candidates.length}{" "}
                        Candidate
                        {group.candidates.length !==
                        1
                          ? "s"
                          : ""}

                      </span>

                    </div>

                    {/* CANDIDATES */}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                      {group.candidates.map(
                        (candidate) => {

                          const status =
                            candidate.finalStatus ||
                            "New";

                          const pending =
                            status === "New";

                          return (

                            <div
                              key={
                                candidate._id
                              }
                              className={`rounded-2xl border p-5 transition ${
                                pending
                                  ? "border-blue-200 bg-blue-50/30 hover:shadow-md"
                                  : "border-slate-200 bg-white hover:shadow-md"
                              }`}
                            >

                              {/* NAME */}

                              <div className="flex items-start justify-between gap-3">

                                <div className="flex min-w-0 items-center gap-3">

                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">

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

                                    <p className="truncate text-xs text-slate-400">
                                      {
                                        candidate.email ||
                                        "No email"
                                      }
                                    </p>

                                  </div>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  {pending
                                    ? "Pending"
                                    : status}
                                </span>

                              </div>

                              {/* INTERVIEW STATUS */}

                              <div className="mt-4 grid grid-cols-2 gap-2">

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    Round 1
                                  </p>

                                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">

                                    <CheckCircle2
                                      size={13}
                                    />

                                    Completed

                                  </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    Round 2
                                  </p>

                                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">

                                    <CheckCircle2
                                      size={13}
                                    />

                                    Completed

                                  </p>

                                </div>

                              </div>

                              {/* ACTION */}

                              <Link
                                href={`/dashboard/candidates/${candidate._id}`}
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >

                                <Eye size={15} />

                                {pending
                                  ? "Make Final Decision"
                                  : "View Decision"}

                              </Link>

                            </div>

                          );
                        }
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ======================================================
            ALL FINAL STAGE CANDIDATES TABLE
        ====================================================== */}

        {!loading &&
          filtered.length > 0 && (

            <section>

              <div className="mb-4">

                <h2 className="text-xl font-bold text-slate-900">
                  Final Decision Register
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete list of final-stage
                  candidates.
                </p>

              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px] text-sm">

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

                      {filtered.map(
                        (candidate) => {

                          const status =
                            candidate.finalStatus ||
                            "New";

                          return (

                            <tr
                              key={
                                candidate._id
                              }
                              className="border-t border-slate-100 hover:bg-slate-50/70"
                            >

                              {/* CANDIDATE */}

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 font-bold text-rose-700">

                                    {candidate.fullName
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase() ||
                                      "C"}

                                  </div>

                                  <div>

                                    <p className="font-semibold text-slate-900">
                                      {
                                        candidate.fullName
                                      }
                                    </p>

                                    <p className="text-xs text-slate-400">
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

                                {
                                  candidate.appliedPosition ||
                                  "—"
                                }

                              </td>

                              {/* DEPARTMENT */}

                              <td className="px-5 py-4 text-slate-500">

                                {
                                  candidate.department ||
                                  "—"
                                }

                              </td>

                              {/* ROUND 1 */}

                              <td className="px-5 py-4">

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                                  <CheckCircle2
                                    size={13}
                                  />

                                  Completed

                                </span>

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
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  {status ===
                                  "New"
                                    ? "Pending"
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
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </section>

          )}

      </div>

    </div>
  );
}

// ============================================================
// SMALL ICON
// ============================================================

function ClockIcon() {
  return (
    <span className="text-xl leading-none">
      ⏳
    </span>
  );
}