"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Cake,
  CalendarDays,
  Star,
} from "lucide-react";

export default function RecentCandidates() {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [holidays, setHolidays] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ========================================
  // DATE
  // ========================================

  const currentYear =
    currentDate.getFullYear();

  const currentMonth =
    currentDate.getMonth();

  const monthName =
    currentDate.toLocaleString("default", {
      month: "long",
    });

  // ========================================
  // LOAD HOLIDAYS + EMPLOYEES
  // ========================================

  useEffect(() => {
    loadCalendarData();
  }, [currentYear]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);

      const [holidayRes, employeeRes] =
        await Promise.all([
          axios.get(
            `/api/holiday?year=${currentYear}`
          ),

          axios.get(
            "/api/employee/list"
          ),
        ]);

      // HOLIDAYS
      const holidayList =
        holidayRes.data?.holidays || [];

      setHolidays(
        Array.isArray(holidayList)
          ? holidayList
          : []
      );

      // EMPLOYEES
      const employeeList =
        employeeRes.data?.employees ||
        employeeRes.data?.data ||
        employeeRes.data ||
        [];

      setEmployees(
        Array.isArray(employeeList)
          ? employeeList
          : []
      );
    } catch (error) {
      console.error(
        "Calendar loading error:",
        error
      );

      setHolidays([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CALENDAR DAYS
  // ========================================

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  // ========================================
  // CREATE EVENTS
  // ========================================

  const events = useMemo(() => {
    const calendarEvents = [];

    // ----------------------------------------
    // HOLIDAYS
    // ----------------------------------------

    holidays.forEach((holiday) => {
      if (!holiday.date) return;

      const date = new Date(
        holiday.date
      );

      if (Number.isNaN(date.getTime())) {
        return;
      }

      calendarEvents.push({
        id: `holiday-${holiday._id}`,
        title:
          holiday.name ||
          "Holiday",
        date,
        type: "holiday",
        description:
          holiday.description || "",
        paid: holiday.paid,
        holidayType:
          holiday.type ||
          "Company Holiday",
      });
    });

    // ----------------------------------------
    // EMPLOYEE BIRTHDAYS
    // ----------------------------------------

    employees.forEach((employee) => {
      if (!employee.dateOfBirth) {
        return;
      }

      const dob = new Date(
        employee.dateOfBirth
      );

      if (Number.isNaN(dob.getTime())) {
        return;
      }

      const birthMonth =
        dob.getUTCMonth();

      const birthDay =
        dob.getUTCDate();

      const birthday =
        new Date(
          currentYear,
          birthMonth,
          birthDay
        );

      calendarEvents.push({
        id: `birthday-${employee._id}`,
        title:
          `${employee.employeeFullName}'s Birthday`,
        date: birthday,
        type: "birthday",
        person:
          employee.employeeFullName,
        employeeCode:
          employee.employeeCode || "",
        designation:
          employee.designation || "",
      });
    });

    return calendarEvents;
  }, [
    holidays,
    employees,
    currentYear,
  ]);

  // ========================================
  // CURRENT MONTH EVENTS
  // ========================================

  const monthEvents = useMemo(() => {
    return events
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
      );
  }, [
    events,
    currentMonth,
    currentYear,
  ]);

  // ========================================
  // EVENTS FOR DAY
  // ========================================

  const getEventsForDay = (day) => {
    return monthEvents.filter(
      (event) => {
        const date = new Date(
          event.date
        );

        return date.getDate() === day;
      }
    );
  };

  // ========================================
  // MONTH NAVIGATION
  // ========================================

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // ========================================
  // EVENT STYLE
  // ========================================

  const getEventColor = (type) => {
    if (type === "birthday") {
      return "bg-pink-50 text-pink-600 border-pink-100";
    }

    if (type === "holiday") {
      return "bg-blue-50 text-blue-600 border-blue-100";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const getEventIcon = (type) => {
    if (type === "birthday") {
      return <Cake size={13} />;
    }

    return <Star size={13} />;
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <CalendarDays
            size={22}
            className="text-gray-500"
          />

          <div>
            <h2 className="font-bold text-lg">
              HR Calendar
            </h2>

            <p className="text-sm text-gray-500">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="font-bold text-lg">
            HR Calendar
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Birthdays & holidays
          </p>
        </div>

        <CalendarDays
          size={21}
          className="text-gray-500"
        />
      </div>

      {/* ========================================
          MONTH HEADER
      ======================================== */}

      <div className="flex items-center justify-between mb-4">

        <button
          type="button"
          onClick={previousMonth}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
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
            className="text-xs text-blue-600 hover:underline"
          >
            Today
          </button>

        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* ========================================
          WEEK DAYS
      ======================================== */}

      <div className="grid grid-cols-7 mb-1">

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
            className="text-center text-[11px] font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

      </div>

      {/* ========================================
          CALENDAR
      ======================================== */}

      <div className="grid grid-cols-7 gap-1">

        {/* EMPTY CELLS */}

        {Array.from({
          length: firstDay,
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="min-h-[60px]"
          />
        ))}

        {/* DAYS */}

        {Array.from({
          length: daysInMonth,
        }).map((_, index) => {
          const day = index + 1;

          const dayEvents =
            getEventsForDay(day);

          const today =
            new Date();

          const isToday =
            today.getDate() === day &&
            today.getMonth() ===
              currentMonth &&
            today.getFullYear() ===
              currentYear;

          return (
            <div
              key={day}
              className={`min-h-[60px] rounded-lg border p-1.5 ${
                isToday
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-100"
              }`}
            >

              <div
                className={`text-xs font-semibold mb-1 ${
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
                        event.description
                          ? `${event.title} - ${event.description}`
                          : event.title
                      }
                      className={`flex items-center gap-1 rounded px-1 py-1 border text-[9px] truncate ${getEventColor(
                        event.type
                      )}`}
                    >

                      {getEventIcon(
                        event.type
                      )}

                      <span className="truncate">
                        {event.type ===
                        "birthday"
                          ? event.person
                          : event.title}
                      </span>

                    </div>
                  ))}

                {dayEvents.length > 2 && (
                  <p className="text-[9px] text-gray-400 px-1">
                    +
                    {dayEvents.length - 2}{" "}
                    more
                  </p>
                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* ========================================
          THIS MONTH
      ======================================== */}

      <div className="mt-6 border-t pt-5">

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-semibold text-gray-900">
            This Month
          </h3>

          <span className="text-xs text-gray-400">
            {monthEvents.length}{" "}
            {monthEvents.length === 1
              ? "event"
              : "events"}
          </span>

        </div>

        {monthEvents.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-5">
            No birthdays or holidays this month.
          </div>
        ) : (
          <div className="space-y-3">

            {monthEvents.map((event) => {
              const date = new Date(
                event.date
              );

              return (
                <div
                  key={event.id}
                  className={`flex items-center justify-between border rounded-xl px-4 py-3 ${getEventColor(
                    event.type
                  )}`}
                >

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                      {getEventIcon(
                        event.type
                      )}
                    </div>

                    <div>

                      <p className="text-sm font-medium">
                        {event.title}
                      </p>

                      {event.type ===
                        "birthday" && (
                        <p className="text-xs opacity-70">
                          Birthday
                          {event.designation
                            ? ` • ${event.designation}`
                            : ""}
                        </p>
                      )}

                      {event.type ===
                        "holiday" && (
                        <p className="text-xs opacity-70">
                          {event.holidayType}
                          {event.paid ===
                          true
                            ? " • Paid"
                            : ""}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold text-sm">
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

          </div>
        )}

      </div>

      {/* ========================================
          LEGEND
      ======================================== */}

      <div className="flex gap-3 mt-5 pt-4 border-t">

        <span className="flex items-center gap-1.5 text-xs text-pink-600 bg-pink-50 px-2.5 py-1.5 rounded-lg">
          <Cake size={13} />
          Birthday
        </span>

        <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg">
          <Star size={13} />
          Holiday
        </span>

      </div>

    </div>
  );
}