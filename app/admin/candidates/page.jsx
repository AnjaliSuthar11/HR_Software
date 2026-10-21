// 4th september
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
  ClipboardCheck,
  Clock3,
  FileSearch,
  Link2,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

function getStatus(candidate) {
  return candidate?.finalStatus || "New";
}
function isInInterviewQueue(candidate) {
  const finalStatus = candidate?.finalStatus;

  // Once HR has made a final decision,
  // candidate is no longer in the interview queue.
  const finalDecisionMade = finalStatus && finalStatus !== "New";

  return !finalDecisionMade;
}
function getStatusLabel(status) {
  return status === "New" ? "In Progress" : status || "In Progress";
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function StatCard({ title, value, subtitle, icon: Icon, href, tone = "blue" }) {
  const tones = {
    blue: "from-blue-500/10 to-indigo-500/5 text-blue-700 bg-blue-50 border-blue-100",
    violet:
      "from-violet-500/10 to-fuchsia-500/5 text-violet-700 bg-violet-50 border-violet-100",
    amber:
      "from-amber-500/10 to-orange-500/5 text-amber-700 bg-amber-50 border-amber-100",
    green:
      "from-emerald-500/10 to-teal-500/5 text-emerald-700 bg-emerald-50 border-emerald-100",
    rose: "from-rose-500/10 to-pink-500/5 text-rose-700 bg-rose-50 border-rose-100",
  };

  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tones[
        tone
      ]
        .split(" ")
        .slice(0, 2)
        .join(" ")} ${tones[tone].split(" ").slice(2).join(" ")}`}
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
        Open section{" "}
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

function QuickAction({ href, icon: Icon, title, text, tone }) {
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
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
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

function ProgressBar({ value, total }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export default function CandidatesDashboardPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/candidates");

      if (data?.success) {
        setCandidates(Array.isArray(data.candidates) ? data.candidates : []);
      } else {
        setError(data?.message || "Unable to load candidates");
      }
    } catch (err) {
      console.error("Candidate dashboard error:", err);
      setError(
        err?.response?.data?.message || "Unable to load candidate dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let round1Completed = 0;
    let round2Completed = 0;
    let finalDecision = 0;
    let convertedEmployees = 0;

    let selected = 0;
    let rejected = 0;
    let onHold = 0;
    let joined = 0;
    let inProgress = 0;

    let interviewQueue = 0;
    let round1Pending = 0;
    let round2Pending = 0;
    let finalDecisionPending = 0;

    let monthCandidates = 0;

    candidates.forEach((candidate) => {
      const status = getStatus(candidate);

      // =====================================================
      // FINAL STATUS
      // =====================================================

      if (status === "Selected") {
        selected++;
      }

      if (status === "Rejected") {
        rejected++;
      }

      if (status === "On Hold") {
        onHold++;
      }

      if (status === "Joined") {
        joined++;
      }

      if (status === "New" || !status) {
        inProgress++;
      }

      // =====================================================
      // ROUND COMPLETION
      // =====================================================

      if (candidate?.round1?.communication) {
        round1Completed++;
      }

      if (candidate?.round2?.communication) {
        round2Completed++;
      }

      // =====================================================
      // FINAL DECISION STAGE
      // =====================================================

      if (
        candidate?.round1?.communication &&
        candidate?.round2?.communication &&
        (!candidate?.finalStatus || candidate.finalStatus === "New")
      ) {
        finalDecision++;
      }

      // converted candidates into employess
      if (candidate?.convertedToEmployee === true) {
        convertedEmployees++;
      }

      // =====================================================
      // MONTHLY CANDIDATES
      // =====================================================

      const createdAt = candidate?.createdAt
        ? new Date(candidate.createdAt)
        : null;

      if (
        createdAt &&
        !Number.isNaN(createdAt.getTime()) &&
        createdAt >= startOfMonth
      ) {
        monthCandidates++;
      }

      // =====================================================
      // INTERVIEW QUEUE
      //
      // New candidate
      //      ↓
      // Round 1 Pending
      //
      // Round 1 completed
      //      ↓
      // Round 2 Pending
      //
      // Both completed
      //      ↓
      // Final Decision
      //
      // Once Selected/Rejected/etc.
      //      ↓
      // Removed from queue
      // =====================================================

      if (isInInterviewQueue(candidate)) {
        interviewQueue++;

        if (!candidate?.round1?.communication) {
          round1Pending++;
        } else if (
          candidate?.round1?.communication &&
          !candidate?.round2?.communication
        ) {
          round2Pending++;
        } else if (
          candidate?.round1?.communication &&
          candidate?.round2?.communication
        ) {
          finalDecisionPending++;
        }
      }
    });

    return {
      total: candidates.length,

      round1Completed,
      round2Completed,
      finalDecision,

      selected,
      rejected,
      onHold,
      joined,
      inProgress,

      // New interview queue
      interviewQueue,
      round1Pending,
      round2Pending,
      finalDecisionPending,
      convertedEmployees,
      monthCandidates,
    };
  }, [candidates]);

  const monthlyTrend = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const d = new Date(
        today.getFullYear(),
        today.getMonth() - (5 - index),
        1
      );
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const count = candidates.filter((candidate) => {
        const created = candidate?.createdAt
          ? new Date(candidate.createdAt)
          : null;
        return (
          created &&
          !Number.isNaN(created.getTime()) &&
          created >= d &&
          created < next
        );
      }).length;

      return {
        key: getMonthKey(d),
        label: d.toLocaleString("en-IN", { month: "short" }),
        count,
      };
    });
  }, [candidates]);

  const maxMonthly = Math.max(...monthlyTrend.map((item) => item.count), 1);

  const statusData = useMemo(() => {
    const data = [
      {
        label: "In Progress",
        value: stats.inProgress,
        icon: Clock3,
        className: "text-blue-700 bg-blue-50",
      },
      {
        label: "Selected",
        value: stats.selected,
        icon: CheckCircle2,
        className: "text-emerald-700 bg-emerald-50",
      },
      {
        label: "Rejected",
        value: stats.rejected,
        icon: XCircle,
        className: "text-rose-700 bg-rose-50",
      },
      {
        label: "On Hold",
        value: stats.onHold,
        icon: Clock3,
        className: "text-amber-700 bg-amber-50",
      },
      {
        label: "Joined",
        value: stats.joined,
        icon: UserCheck,
        className: "text-violet-700 bg-violet-50",
      },
    ];

    return data;
  }, [stats]);

  const rolePipeline = useMemo(() => {
    const map = new Map();

    candidates.forEach((candidate) => {
      const role = candidate?.appliedPosition || "Position Not Assigned";
      const existing = map.get(role) || {
        role,
        total: 0,
        round1: 0,
        round2: 0,
        selected: 0,
        rejected: 0,
      };

      existing.total += 1;
      if (candidate?.round1?.communication) existing.round1 += 1;
      if (candidate?.round2?.communication) existing.round2 += 1;
      if (
        getStatus(candidate) === "Selected" ||
        getStatus(candidate) === "Joined"
      ) {
        existing.selected += 1;
      }
      if (getStatus(candidate) === "Rejected") existing.rejected += 1;

      map.set(role, existing);
    });

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [candidates]);

  const recentCandidates = useMemo(() => {
    return [...candidates]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 5);
  }, [candidates]);

  const currentMonthLabel = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
      <div className="flex min-h-screen w-full">

{/* left aside  */}
         <aside className="w-64 shrink-0">
      <Sidebar />
    </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden">

        <div className="min-h-screen bg-[#f6f8fc] p-5 md:p-8 ">
          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}
          <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                <Sparkles size={14} /> Recruitment Overview
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Candidate Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 md:text-base">
                Track candidates, interviews and final selection decisions from
                one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/candidates/view"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <Users size={18} />
                View Candidates
              </Link>
              <Link
                href="/dashboard/candidates/share-link"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
              >
                <Link2 size={18} />
                Share Candidate Link
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* ====================================================== */}
          {/* TOP STATS */}
          {/* ====================================================== */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Candidates"
              value={loading ? "—" : stats.total}
              subtitle={`${stats.monthCandidates} added this month`}
              icon={Users}
              href="/dashboard/candidates/view"
              tone="blue"
            />
            <StatCard
              title="Interview Queue"
              value={loading ? "—" : stats.interviewQueue}
              subtitle={`${stats.round1Pending} Round 1 • ${stats.round2Pending} Round 2 • ${stats.finalDecisionPending} Final`}
              icon={CalendarDays}
              href="/dashboard/candidates/interviews/today"
              tone="violet"
            />
            <StatCard
              title="Round 1 Completed"
              value={loading ? "—" : stats.round1Completed}
              subtitle="Initial interviews completed"
              icon={ClipboardCheck}
              href="/dashboard/candidates/round-1"
              tone="amber"
            />
            <StatCard
              title="Round 2 Completed"
              value={loading ? "—" : stats.round2Completed}
              subtitle="Second interviews completed"
              icon={FileSearch}
              href="/dashboard/candidates/round-2"
              tone="green"
            />
            <StatCard
              title="Final Decisions"
              value={loading ? "—" : stats.finalDecision}
              subtitle={`${stats.selected} selected / ${stats.rejected} rejected`}
              icon={UserCheck}
              href="/dashboard/candidates/final-decisions"
              tone="rose"
            />
            <StatCard
              title="Employees Converted"
              value={loading ? "—" : stats.convertedEmployees}
              subtitle="Candidates converted to employees"
              icon={UserCheck}
              href="/dashboard/candidates/converted"
              tone="green"
            />
          </div>

          {/* ====================================================== */}
          {/* MAIN GRID */}
          {/* ====================================================== */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            {/* MONTHLY OVERVIEW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Hiring Activity
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Candidate registrations over the last 6 months
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
                          style={{ height: `${height}%` }}
                          title={`${item.count} candidates in ${item.label}`}
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

            {/* STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Candidate Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current recruitment pipeline
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {statusData.map((item) => {
                  const percentage = stats.total
                    ? Math.round((item.value / stats.total) * 100)
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
                        <ProgressBar value={item.value} total={stats.total} />
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

          {/* ====================================================== */}
          {/* QUICK ACTIONS + PIPELINE */}
          {/* ====================================================== */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.65fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump directly to common recruitment tasks
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/dashboard/candidates/view"
                  icon={Users}
                  title="View Candidates"
                  text="Search, filter and manage applications"
                  tone="blue"
                />
                <QuickAction
                  href="/dashboard/candidates/share-link"
                  icon={Link2}
                  title="Share Registration Link"
                  text="Create a fresh candidate registration link"
                  tone="indigo"
                />
                <QuickAction
                  href="/dashboard/candidates/interviews/today"
                  icon={CalendarDays}
                  title="Interview Queue"
                  text={`${stats.interviewQueue} candidate${
                    stats.interviewQueue === 1 ? "" : "s"
                  } currently in interview process`}
                  tone="amber"
                />
                <QuickAction
                  href="/dashboard/candidates/view"
                  icon={CheckCircle2}
                  title="Final Decisions"
                  text={`${stats.finalDecision} candidates reached the decision stage`}
                  tone="green"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Role-wise Selection Pipeline
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    See where multiple candidates are competing for the same
                    role
                  </p>
                </div>
                <BriefcaseBusiness size={20} className="text-slate-300" />
              </div>

              <div className="mt-5 overflow-x-auto">
                {rolePipeline.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                    No candidate pipeline data yet.
                  </div>
                ) : (
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                        <th className="pb-3 pr-4 font-semibold">Role</th>
                        <th className="pb-3 pr-4 font-semibold">Candidates</th>
                        <th className="pb-3 pr-4 font-semibold">Round 1</th>
                        <th className="pb-3 pr-4 font-semibold">Round 2</th>
                        <th className="pb-3 pr-4 font-semibold">Selected</th>
                        <th className="pb-3 text-right font-semibold">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rolePipeline.map((role) => (
                        <tr
                          key={role.role}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="py-4 pr-4 font-semibold text-slate-800">
                            {role.role}
                          </td>
                          <td className="py-4 pr-4 font-medium text-slate-600">
                            {role.total}
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {role.round1}
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {role.round2}
                          </td>
                          <td className="py-4 pr-4">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {role.selected}
                            </span>
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="inline-flex w-28 flex-col gap-1.5 align-middle">
                              <ProgressBar
                                value={role.selected}
                                total={role.total}
                              />
                              <span className="text-[11px] text-slate-400">
                                {role.total > 0
                                  ? Math.round(
                                      (role.selected / role.total) * 100
                                    )
                                  : 0}
                                % selected
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

          {/* ====================================================== */}
          {/* RECENT CANDIDATES */}
          {/* ====================================================== */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Candidates
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest candidate registrations
                </p>
              </div>
              <Link
                href="/dashboard/candidates/view"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-5">
              {recentCandidates.length === 0 ? (
                <div className="lg:col-span-5 rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                  No candidates available.
                </div>
              ) : (
                recentCandidates.map((candidate) => {
                  const status = getStatus(candidate);
                  const statusClass =
                    status === "Selected"
                      ? "bg-emerald-50 text-emerald-700"
                      : status === "Rejected"
                      ? "bg-rose-50 text-rose-700"
                      : status === "On Hold"
                      ? "bg-amber-50 text-amber-700"
                      : status === "Joined"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-slate-100 text-slate-600";

                  return (
                    <Link
                      key={candidate._id}
                      href={`/dashboard/candidates/${candidate._id}`}
                      className="group rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white">
                          {candidate?.fullName?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {candidate?.fullName || "Unnamed Candidate"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {candidate?.appliedPosition ||
                              "Position not assigned"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {candidate?.createdAt
                            ? new Date(candidate.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                }
                              )
                            : "—"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          R1 {candidate?.round1?.communication ? "✓" : "—"}
                        </span>
                        <span>
                          R2 {candidate?.round2?.communication ? "✓" : "—"}
                        </span>
                        <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          Open <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          {/* ====================================================== */}
          {/* MONTH SUMMARY */}
          {/* ====================================================== */}
          <section className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                This Month
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.monthCandidates}
              </p>
              <p className="mt-1 text-sm text-slate-500">new candidates</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Interviews
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.monthInterviews}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                scheduled this month
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Selected
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {stats.selected}
              </p>
              <p className="mt-1 text-sm text-slate-500">currently selected</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Conversion
              </p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
                {stats.total > 0
                  ? Math.round((stats.selected / stats.total) * 100)
                  : 0}
                %
                <TrendingUp size={19} className="text-emerald-500" />
              </p>
              <p className="mt-1 text-sm text-slate-500">
                candidate to selection
              </p>
            </div>
          </section>
        </div>

      </main>
      

    </div>
  );
}
