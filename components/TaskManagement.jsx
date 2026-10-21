
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES = ["Pending", "In Progress", "Completed", "On Hold"];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-600";

function employeeIdOf(employee) {
  return String(employee?._id || employee?.id || "");
}

function employeeNameOf(employee) {
  return (
    employee?.employeeFullName ||
    employee?.name ||
    employee?.employeeCode ||
    "Employee"
  );
}

function dateValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCSV(filename, rows) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "On Hold": "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] || styles.Pending
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

export default function TaskManagement() {
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  const [currentEmployeeName, setCurrentEmployeeName] = useState("Employee");
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("received");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTaskId, setSavingTaskId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);

  const [form, setForm] = useState({
    assignedToId: "",
    taskTitle: "",
    description: "",
    assignedDate: dateValue(new Date()),
    deadline: "",
    assignedQuantity: "1",
  });

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("employeeData");
      const storedId = localStorage.getItem("employeeId");
      const employee = storedData ? JSON.parse(storedData) : null;

      setCurrentEmployeeId(
        String(storedId || employee?._id || employee?.id || "")
      );
      setCurrentEmployeeName(employeeNameOf(employee));
    } catch {
      setError("Unable to read employee login details.");
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const response = await fetch("/api/employee/list", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to load employees.");
      }

      setEmployees(Array.isArray(data.employees) ? data.employees : []);
    } catch (err) {
      setError(err.message || "Unable to load employees.");
    }
  }, []);

  const loadTasks = useCallback(async () => {
    if (!currentEmployeeId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/tasks?employeeId=${encodeURIComponent(currentEmployeeId)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load tasks.");
      }

      setTasks(data.tasks || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [currentEmployeeId]);

  useEffect(() => {
    if (!currentEmployeeId) return;

    loadEmployees();
    loadTasks();
  }, [currentEmployeeId, loadEmployees, loadTasks]);

  const myWork = useMemo(
    () =>
      tasks.filter(
        (task) => String(task.assignedToId) === currentEmployeeId
      ),
    [tasks, currentEmployeeId]
  );

  const assignedWork = useMemo(
    () =>
      tasks.filter(
        (task) => String(task.assignedById) === currentEmployeeId
      ),
    [tasks, currentEmployeeId]
  );

  const activeTasks = view === "received" ? myWork : assignedWork;

  const visibleTasks = useMemo(() => {
    return activeTasks.filter((task) => {
      const text = [
        task.taskTitle,
        task.description,
        task.assignedByName,
        task.assignedToName,
        task.remarks,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activeTasks, search, statusFilter]);

  const counts = useMemo(
    () => ({
      total: activeTasks.length,
      pending: activeTasks.filter((task) => task.status === "Pending").length,
      progress: activeTasks.filter(
        (task) => task.status === "In Progress"
      ).length,
      completed: activeTasks.filter(
        (task) => task.status === "Completed"
      ).length,
    }),
    [activeTasks]
  );

  function changeForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function changeTask(taskId, field, value) {
    setTasks((previous) =>
      previous.map((task) =>
        String(task._id) === String(taskId)
          ? { ...task, [field]: value }
          : task
      )
    );
  }

  async function createTask(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!currentEmployeeId) {
      setError("Please log in through the employee panel.");
      return;
    }

    if (!form.assignedToId || !form.taskTitle.trim()) {
      setError("Select an employee and enter the task title.");
      return;
    }

    const quantity = Number(form.assignedQuantity);

    if (!Number.isFinite(quantity) || quantity < 0) {
      setError("Enter a valid assigned quantity.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedById: currentEmployeeId,
          assignedToId: form.assignedToId,
          taskTitle: form.taskTitle.trim(),
          description: form.description,
          assignedDate: form.assignedDate || dateValue(new Date()),
          deadline: form.deadline || null,
          assignedQuantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to assign work.");
      }

      setForm({
        assignedToId: "",
        taskTitle: "",
        description: "",
        assignedDate: dateValue(new Date()),
        deadline: "",
        assignedQuantity: "1",
      });

      setShowAssignForm(false);
      setView("assigned");
      setStatusFilter("All");
      setSearch("");
      setMessage("Work assigned successfully.");

      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to assign work.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTask(task) {
    setError("");
    setMessage("");
    setSavingTaskId(String(task._id));

    const isAssigner =
      String(task.assignedById) === currentEmployeeId;

    const isAssignee =
      String(task.assignedToId) === currentEmployeeId;

    const payload = { updatedById: currentEmployeeId };

    if (isAssigner) {
      payload.taskTitle = task.taskTitle;
      payload.description = task.description || "";
      payload.assignedDate = dateValue(task.assignedDate);
      payload.deadline = task.deadline
        ? dateValue(task.deadline)
        : null;
      payload.assignedQuantity = Number(task.assignedQuantity);
      payload.approvedQuantity = Number(task.approvedQuantity || 0);
    }

    if (isAssignee) {
      payload.completedQuantity = Number(task.completedQuantity || 0);
      payload.startTime = task.startTime || "";
      payload.endTime = task.endTime || "";
      payload.status = task.status;
      payload.remarks = task.remarks || "";
    }

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save task.");
      }

      setMessage("Task updated successfully.");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to save task.");
    } finally {
      setSavingTaskId("");
    }
  }

  function exportMySheet() {
    const rows = [
      [
        "Date",
        "Assigned By",
        "Task",
        "Instructions",
        "Deadline",
        "Assigned Quantity",
        "Completed Quantity",
        "Approved Quantity",
        "Start Time",
        "End Time",
        "Status",
        "Remarks",
      ],
      ...visibleTasks.map((task) => [
        dateValue(task.assignedDate),
        task.assignedByName,
        task.taskTitle,
        task.description,
        dateValue(task.deadline),
        task.assignedQuantity,
        task.completedQuantity,
        task.approvedQuantity,
        task.startTime,
        task.endTime,
        task.status,
        task.remarks,
      ]),
    ];

    downloadCSV(
      `my-daily-work-${dateValue(new Date())}.csv`,
      rows
    );
  }

  function exportAssignedSheet() {
    const rows = [
      [
        "Date",
        "Assigned To",
        "Task",
        "Instructions",
        "Deadline",
        "Assigned Quantity",
        "Completed Quantity",
        "Approved Quantity",
        "Status",
        "Remarks",
      ],
      ...visibleTasks.map((task) => [
        dateValue(task.assignedDate),
        task.assignedToName,
        task.taskTitle,
        task.description,
        dateValue(task.deadline),
        task.assignedQuantity,
        task.completedQuantity,
        task.approvedQuantity,
        task.status,
        task.remarks,
      ]),
    ];

    downloadCSV(
      `work-assigned-${dateValue(new Date())}.csv`,
      rows
    );
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.taskTitle}"?`)) return;

    try {
      const response = await fetch(
        `/api/tasks/${task._id}?employeeId=${encodeURIComponent(currentEmployeeId)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete task.");
      }

      setMessage("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  }

  if (!currentEmployeeId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-slate-800">
          Employee login required
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Log in through your employee panel to access task management.
        </p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 pb-8 p-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            WORKSPACE / DAILY TRACKER
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Task Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome, {currentEmployeeName}. Track your work and team assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAssignForm((previous) => !previous);
            setError("");
            setMessage("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <span className="text-lg leading-none">+</span>
          Assign New Work
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Assignment form */}
      {showAssignForm && (
        <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Assign New Work
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The task will appear in the selected employee's daily sheet.
            </p>
          </div>

          <form onSubmit={createTask} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Assign To *</label>
              <select
                className={inputClass}
                value={form.assignedToId}
                onChange={(event) =>
                  changeForm("assignedToId", event.target.value)
                }
                required
              >
                <option value="">Select employee</option>
                {employees
                  .filter(
                    (employee) =>
                      employeeIdOf(employee) !== currentEmployeeId &&
                      (!employee.employeeStatus ||
                        employee.employeeStatus === "Active")
                  )
                  .map((employee) => (
                    <option
                      key={employeeIdOf(employee)}
                      value={employeeIdOf(employee)}
                    >
                      {employeeNameOf(employee)}
                      {employee.employeeCode
                        ? ` (${employee.employeeCode})`
                        : ""}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Task Title *</label>
              <input
                className={inputClass}
                value={form.taskTitle}
                onChange={(event) =>
                  changeForm("taskTitle", event.target.value)
                }
                placeholder="e.g. Design Instagram posts"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Instructions</label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={(event) =>
                  changeForm("description", event.target.value)
                }
                placeholder="Explain the required work..."
              />
            </div>

            <div>
              <label className={labelClass}>Assignment Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.assignedDate}
                onChange={(event) =>
                  changeForm("assignedDate", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label className={labelClass}>Deadline</label>
              <input
                type="date"
                className={inputClass}
                value={form.deadline}
                onChange={(event) =>
                  changeForm("deadline", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass}>Quantity Assigned</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.assignedQuantity}
                onChange={(event) =>
                  changeForm("assignedQuantity", event.target.value)
                }
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Assigning..." : "Assign Work"}
              </button>

              <button
                type="button"
                onClick={() => setShowAssignForm(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Separate view toggle */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setView("received");
              setSearch("");
              setStatusFilter("All");
              setMessage("");
              setError("");
            }}
            className={`flex items-center gap-3 rounded-xl p-4 text-left transition ${
              view === "received"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                view === "received" ? "bg-white/15" : "bg-indigo-50"
              }`}
            >
              📋
            </span>
            <span>
              <span className="block font-semibold">My Daily Work Sheet</span>
              <span
                className={`mt-1 block text-xs ${
                  view === "received" ? "text-indigo-100" : "text-slate-400"
                }`}
              >
                Work assigned to me · {myWork.length} tasks
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView("assigned");
              setSearch("");
              setStatusFilter("All");
              setMessage("");
              setError("");
            }}
            className={`flex items-center gap-3 rounded-xl p-4 text-left transition ${
              view === "assigned"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                view === "assigned" ? "bg-white/15" : "bg-violet-50"
              }`}
            >
              ↗
            </span>
            <span>
              <span className="block font-semibold">Work I Assigned</span>
              <span
                className={`mt-1 block text-xs ${
                  view === "assigned" ? "text-indigo-100" : "text-slate-400"
                }`}
              >
                Tasks assigned to colleagues · {assignedWork.length} tasks
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total Tasks",
            value: counts.total,
            icon: "▤",
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            label: "Pending",
            value: counts.pending,
            icon: "◷",
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "In Progress",
            value: counts.progress,
            icon: "↗",
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Completed",
            value: counts.completed,
            icon: "✓",
            color: "text-emerald-600 bg-emerald-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-500">{item.label}</p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold ${item.color}`}
              >
                {item.icon}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Independent tables */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {view === "received"
                  ? "My Daily Work Sheet"
                  : "Work I Assigned"}
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {visibleTasks.length} records
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {view === "received"
                ? "Update your progress and save your daily work."
                : "Monitor colleagues' progress and edit task details."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              className={`${inputClass} sm:w-48`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
            />

            <select
              className={`${inputClass} sm:w-36`}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadTasks}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              onClick={
                view === "received" ? exportMySheet : exportAssignedSheet
              }
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              ↓ Download CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading your work sheet...
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
              {view === "received" ? "📋" : "↗"}
            </div>
            <h3 className="mt-4 font-semibold text-slate-800">
              {search || statusFilter !== "All"
                ? "No matching tasks"
                : view === "received"
                  ? "Your work sheet is empty"
                  : "You haven't assigned any work yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {view === "received"
                ? "When a colleague assigns work to you, it will appear here automatically."
                : "Assign a task to a colleague to track their progress here."}
            </p>
            {view === "assigned" && !search && (
              <button
                type="button"
                onClick={() => setShowAssignForm(true)}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                + Assign New Work
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1700px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  {[
                    "Date",
                    view === "received" ? "Assigned By" : "Assigned To",
                    "Task Details",
                    "Deadline",
                    "Assigned",
                    "Completed",
                    "Approved",
                    "Start Time",
                    "End Time",
                    "Status",
                    "Remarks / Updates",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="border-b border-slate-200 px-3 py-4 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleTasks.map((task) => {
                  const isAssigner =
                    String(task.assignedById) === currentEmployeeId;
                  const isAssignee =
                    String(task.assignedToId) === currentEmployeeId;
                  const isSaving = savingTaskId === String(task._id);

                  return (
                    <tr
                      key={task._id}
                      className="align-top transition hover:bg-indigo-50/30"
                    >
                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="date"
                          className={inputClass}
                          value={dateValue(task.assignedDate)}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "assignedDate",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-3">
                        <p className="font-semibold text-slate-800">
                          {view === "received"
                            ? task.assignedByName
                            : task.assignedToName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {view === "received"
                            ? "Task assigner"
                            : "Responsible employee"}
                        </p>
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          className={inputClass}
                          value={task.taskTitle || ""}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "taskTitle",
                              event.target.value
                            )
                          }
                          placeholder="Task title"
                        />
                        <textarea
                          rows={2}
                          className={`${inputClass} mt-2`}
                          value={task.description || ""}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Instructions"
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="date"
                          className={inputClass}
                          value={dateValue(task.deadline)}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "deadline",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          value={task.assignedQuantity ?? 0}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "assignedQuantity",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          value={task.completedQuantity ?? 0}
                          disabled={!isAssignee}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "completedQuantity",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          value={task.approvedQuantity ?? 0}
                          disabled={!isAssigner}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "approvedQuantity",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="time"
                          className={inputClass}
                          value={task.startTime || ""}
                          disabled={!isAssignee}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "startTime",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <input
                          type="time"
                          className={inputClass}
                          value={task.endTime || ""}
                          disabled={!isAssignee}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "endTime",
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td className="border-b border-slate-100 p-3">
                        {isAssignee ? (
                          <select
                            className={inputClass}
                            value={task.status || "Pending"}
                            onChange={(event) =>
                              changeTask(
                                task._id,
                                "status",
                                event.target.value
                              )
                            }
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={task.status} />
                        )}
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <textarea
                          rows={3}
                          className={inputClass}
                          value={task.remarks || ""}
                          disabled={!isAssignee}
                          onChange={(event) =>
                            changeTask(
                              task._id,
                              "remarks",
                              event.target.value
                            )
                          }
                          placeholder="Progress or remarks..."
                        />
                      </td>

                      <td className="border-b border-slate-100 p-2">
                        <div className="flex min-w-[110px] flex-col gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => saveTask(task)}
                            className="rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>

                          {isAssigner && (
                            <button
                              type="button"
                              onClick={() => deleteTask(task)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 sm:flex-row">
          <span>
            Showing {visibleTasks.length} of {activeTasks.length} tasks
          </span>
          <span>
            {view === "received"
              ? "Your changes are shared with the original assigner."
              : "Progress is saved on the same task record."}
          </span>
        </div>
      </section>
    </div>
  );
}
