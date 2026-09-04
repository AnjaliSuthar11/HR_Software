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
  ChevronRight,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

function StatusBadge({ status }) {
  const cls =
    status === "Selected"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : status === "On Hold"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status === "New" ? "In Progress" : status}
    </span>
  );
}

export default function Round1Page() {
  const [candidates, setCandidates] = useState([]);
  const [department, setDepartment] = useState("All");
  const [position, setPosition] = useState("All");
  const [result, setResult] = useState("All");
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
  // ROUND 1 COMPLETED
  //
  // IMPORTANT:
  // - Round 1 communication must exist
  // - Converted employees are excluded
  // ============================================================

  const completed = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate?.round1?.communication &&
        candidate?.convertedToEmployee !== true
    );
  }, [candidates]);

  // ============================================================
  // FILTERED LIST
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
        // RESULT
        // ------------------------------------------------------

        const finalStatus =
          candidate.finalStatus || "New";

        let resultMatch = true;

        if (
          result ===
          "Completed - In Progress"
        ) {
          resultMatch =
            !candidate.finalStatus ||
            candidate.finalStatus === "New";
        }

        if (result === "Selected") {
          resultMatch =
            finalStatus === "Selected";
        }

        if (result === "Rejected") {
          resultMatch =
            finalStatus === "Rejected";
        }

        if (result === "On Hold") {
          resultMatch =
            finalStatus === "On Hold";
        }

        return (
          searchMatch &&
          departmentMatch &&
          positionMatch &&
          resultMatch
        );
      }
    );
  }, [
    completed,
    search,
    department,
    position,
    result,
  ]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clear = () => {
    setDepartment("All");
    setPosition("All");
    setResult("All");
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

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <CheckCircle2 size={23} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Round 1 Completed
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Candidates who have completed
                  the first interview round.
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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Round 1 Completed
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
                  Pending Round 2
                </p>

                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  {
                    completed.filter(
                      (candidate) =>
                        !candidate.round2
                          ?.communication
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ChevronRight size={21} />
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
                Round 1 Filters
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Find candidates by role,
                department or current outcome.
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

          <div className="grid gap-4 md:grid-cols-3">

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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

            {/* RESULT */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Result
              </label>

              <select
                value={result}
                onChange={(e) =>
                  setResult(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">
                  All Results
                </option>

                <option value="Completed - In Progress">
                  Completed - In Progress
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

              </select>

            </div>

          </div>

          {/* GLOBAL SEARCH NOTICE */}

          {search && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">

              <Search size={15} />

              Searching for:
              <span className="font-semibold">
                "{search}"
              </span>

            </div>
          )}

        </div>

        {/* ======================================================
            RESULT COUNT
        ====================================================== */}

        <div className="mb-4 flex items-center justify-between">

          <div className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filtered.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {completed.length}
            </span>

            {" "}Round 1 candidates

          </div>

        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading ? (

          <div className="grid gap-4 xl:grid-cols-2">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl bg-white border border-slate-200"
                />
              )
            )}

          </div>

        ) : filtered.length === 0 ? (

          /* ====================================================
             EMPTY
          ==================================================== */

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Users
                size={30}
                className="text-slate-400"
              />
            </div>

            <h2 className="font-semibold text-slate-800">
              No Round 1 candidates found
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Try changing the filters or
              search criteria.
            </p>

            <button
              type="button"
              onClick={clear}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>

          </div>

        ) : (

          /* ====================================================
             CANDIDATES
          ==================================================== */

          <div className="grid gap-4 xl:grid-cols-2">

            {filtered.map(
              (candidate) => {

                const round2Done =
                  !!candidate.round2
                    ?.communication;

                return (

                  <Link
                    key={candidate._id}
                    href={`/dashboard/candidates/${candidate._id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                          {candidate.fullName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "C"}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-bold text-slate-900">
                            {
                              candidate.fullName
                            }
                          </h3>

                          <p className="truncate text-sm font-medium text-blue-600">
                            {candidate.appliedPosition ||
                              "Position not assigned"}
                          </p>

                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Building2
                              size={12}
                            />
                            {candidate.department ||
                              "Department not assigned"}
                          </p>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          candidate.finalStatus ||
                          "New"
                        }
                      />

                    </div>

                    {/* CONTACT */}

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                      {candidate.email && (
                        <span className="truncate">
                          {candidate.email}
                        </span>
                      )}

                      {candidate.mobile && (
                        <span>
                          {candidate.mobile}
                        </span>
                      )}

                    </div>

                    {/* PIPELINE */}

                    <div className="mt-5 grid grid-cols-3 gap-3">

                      {/* ROUND 1 */}

                      <div className="rounded-xl bg-emerald-50 p-3">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                          Round 1
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 font-semibold text-emerald-700">
                          <CheckCircle2
                            size={14}
                          />
                          Completed
                        </p>

                      </div>

                      {/* ROUND 2 */}

                      <div
                        className={`rounded-xl p-3 ${
                          round2Done
                            ? "bg-emerald-50"
                            : "bg-indigo-50"
                        }`}
                      >

                        <p
                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                            round2Done
                              ? "text-emerald-600"
                              : "text-indigo-600"
                          }`}
                        >
                          Round 2
                        </p>

                        <p
                          className={`mt-1 font-semibold ${
                            round2Done
                              ? "text-emerald-700"
                              : "text-indigo-700"
                          }`}
                        >
                          {round2Done
                            ? "Completed"
                            : "Pending"}
                        </p>

                      </div>

                      {/* ACTION */}

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Action
                        </p>

                        <p className="mt-1 flex items-center gap-1 font-semibold text-slate-700">
                          Open
                          <Eye size={13} />
                        </p>

                      </div>

                    </div>

                    {/* FOOTER */}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-xs text-slate-400">
                        Round 1 completed
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition group-hover:text-blue-700">
                        View Candidate
                        <ChevronRight
                          size={14}
                        />
                      </span>

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