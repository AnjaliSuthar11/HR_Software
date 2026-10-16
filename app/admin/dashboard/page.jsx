"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserCog,
  UserRound,
  BriefcaseBusiness,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const modules = [
  {
    title: "HR Management",
    description: "Manage HR accounts and access.",
    icon: UserCog,
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Employees",
    description: "View and manage company employees.",
    icon: Users,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Recruitment",
    description: "Manage candidates and recruitment.",
    icon: BriefcaseBusiness,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Attendance",
    description: "Review attendance records.",
    icon: ClipboardCheck,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Leaves",
    description: "Review employee leave records.",
    icon: CalendarDays,
    color: "bg-pink-50 text-pink-700",
  },
  {
    title: "Salary",
    description: "Review payroll and salary records.",
    icon: Wallet,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Employee Profiles",
    description: "Access employee information.",
    icon: UserRound,
    color: "bg-cyan-50 text-cyan-700",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("OwnerAdminData");

      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch {
      setAdmin(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("OwnerAdminLoggedIn");
    localStorage.removeItem("OwnerAdminId");
    localStorage.removeItem("OwnerAdminData");

    router.replace("/admin/login");
  };

  return (
    <main>
        <div >

        <Sidebar/>
        </div>
        <div className="flex">

       
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Owner Admin Panel
              </h1>

              <p className="text-xs text-slate-500">
                Company management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            OWNER OVERVIEW
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>

          <p className="mt-2 text-slate-500">
            {admin?.adminEmail || "Company Owner"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your central place to oversee HR, employees and company operations.
          </p>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Owner Access
                </h3>

                <p className="text-sm text-slate-500">
                  Signed in as the company owner
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Management Center
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use the sections below to organize company operations.
              Management pages will be connected to your existing MongoDB data.
            </p>
          </div>
        </section>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Management Modules
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Owner-level oversight of company operations.
          </p>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={23} />
                </div>

                <h4 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  Module to connect
                </span>
              </div>
            );
          })}
        </section>
      </div>
       </div>
    </main>
  );
}