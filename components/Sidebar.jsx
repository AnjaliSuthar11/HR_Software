"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCheck,
  Clock3,
  BarChart3,
  Settings,
  Briefcase,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
  },
  {
    name: "Interviews",
    href: "/dashboard/interviews",
    icon: CalendarDays,
  },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: UserCheck,
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock3,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0F1E2D] text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-700">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center">
            <Briefcase size={22} />
          </div>

          <div>
            <h1 className="font-bold text-lg">Pulse HR</h1>
            <p className="text-xs text-gray-400">
              Recruitment & People
            </p>
          </div>

        </div>
      </div>

      {/* Menu */}

      <div className="px-6 mt-6">

        <p className="text-gray-400 text-xs uppercase mb-3">
          Workspace
        </p>

        <nav className="space-y-2">

          {menus.map((item) => {

            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  active
                    ? "bg-slate-700"
                    : "hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>

              </Link>
            );
          })}
        </nav>

      </div>

      {/* Bottom User */}

      <div className="mt-auto border-t border-slate-700 p-5">

        <div className="flex gap-3 items-center">

          <div className="w-12 h-12 rounded-full bg-sky-600 flex justify-center items-center font-bold">
            HR
          </div>

          <div>
            <p className="font-semibold">
              HR Admin
            </p>

            <p className="text-sm text-gray-400">
              admin@company.com
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}