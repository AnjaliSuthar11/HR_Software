"use client"
import Sidebar from "@/components/admin/Sidebar";
import TaskManagement from "@/components/TaskManagement";
import { useRouter } from "next/navigation";

export default function EmployeeTasksPage() {

    const router = useRouter()
    
    const handleLogout = () => {
    localStorage.removeItem(
      "employeeLoggedIn"
    );

    localStorage.removeItem(
      "employeeId"
    );

    localStorage.removeItem(
      "employeeData"
    );

    router.replace(
      "/employee/login"
    );
  };

  return (
          <div className="flex min-h-screen w-full">
<div className=" w-64 shrink-0">


        <aside className="fixed left-0 top-0  h-screen bg-white border-r border-gray-200 lg:flex lg:flex-col w-64">

        <div className="px-6 py-6 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              E
            </div>

            <div>
              <h1 className="font-bold text-gray-900">
                Employee
              </h1>

              <p className="text-xs text-gray-400">
                Portal
              </p>
            </div>

          </div>

        </div>

        <nav className="flex-1 p-4">

          <p className="text-xs font-semibold uppercase text-gray-400 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              onClick={() =>
                router.push(
                  "/employee/dashboard"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>🏠</span>
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/profile"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>👤</span>
              My Profile
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/leave"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>📝</span>
              Leave
            </button>

            <button
              onClick={() =>
                router.push(
                  "/employee/attendance"
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              <span>📅</span>
              Attendance
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md"
            >
              <span>📝</span>
              Task
            </button>

          </div>

        </nav>

        <div className="p-4 border-t border-gray-100">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>

</div>
          <main className="min-w-0 flex-1 overflow-x-hidden ">

      <TaskManagement />
        </main>
    </div>
  );
}
