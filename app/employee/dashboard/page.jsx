"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cake,
  Star,
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const router = useRouter();

  // ==================================================
  // STATE
  // ==================================================

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // CALENDAR VALUES
  // ==================================================

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();

  const monthName = calendarDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  // ==================================================
  // CHECK LOGIN
  // ==================================================

  useEffect(() => {
    const loggedIn = localStorage.getItem("employeeLoggedIn");

    const employeeData = localStorage.getItem("employeeData");

    if (loggedIn !== "true" || !employeeData) {
      router.replace("/employee/login");
      return;
    }

    try {
      const parsedEmployee = JSON.parse(employeeData);

      setEmployee(parsedEmployee);
    } catch (error) {
      console.error("Employee data error:", error);

      localStorage.removeItem("employeeLoggedIn");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("employeeData");

      router.replace("/employee/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ==================================================
  // LOAD HOLIDAYS
  // ==================================================

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const res = await axios.get(
          `/api/holiday?year=${currentYear}`
        );

        setHolidays(res.data?.holidays || []);
      } catch (error) {
        console.error("Failed to load holidays:", error);

        setHolidays([]);
      }
    };

    loadHolidays();
  }, [currentYear]);

  // ==================================================
  // GET EMPLOYEE BIRTHDAY
  // ==================================================

  const employeeBirthdayEvents = useMemo(() => {
    if (!employee?.dateOfBirth) {
      return [];
    }

    const dob = new Date(employee.dateOfBirth);

    if (Number.isNaN(dob.getTime())) {
      return [];
    }

    const birthday = new Date(
      currentYear,
      dob.getUTCMonth(),
      dob.getUTCDate()
    );

    return [
      {
        id: "my-birthday",
        title: "My Birthday",
        date: birthday,
        type: "birthday",
      },
    ];
  }, [employee, currentYear]);

  // ==================================================
  // CALENDAR EVENTS
  // ==================================================

  const calendarEvents = useMemo(() => {
    const holidayEvents = holidays.map((holiday) => ({
      id: `holiday-${holiday._id}`,
      title: holiday.name || "Holiday",
      date: new Date(holiday.date),
      type: "holiday",
      paid: holiday.paid,
      description: holiday.description || "",
    }));

    return [
      ...holidayEvents,
      ...employeeBirthdayEvents,
    ];
  }, [holidays, employeeBirthdayEvents]);

  // ==================================================
  // EVENTS FOR DAY
  // ==================================================

  const getEventsForDay = (day) => {
    return calendarEvents.filter((event) => {
      const date = new Date(event.date);

      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth &&
        date.getDate() === day
      );
    });
  };

  // ==================================================
  // MONTH NAVIGATION
  // ==================================================

  const previousMonth = () => {
    setCalendarDate(
      new Date(
        currentYear,
        currentMonth - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(
        currentYear,
        currentMonth + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeData");

    router.replace("/employee/login");
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // NO EMPLOYEE
  // ==================================================

  if (!employee) {
    return null;
  }
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">

        {/* LOGO */}

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

        {/* MENU */}

        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">

            <button
              className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-blue-100"
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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <span>📅</span>
              Attendance
            </button>
            
            <button
              onClick={() =>
                router.push(
                  "/employee/task"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <span>📅</span>
              Task
            </button>

          </div>

        </nav>

        {/* LOGOUT */}

        <div className="border-t border-gray-100 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-64">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur lg:px-8">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Employee Portal
            </p>

          </div>

          <div className="flex items-center gap-4">

            {/* NOTIFICATION */}

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg transition hover:bg-gray-200">
              🔔

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* PROFILE */}

            <div className="flex items-center gap-3">

              {employee.employeePhoto ? (

                <img
                  src={
                    employee.employeePhoto
                  }
                  alt={
                    employee.employeeFullName
                  }
                  className="h-10 w-10 rounded-full object-cover"
                />

              ) : (

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {employee.employeeFullName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-gray-800">
                  {
                    employee.employeeFullName
                  }
                </p>

                <p className="text-xs text-gray-400">
                  {
                    employee.employeeCode
                  }
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-6 lg:p-8">

          {/* ==================================================
              WELCOME CARD
          ================================================== */}

          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">

            <div className="relative z-10 max-w-2xl">

              <p className="mb-2 text-blue-100">
                Welcome back 👋
              </p>

              <h1 className="text-3xl font-bold lg:text-4xl">
                {
                  employee.employeeFullName
                }
              </h1>

              <p className="mt-3 text-blue-100">
                We are happy to have you with us.
                Here you can manage your employee
                information and company activities.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                  <span className="text-xs text-blue-100">
                    Employee Code
                  </span>

                  <p className="font-semibold">
                    {
                      employee.employeeCode
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                  <span className="text-xs text-blue-100">
                    Status
                  </span>

                  <p className="font-semibold">
                    {
                      employee.employeeStatus
                    }
                  </p>
                </div>

              </div>

            </div>

            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 text-8xl opacity-20 xl:block">
              👨‍💼
            </div>

          </section>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

         

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="mb-8">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500">
                Frequently used employee options
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <button
                onClick={() =>
                  router.push(
                    "/employee/profile"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-600 group-hover:text-white">
                  👤
                </div>

                <h3 className="font-bold text-gray-900">
                  My Profile
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View your employee information
                </p>

              </button>

              <button
                onClick={() =>
                  router.push(
                    "/employee/leave"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl transition group-hover:bg-orange-500 group-hover:text-white">
                  📝
                </div>

                <h3 className="font-bold text-gray-900">
                  Apply Leave
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Submit a new leave request
                </p>

              </button>

              <button
                onClick={() =>
                  router.push(
                    "/employee/task"
                  )
                }
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl transition group-hover:bg-green-500 group-hover:text-white">
                  📅
                </div>

                <h3 className="font-bold text-gray-900">
                 Task
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View your Daily Task
                </p>

              </button>

            </div>

          </section>

          {/* ==================================================
              INFORMATION
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Employee Information */}

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 p-6">

                <h2 className="font-bold text-lg">
                  Employee Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your basic company information
                </p>

              </div>

              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                <InfoItem
                  label="Employee Code"
                  value={
                    employee.employeeCode
                  }
                />

                <InfoItem
                  label="Full Name"
                  value={
                    employee.employeeFullName
                  }
                />

                <InfoItem
                  label="Company Email"
                  value={
                    employee.companyLoginEmail
                  }
                />

                <InfoItem
                  label="Mobile Number"
                  value={
                    employee.mobileNo
                  }
                />

                <InfoItem
                  label="Joining Date"
                  value={
                    employee.joiningDate
                      ? new Date(
                          employee.joiningDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "Not provided"
                  }
                />

                <InfoItem
                  label="Status"
                  value={
                    employee.employeeStatus
                  }
                />

              </div>

            </div>

            {/* Today */}

           <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

  {/* HEADER */}

  <div className="border-b border-gray-100 p-6">

    <div className="flex items-center justify-between">

      <div>
        <h2 className="font-bold text-lg">
          My Calendar
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Birthdays and company holidays
        </p>
      </div>

      <CalendarDays
        size={22}
        className="text-gray-500"
      />

    </div>

  </div>


  <div className="p-6">

    {/* MONTH NAVIGATION */}

    <div className="flex items-center justify-between mb-5">

      <button
        type="button"
        onClick={previousMonth}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
      >
        <ChevronLeft size={18} />
      </button>


      <div className="text-center">

        <p className="font-semibold text-gray-900">
          {monthName} {currentYear}
        </p>

        <button
          type="button"
          onClick={goToToday}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          Today
        </button>

      </div>


      <button
        type="button"
        onClick={nextMonth}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
      >
        <ChevronRight size={18} />
      </button>

    </div>


    {/* WEEK DAYS */}

    <div className="grid grid-cols-7 mb-2">

      {[
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ].map((day) => (
        <div
          key={day}
          className="py-2 text-center text-xs font-medium text-gray-400"
        >
          {day}
        </div>
      ))}

    </div>


    {/* CALENDAR */}

    <div className="grid grid-cols-7 gap-1">

      {/* EMPTY DAYS */}

      {Array.from({
        length: firstDay,
      }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className="min-h-[65px]"
        />
      ))}


      {/* MONTH DAYS */}

      {Array.from({
        length: daysInMonth,
      }).map((_, index) => {

        const day = index + 1;

        const dayEvents =
          getEventsForDay(day);

        const now =
          new Date();

        const isToday =
          now.getDate() === day &&
          now.getMonth() ===
            currentMonth &&
          now.getFullYear() ===
            currentYear;

        return (
          <div
            key={day}
            className={`min-h-[65px] rounded-lg border p-1.5 ${
              isToday
                ? "border-gray-900 bg-gray-50"
                : "border-gray-100"
            }`}
          >

            <div
              className={`mb-1 text-xs font-semibold ${
                isToday
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {day}
            </div>


            <div className="space-y-1">

              {dayEvents
                .slice(0, 2)
                .map((event) => (

                  <div
                    key={event.id}
                    title={
                      event.description ||
                      event.title
                    }
                    className={`flex items-center gap-1 rounded px-1 py-1 text-[9px] truncate ${
                      event.type ===
                      "birthday"
                        ? "bg-pink-50 text-pink-600 border border-pink-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >

                    {event.type ===
                    "birthday" ? (
                      <Cake
                        size={11}
                      />
                    ) : (
                      <Star
                        size={11}
                      />
                    )}

                    <span className="truncate">
                      {event.title}
                    </span>

                  </div>

                ))}

              {dayEvents.length > 2 && (
                <span className="text-[9px] text-gray-400 px-1">
                  +
                  {dayEvents.length - 2}{" "}
                  more
                </span>
              )}

            </div>

          </div>
        );
      })}

    </div>


    {/* THIS MONTH */}

    <div className="mt-5 border-t pt-5">

      <div className="flex items-center justify-between mb-3">

        <h3 className="font-semibold text-gray-900">
          This Month
        </h3>

        <span className="text-xs text-gray-400">
          {calendarEvents.filter((event) => {
            const date = new Date(
              event.date
            );

            return (
              date.getMonth() ===
                currentMonth &&
              date.getFullYear() ===
                currentYear
            );
          }).length}{" "}
          events
        </span>

      </div>


      {calendarEvents
        .filter((event) => {
          const date = new Date(
            event.date
          );

          return (
            date.getMonth() ===
              currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        })
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .slice(0, 5)
        .map((event) => {

          const date = new Date(
            event.date
          );

          return (
            <div
              key={event.id}
              className={`mb-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                event.type ===
                "birthday"
                  ? "border-pink-100 bg-pink-50"
                  : "border-blue-100 bg-blue-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">

                  {event.type ===
                  "birthday" ? (
                    <Cake
                      size={16}
                      className="text-pink-600"
                    />
                  ) : (
                    <Star
                      size={16}
                      className="text-blue-600"
                    />
                  )}

                </div>

                <div>

                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {event.type ===
                    "birthday"
                      ? "Birthday"
                      : "Company Holiday"}
                  </p>

                </div>

              </div>


              <div className="text-right">

                <p className="text-sm font-semibold text-gray-900">
                  {date.getDate()}
                </p>

                <p className="text-[10px] text-gray-400">
                  {date.toLocaleString(
                    "default",
                    {
                      month: "short",
                    }
                  )}
                </p>

              </div>

            </div>
          );
        })}


      {calendarEvents.filter((event) => {
        const date = new Date(
          event.date
        );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }).length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500">
          No birthdays or holidays this month.
        </p>
      )}

    </div>


    {/* LEGEND */}

    <div className="mt-4 flex gap-3 border-t pt-4">

      <span className="flex items-center gap-1 rounded-lg bg-pink-50 px-2.5 py-1.5 text-xs text-pink-600">
        <Cake size={13} />
        Birthday
      </span>

      <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs text-blue-600">
        <Star size={13} />
        Holiday
      </span>

    </div>

  </div>

</div>

          </section>

        </div>

      </main>

    </div>
  );
}

// ==================================================
// INFO ITEM
// ==================================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="mb-1 text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-gray-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}