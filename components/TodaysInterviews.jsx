"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Check,
  Plus,
  Trash2,
  Circle,
  Clock3,
  ListTodo,
  CalendarDays,
  UserRound,
} from "lucide-react";

export default function TodaysInterviews() {
  // ==================================================
  // REMINDERS
  // ==================================================

  const [reminders, setReminders] = useState([]);

  const [newReminder, setNewReminder] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [reminderLoading, setReminderLoading] =
    useState(false);

  // ==================================================
  // EMPLOYEES
  // ==================================================

  const [employees, setEmployees] = useState([]);

  // ==================================================
  // LEAVES
  // ==================================================

  const [leaves, setLeaves] = useState([]);

  const [leaveForm, setLeaveForm] = useState({
  employeeId: "",
  leaveType: "CL",
  date: "",
  fromDate: "",
  toDate: "",
  reason: "",
});

  const [leaveLoading, setLeaveLoading] =
    useState(false);

  const [leaveError, setLeaveError] =
    useState("");

  // ==================================================
  // MONTH FILTER
  // ==================================================

  const getCurrentMonth = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());

  // ==================================================
  // LOAD REMINDERS
  // ==================================================

  const loadReminders = async () => {
    try {
      const response = await fetch(
        "/api/hr-reminders"
      );

      const data = await response.json();

      if (response.ok) {
        setReminders(
          data.reminders || []
        );
      }
    } catch (error) {
      console.error(
        "Load reminders error:",
        error
      );
    }
  };

  // ==================================================
  // LOAD EMPLOYEES
  // ==================================================

  const loadEmployees = async () => {
    try {
      const response = await fetch(
        "/api/employee/list"
      );

      const data = await response.json();

      if (response.ok) {
        setEmployees(
          data.employees ||
            data.data ||
            []
        );
      }
    } catch (error) {
      console.error(
        "Load employees error:",
        error
      );
    }
  };

  // ==================================================
  // LOAD LEAVES
  // ==================================================

  const loadLeaves = async () => {
    try {
      const response = await fetch(
        "/api/leave"
      );

      const data = await response.json();

      if (response.ok) {
        setLeaves(
          data.leaves || []
        );
      }
    } catch (error) {
      console.error(
        "Load leaves error:",
        error
      );
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadReminders();
    loadEmployees();
    loadLeaves();
  }, []);

  // ==================================================
  // ADD REMINDER
  // ==================================================

  const addReminder = async (e) => {
    e.preventDefault();

    if (!newReminder.trim()) {
      return;
    }

    try {
      setReminderLoading(true);

      const response = await fetch(
        "/api/hr-reminders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              newReminder.trim(),

            priority,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add reminder"
        );

        return;
      }

      setNewReminder("");
      setPriority("Medium");

      await loadReminders();
    } catch (error) {
      console.error(
        "Add reminder error:",
        error
      );

      alert(
        "Unable to add reminder"
      );
    } finally {
      setReminderLoading(false);
    }
  };

  // ==================================================
  // TOGGLE REMINDER
  // ==================================================

  const toggleReminder = async (
    reminder
  ) => {
    try {
      const response = await fetch(
        `/api/hr-reminders/${reminder._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            completed:
              !reminder.completed,
          }),
        }
      );

      if (response.ok) {
        await loadReminders();
      }
    } catch (error) {
      console.error(
        "Toggle reminder error:",
        error
      );
    }
  };

  // ==================================================
  // DELETE REMINDER
  // ==================================================

  const deleteReminder = async (id) => {
    try {
      const response = await fetch(
        `/api/hr-reminders/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await loadReminders();
      }
    } catch (error) {
      console.error(
        "Delete reminder error:",
        error
      );
    }
  };

  // ==================================================
  // HANDLE LEAVE CHANGE
  // ==================================================

  const handleLeaveChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setLeaveForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLeaveError("");
  };

  // ==================================================
  // ADD EMPLOYEE LEAVE
  // ==================================================

  const addEmployeeLeave = async (e) => {
  e.preventDefault();

  setLeaveError("");

  if (!leaveForm.employeeId) {
    setLeaveError("Please select an employee");
    return;
  }

  if (!leaveForm.reason.trim()) {
    setLeaveError("Please enter a reason");
    return;
  }

  // ==================================================
  // PL VALIDATION
  // ==================================================

  if (leaveForm.leaveType === "PL") {
    if (!leaveForm.fromDate) {
      setLeaveError("Please select PL start date");
      return;
    }

    if (!leaveForm.toDate) {
      setLeaveError("Please select PL end date");
      return;
    }

    const startDate = new Date(
      `${leaveForm.fromDate}T00:00:00`
    );

    const endDate = new Date(
      `${leaveForm.toDate}T00:00:00`
    );

    if (endDate < startDate) {
      setLeaveError(
        "PL end date cannot be before start date"
      );
      return;
    }

    const difference =
      Math.floor(
        (endDate - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (difference > 6) {
      setLeaveError(
        "Privilege Leave can be maximum 6 days."
      );
      return;
    }
  }

  // ==================================================
  // CL / SL / LOP VALIDATION
  // ==================================================

  if (leaveForm.leaveType !== "PL") {
    if (!leaveForm.date) {
      setLeaveError("Please select a date");
      return;
    }
  }

  try {
    setLeaveLoading(true);

    const body = {
      employeeId: leaveForm.employeeId,
      leaveType: leaveForm.leaveType,
      reason: leaveForm.reason.trim(),
    };

    // ==================================================
    // PL
    // ==================================================

    if (leaveForm.leaveType === "PL") {
      body.fromDate = leaveForm.fromDate;
      body.toDate = leaveForm.toDate;
    }

    // ==================================================
    // CL / SL / LOP
    // ==================================================

    else {
      body.date = leaveForm.date;
    }

    const response = await fetch(
      "/api/leave/hr",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setLeaveError(
        data.message ||
          "Unable to add leave"
      );

      return;
    }

    setLeaveForm({
      employeeId: "",
      leaveType: "CL",
      date: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    await loadLeaves();
  } catch (error) {
    console.error(
      "Add employee leave error:",
      error
    );

    setLeaveError(
      "Unable to add employee leave"
    );
  } finally {
    setLeaveLoading(false);
  }
};

  // ==================================================
  // COUNTS
  // ==================================================

  const completedCount = useMemo(() => {
    return reminders.filter(
      (item) => item.completed
    ).length;
  }, [reminders]);

  const pendingCount =
    reminders.length -
    completedCount;

  // ==================================================
  // PRIORITY STYLE
  // ==================================================

  const getPriorityStyle = (value) => {
    if (value === "High") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (value === "Medium") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }

    return "bg-blue-50 text-blue-600 border-blue-100";
  };

  // ==================================================
  // LEAVE STYLE
  // ==================================================

 const getLeaveStyle = (leaveType) => {
  if (leaveType === "LOP") {
    return "bg-red-50 text-red-600 border-red-100";
  }

  if (leaveType === "SL") {
    return "bg-blue-50 text-blue-600 border-blue-100";
  }

  if (leaveType === "PL") {
    return "bg-purple-50 text-purple-600 border-purple-100";
  }

  return "bg-green-50 text-green-600 border-green-100";
};

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // GET EMPLOYEE ID
  // Supports both:
  // employeeId: "123"
  // employeeId: { _id: "123", employeeFullName: "..." }
  // ==================================================

  const getEmployeeId = (employeeId) => {
    if (!employeeId) {
      return "";
    }

    if (
      typeof employeeId ===
      "object"
    ) {
      return String(
        employeeId._id || ""
      );
    }

    return String(employeeId);
  };

  // ==================================================
  // EMPLOYEE NAME
  // ==================================================

  const getEmployeeName = (
    employeeId
  ) => {
    // If API populated employeeId
    if (
      employeeId &&
      typeof employeeId ===
        "object"
    ) {
      return (
        employeeId.employeeFullName ||
        employeeId.name ||
        employeeId.fullName ||
        "Employee"
      );
    }

    const id =
      getEmployeeId(employeeId);

    const employee =
      employees.find(
        (item) =>
          String(item._id) === id
      );

    return (
      employee?.employeeFullName ||
      employee?.name ||
      employee?.fullName ||
      "Employee"
    );
  };

  // ==================================================
  // FILTER APPROVED LEAVES BY MONTH
  // ==================================================

const filteredLeaves = useMemo(() => {
  return leaves
    .filter(
      (leave) =>
        leave.status === "Approved"
    )
    .filter((leave) => {
      if (!leave.fromDate) {
        return false;
      }

      const [year, month] =
        selectedMonth
          .split("-")
          .map(Number);

      const monthStart = new Date(
        year,
        month - 1,
        1,
        0,
        0,
        0,
        0
      );

      const monthEnd = new Date(
        year,
        month,
        0,
        23,
        59,
        59,
        999
      );

      const leaveStart = new Date(
        leave.fromDate
      );

      const leaveEnd = new Date(
        leave.toDate ||
          leave.fromDate
      );

      return (
        leaveStart <= monthEnd &&
        leaveEnd >= monthStart
      );
    })
    .sort(
      (a, b) =>
        new Date(b.fromDate) -
        new Date(a.fromDate)
    );
}, [
  leaves,
  selectedMonth,
]);

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          HR REMINDERS
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-6 pb-4">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ListTodo size={22} />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  HR Tasks & Reminders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Keep track of your pending HR work
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-gray-900">
                {pendingCount}
              </p>

              <p className="text-xs text-gray-400">
                Pending
              </p>

            </div>

          </div>

        </div>

        <div className="px-6 pb-5">

          <div className="flex items-center justify-between text-xs mb-2">

            <span className="text-gray-500">
              Today's Progress
            </span>

            <span className="font-medium text-gray-700">
              {completedCount}/
              {reminders.length}
            </span>

          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width:
                  reminders.length > 0
                    ? `${
                        (completedCount /
                          reminders.length) *
                        100
                      }%`
                    : "0%",
              }}
            />

          </div>

        </div>

        <div className="border-t border-gray-100 p-5 bg-gray-50/70">

          <form
            onSubmit={addReminder}
            className="space-y-3"
          >

            <div className="flex gap-2">

              <input
                type="text"
                value={
                  newReminder
                }
                onChange={(e) =>
                  setNewReminder(
                    e.target.value
                  )
                }
                placeholder="Add HR task or reminder..."
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={
                  reminderLoading
                }
                className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shrink-0 disabled:opacity-60"
              >
                <Plus size={20} />
              </button>

            </div>

            <div className="flex items-center gap-2">

              <span className="text-xs text-gray-500">
                Priority:
              </span>

              {[
                "Low",
                "Medium",
                "High",
              ].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPriority(
                        item
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      priority ===
                      item
                        ? getPriorityStyle(
                            item
                          )
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

          </form>

        </div>

        <div className="p-5">

          {reminders.length ===
          0 ? (
            <div className="py-8 text-center">

              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center">

                <Clock3
                  size={21}
                  className="text-gray-400"
                />

              </div>

              <h3 className="mt-3 text-sm font-semibold text-gray-800">
                No reminders yet
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Add your HR work above.
              </p>

            </div>
          ) : (
            <div className="space-y-2">

              {reminders.map(
                (reminder) => (
                  <div
                    key={
                      reminder._id
                    }
                    className={`group flex items-center gap-3 p-3 rounded-xl border ${
                      reminder.completed
                        ? "bg-gray-50 border-gray-100"
                        : "bg-white border-gray-100"
                    }`}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleReminder(
                          reminder
                        )
                      }
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                        reminder.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 text-transparent hover:border-blue-500"
                      }`}
                    >
                      {reminder.completed ? (
                        <Check
                          size={15}
                        />
                      ) : (
                        <Circle
                          size={15}
                        />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">

                      <p
                        className={`text-sm font-medium ${
                          reminder.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {
                          reminder.title
                        }
                      </p>

                      <div className="mt-1 flex items-center gap-2">

                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${getPriorityStyle(
                            reminder.priority
                          )}`}
                        >
                          {
                            reminder.priority
                          }
                        </span>

                        <span className="text-[11px] text-gray-400">
                          HR Reminder
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteReminder(
                          reminder._id
                        )
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          EMPLOYEE LEAVE / ABSENCE
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <CalendarDays
                  size={22}
                />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Employee Leave / Absence
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add leave directly for an employee
                </p>

              </div>

            </div>

            {/* MONTH FILTER */}

            <div>

              <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Month
              </label>

              <input
                type="month"
                value={
                  selectedMonth
                }
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-orange-500"
              />

            </div>

          </div>

        </div>

        {/* FORM */}

        <div className="border-t border-gray-100 bg-gray-50/70 p-5">

          {leaveError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {leaveError}
            </div>
          )}

          <form
            onSubmit={
              addEmployeeLeave
            }
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            {/* EMPLOYEE */}

            <div>

              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Employee
              </label>

              <select
                name="employeeId"
                value={
                  leaveForm.employeeId
                }
                onChange={
                  handleLeaveChange
                }
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-blue-500"
              >

                <option value="">
                  Select employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={
                        employee._id
                      }
                      value={
                        employee._id
                      }
                    >
                      {
                        employee.employeeFullName
                      }{" "}
                      -{" "}
                      {
                        employee.employeeCode
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            {/* LEAVE TYPE */}

           <div>

  <label className="block text-xs font-semibold text-gray-600 mb-2">
    Leave Type
  </label>

  <select
    name="leaveType"
    value={leaveForm.leaveType}
    onChange={handleLeaveChange}
    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-blue-500"
  >

    <option value="CL">
      CL - Casual Leave
    </option>

    <option value="SL">
      SL - Sick Leave
    </option>

    <option value="PL">
      PL - Privilege Leave
    </option>

    <option value="LOP">
      LOP - Leave Without Pay
    </option>

  </select>

  {leaveForm.leaveType === "PL" && (
    <p className="text-[11px] text-purple-600 mt-2">
      Privilege Leave can be taken once per year and can be
      maximum 6 days.
    </p>
  )}

</div>
            {/* DATE */}

        {/* DATE */}

{leaveForm.leaveType !== "PL" ? (
  <div>

    <label className="block text-xs font-semibold text-gray-600 mb-2">
      Date
    </label>

    <input
      type="date"
      name="date"
      value={leaveForm.date}
      onChange={handleLeaveChange}
      required
      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-blue-500"
    />

  </div>
) : (
  <>
    {/* FROM DATE */}

    <div>

      <label className="block text-xs font-semibold text-gray-600 mb-2">
        From Date
      </label>

      <input
        type="date"
        name="fromDate"
        value={leaveForm.fromDate}
        onChange={handleLeaveChange}
        min={`${new Date().getFullYear()}-01-01`}
        required
        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-purple-500"
      />

    </div>

    {/* TO DATE */}

    <div>

      <label className="block text-xs font-semibold text-gray-600 mb-2">
        To Date
      </label>

      <input
        type="date"
        name="toDate"
        value={leaveForm.toDate}
        onChange={handleLeaveChange}
        min={leaveForm.fromDate || undefined}
        required
        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-purple-500"
      />

    </div>
  </>
)}

            {/* REASON */}

            <div className="md:col-span-2">

              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Reason
              </label>

              <input
                type="text"
                name="reason"
                value={
                  leaveForm.reason
                }
                onChange={
                  handleLeaveChange
                }
                placeholder="Reason for leave..."
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-blue-500"
              />

            </div>

            {/* BUTTON */}

            <div className="flex items-end">

              <button
                type="submit"
                disabled={
                  leaveLoading
                }
                className="w-full px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold disabled:opacity-60"
              >
                {leaveLoading
                  ? "Adding..."
                  : "Add Leave"}
              </button>

            </div>

          </form>

        </div>

        {/* LEAVE LIST */}

        <div className="p-5">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h3 className="text-sm font-semibold text-gray-800">
                Employee Leave
              </h3>

              <p className="text-[11px] text-gray-400 mt-1">
                Showing approved leaves for{" "}
                {selectedMonth}
              </p>

            </div>

            <span className="text-xs text-gray-400">
              {
                filteredLeaves.length
              }{" "}
              Approved
            </span>

          </div>

          {filteredLeaves.length ===
          0 ? (
            <div className="py-8 text-center">

              <div className="w-11 h-11 rounded-full bg-gray-100 mx-auto flex items-center justify-center">

                <UserRound
                  size={19}
                  className="text-gray-400"
                />

              </div>

              <p className="text-sm font-medium text-gray-700 mt-3">
                No employee leave
              </p>

              <p className="text-xs text-gray-400 mt-1">
                No approved leave for this month.
              </p>

            </div>
          ) : (
            <div className="space-y-2">

              {filteredLeaves.map(
                (leave) => (
                  <div
                    key={
                      leave._id
                    }
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                  >

                    {/* ICON */}

                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">

                      <UserRound
                        size={17}
                        className="text-gray-500"
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2 flex-wrap">

                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {
                            getEmployeeName(
                              leave.employeeId
                            )
                          }
                        </p>

                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getLeaveStyle(
                            leave.leaveType
                          )}`}
                        >
                          {
                            leave.leaveType
                          }
                        </span>

                      </div>

                     <div className="flex items-center gap-2 mt-1 min-w-0">

  <span className="text-[11px] text-gray-400 shrink-0">

    {leave.leaveType === "PL" &&
    leave.toDate &&
    leave.toDate !== leave.fromDate
      ? `${formatDate(
          leave.fromDate
        )} - ${formatDate(
          leave.toDate
        )}`
      : formatDate(
          leave.fromDate
        )}

  </span>

  <span className="text-[11px] text-gray-300 shrink-0">
    •
  </span>

  <span
    className="text-[11px] text-gray-500 truncate"
    title={leave.reason}
  >
    {leave.reason}
  </span>

</div>

                    </div>

                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-md shrink-0">
                      Approved
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}