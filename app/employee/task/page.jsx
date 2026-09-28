"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Play,
  Pause,
  Users,
  User,
  Paperclip,
  FileText,
  Image as ImageIcon,
  X,
  Download,
} from "lucide-react";

export default function EmployeeTaskPage() {
  const router = useRouter();

  // ========================================
  // NOTIFICATION COUNTS
  // ========================================

  const [unreadCount, setUnreadCount] = useState(0);

  const [teamUnreadCount, setTeamUnreadCount] =
    useState(0);

  // ========================================
  // EMPLOYEE
  // ========================================

  const [employee, setEmployee] = useState(null);

  const [employeeId, setEmployeeId] = useState("");

  // ========================================
  // EMPLOYEES
  // ========================================

  const [employees, setEmployees] = useState([]);

  // ========================================
  // TASKS
  // ========================================

  const [myTasks, setMyTasks] = useState([]);

  const [teamTasks, setTeamTasks] = useState([]);

  // ========================================
  // LOADING
  // ========================================

  const [loadingMyTasks, setLoadingMyTasks] =
    useState(true);

  const [loadingTeamTasks, setLoadingTeamTasks] =
    useState(true);

  const [saving, setSaving] = useState(false);

  // ========================================
  // ACTIVE VIEW
  // ========================================

  const [activeView, setActiveView] =
    useState("myWork");

  const [teamFilter, setTeamFilter] =
    useState("All");

  // ========================================
  // ASSIGN FORM
  // ========================================

  const [form, setForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    taskDate: new Date()
      .toISOString()
      .split("T")[0],
    dueDate: "",
    priority: "Medium",
    attachments: [],
  });

  // ========================================
  // MARK MY TASKS AS SEEN
  // ========================================

  const markMyTasksAsSeen = async () => {
    const unreadTasks = myTasks.filter(
      (task) => !task.seenAt
    );

    if (unreadTasks.length === 0) {
      setUnreadCount(0);
      return;
    }

    try {
      await Promise.all(
        unreadTasks.map((task) =>
          axios.patch(
            `/api/tasks/${task._id}`,
            {
              seen: true,
            }
          )
        )
      );

      setMyTasks((prev) =>
        prev.map((task) =>
          task.seenAt
            ? task
            : {
                ...task,
                seenAt:
                  new Date().toISOString(),
              }
        )
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark tasks as seen:",
        error
      );
    }
  };

  // ========================================
  // UPDATE MY TASK UNREAD COUNT
  // ========================================

  useEffect(() => {
    const count = myTasks.filter(
      (task) => !task.seenAt
    ).length;

    setUnreadCount(count);
  }, [myTasks]);

  // ========================================
  // MARK MY TASKS AS SEEN
  // WHEN OPENING MY WORK
  // ========================================

  useEffect(() => {
    if (
      activeView === "myWork" &&
      myTasks.length > 0
    ) {
      markMyTasksAsSeen();
    }
  }, [
    activeView,
    myTasks.length,
  ]);

  // ========================================
  // TEAM UNREAD COUNT
  // ========================================

  const updateTeamUnreadCount = (tasks) => {
    if (!employeeId) {
      return;
    }

    const lastSeen = Number(
      localStorage.getItem(
        `teamTasksLastSeen_${employeeId}`
      ) || 0
    );

    const unread = tasks.filter((task) => {
      const updatedTime = new Date(
        task.updatedAt ||
          task.createdAt
      ).getTime();

      return updatedTime > lastSeen;
    }).length;

    setTeamUnreadCount(unread);
  };

  // ========================================
  // MARK TEAM UPDATES AS SEEN
  // ========================================

  useEffect(() => {
    if (
      activeView === "teamUpdates" &&
      employeeId &&
      teamTasks.length > 0
    ) {
      localStorage.setItem(
        `teamTasksLastSeen_${employeeId}`,
        Date.now().toString()
      );

      setTeamUnreadCount(0);
    }
  }, [
    activeView,
    employeeId,
    teamTasks.length,
  ]);

  // ========================================
  // LOAD LOGGED-IN EMPLOYEE
  // ========================================

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "employeeLoggedIn"
      );

    const employeeData =
      localStorage.getItem(
        "employeeData"
      );

    const storedEmployeeId =
      localStorage.getItem(
        "employeeId"
      );

    if (
      loggedIn !== "true" ||
      !employeeData
    ) {
      router.replace(
        "/employee/login"
      );

      return;
    }

    try {
      const parsedEmployee =
        JSON.parse(employeeData);

      setEmployee(parsedEmployee);

      const currentId =
        parsedEmployee?._id ||
        parsedEmployee?.id ||
        parsedEmployee?.employeeId ||
        storedEmployeeId ||
        "";

      setEmployeeId(currentId);

      setForm((prev) => ({
        ...prev,
        employeeId: "",
      }));
    } catch (error) {
      console.error(
        "Invalid employee data:",
        error
      );

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
    }
  }, [router]);

  // ========================================
  // LOAD EMPLOYEES
  // ========================================

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await axios.get(
          "/api/employee/list"
        );

        const employeeList =
          res.data?.employees ||
          res.data?.data ||
          res.data ||
          [];

        setEmployees(
          Array.isArray(employeeList)
            ? employeeList
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load employees:",
          error
        );
      }
    };

    loadEmployees();
  }, []);

  // ========================================
  // LOAD MY TASKS
  // ========================================

  const loadMyTasks = async (id) => {
    if (!id) return;

    try {
      setLoadingMyTasks(true);

      const res = await axios.get(
        `/api/tasks?employeeId=${id}`
      );

      const tasks =
        res.data?.tasks ||
        res.data?.data ||
        res.data ||
        [];

      setMyTasks(
        Array.isArray(tasks)
          ? tasks
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load my tasks:",
        error
      );

      setMyTasks([]);
    } finally {
      setLoadingMyTasks(false);
    }
  };

  // ========================================
  // LOAD TEAM TASKS
  // ========================================

  const loadTeamTasks = async (id) => {
    if (!id) return;

    try {
      setLoadingTeamTasks(true);

      const res = await axios.get(
        `/api/tasks?assignedByEmployeeId=${id}`
      );

      const tasks =
        res.data?.tasks ||
        res.data?.data ||
        res.data ||
        [];

      const taskList =
        Array.isArray(tasks)
          ? tasks
          : [];

      setTeamTasks(taskList);

      updateTeamUnreadCount(
        taskList
      );
    } catch (error) {
      console.error(
        "Failed to load team tasks:",
        error
      );

      setTeamTasks([]);
      setTeamUnreadCount(0);
    } finally {
      setLoadingTeamTasks(false);
    }
  };

  // ========================================
  // LOAD TASKS WHEN EMPLOYEE IS READY
  // ========================================

  useEffect(() => {
    if (employeeId) {
      loadMyTasks(employeeId);
      loadTeamTasks(employeeId);
    }
  }, [employeeId]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // FILE CHANGE
  // ========================================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const allowedExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ];

    const maxFiles = 5;

    const maxSize =
      10 * 1024 * 1024;

    const validFiles = [];

    const invalidFiles = [];

    selectedFiles.forEach(
      (file) => {
        const extension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase();

        if (
          !extension ||
          !allowedExtensions.includes(
            extension
          )
        ) {
          invalidFiles.push(
            `${file.name}: file type not allowed`
          );

          return;
        }

        if (file.size > maxSize) {
          invalidFiles.push(
            `${file.name}: maximum size is 10 MB`
          );

          return;
        }

        validFiles.push(file);
      }
    );

    if (
      invalidFiles.length > 0
    ) {
      alert(
        invalidFiles.join("\n")
      );
    }

    setForm((prev) => {
      const combined = [
        ...prev.attachments,
        ...validFiles,
      ];

      return {
        ...prev,
        attachments:
          combined.slice(
            0,
            maxFiles
          ),
      };
    });

    e.target.value = "";
  };

  // ========================================
  // REMOVE ATTACHMENT
  // ========================================

  const removeAttachment = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,
      attachments:
        prev.attachments.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  // ========================================
  // ASSIGN WORK
  // ========================================

  const handleAssignTask = async (
    e
  ) => {
    e.preventDefault();

    if (!form.employeeId) {
      alert(
        "Please select an employee."
      );

      return;
    }

    if (!form.title.trim()) {
      alert(
        "Please enter task title."
      );

      return;
    }

    if (!form.taskDate) {
      alert(
        "Please select task date."
      );

      return;
    }

    try {
      setSaving(true);

      const formData =
        new FormData();

      formData.append(
        "employeeId",
        form.employeeId
      );

      formData.append(
        "assignedByEmployeeId",
        employeeId
      );

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "taskDate",
        form.taskDate
      );

      formData.append(
        "dueDate",
        form.dueDate || ""
      );

      formData.append(
        "priority",
        form.priority
      );

      form.attachments.forEach(
        (file) => {
          formData.append(
            "files",
            file
          );
        }
      );

      await axios.post(
        "/api/tasks",
        formData
      );

      alert(
        "Task assigned successfully."
      );

      const assignedEmployeeId =
        form.employeeId;

      setForm({
        employeeId: "",
        title: "",
        description: "",
        taskDate: new Date()
          .toISOString()
          .split("T")[0],
        dueDate: "",
        priority: "Medium",
        attachments: [],
      });

      await loadTeamTasks(
        employeeId
      );

      if (
        assignedEmployeeId ===
        employeeId
      ) {
        await loadMyTasks(
          employeeId
        );
      }

      setActiveView(
        "teamUpdates"
      );
    } catch (error) {
      console.error(
        "Assign task error:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          "Failed to assign task."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // UPDATE MY TASK STATUS
  // ========================================

  const updateTaskStatus = async (
    taskId,
    status
  ) => {
    try {
      await axios.patch(
        `/api/tasks/${taskId}`,
        {
          status,
        }
      );

      await loadMyTasks(
        employeeId
      );

      await loadTeamTasks(
        employeeId
      );
    } catch (error) {
      console.error(
        "Update task error:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          "Failed to update task."
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

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

  // ========================================
  // MY WORK STATS
  // ========================================

  const myStats = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let hold = 0;
    let completed = 0;

    myTasks.forEach(
      (task) => {
        if (
          task.status ===
          "Pending"
        ) {
          pending++;
        }

        if (
          task.status ===
          "In Progress"
        ) {
          inProgress++;
        }

        if (
          task.status ===
          "Hold"
        ) {
          hold++;
        }

        if (
          task.status ===
          "Completed"
        ) {
          completed++;
        }
      }
    );

    return {
      pending,
      inProgress,
      hold,
      completed,
    };
  }, [myTasks]);

  // ========================================
  // TEAM STATS
  // ========================================

  const teamStats = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let hold = 0;
    let completed = 0;

    teamTasks.forEach(
      (task) => {
        if (
          task.status ===
          "Pending"
        ) {
          pending++;
        }

        if (
          task.status ===
          "In Progress"
        ) {
          inProgress++;
        }

        if (
          task.status ===
          "Hold"
        ) {
          hold++;
        }

        if (
          task.status ===
          "Completed"
        ) {
          completed++;
        }
      }
    );

    return {
      pending,
      inProgress,
      hold,
      completed,
    };
  }, [teamTasks]);

  // ========================================
  // FILTER TEAM TASKS
  // ========================================

  const filteredTeamTasks =
    useMemo(() => {
      if (
        teamFilter === "All"
      ) {
        return teamTasks;
      }

      return teamTasks.filter(
        (task) =>
          task.status ===
          teamFilter
      );
    }, [
      teamTasks,
      teamFilter,
    ]);

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (
    status
  ) => {
    if (
      status === "Completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      status ===
      "In Progress"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      status === "Hold"
    ) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // ========================================
  // STATUS LABEL
  // ========================================

  const getStatusLabel = (
    status
  ) => {
    if (
      status === "Completed"
    ) {
      return "Finished";
    }

    return status;
  };

  // ========================================
  // PRIORITY STYLE
  // ========================================

  const getPriorityStyle = (
    priority
  ) => {
    if (
      priority === "Urgent"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      priority === "High"
    ) {
      return "bg-orange-100 text-orange-700";
    }

    if (
      priority === "Low"
    ) {
      return "bg-gray-100 text-gray-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  // ========================================
  // ATTACHMENT UI
  // ========================================

  const renderAttachments = (
    attachments
  ) => {
    if (
      !attachments ||
      attachments.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-5">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Paperclip size={16} />
          Attachments
        </p>

        <div className="flex flex-wrap gap-3">
          {attachments.map(
            (
              attachment,
              index
            ) => {
              const isImage =
                attachment?.mimeType?.startsWith(
                  "image/"
                ) ||
                attachment?.resourceType ===
                  "image";

              return (
                <a
                  key={`${attachment?.publicId || attachment?.url || index}-${index}`}
                  href={
                    attachment?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-blue-300 transition"
                >
                  {isImage ? (
                    <div className="w-32">
                      <img
                        src={
                          attachment.url
                        }
                        alt={
                          attachment.fileName ||
                          "Attachment"
                        }
                        className="w-32 h-24 object-cover"
                      />

                      <div className="px-2 py-2">
                        <p className="text-xs text-gray-600 truncate">
                          {
                            attachment.fileName
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 min-w-[240px]">
                      <FileText
                        size={26}
                        className="text-red-500 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {
                            attachment.fileName
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          Open document
                        </p>
                      </div>

                      <Download
                        size={17}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </a>
              );
            }
          )}
        </div>
      </div>
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-white border-r border-gray-200 lg:flex lg:flex-col">

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

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="lg:ml-64">

        <div className="p-10 max-w-7xl mx-auto space-y-8">

          {/* HEADER */}

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tasks
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your work and track work assigned to your team.
            </p>
          </div>

          {/* ========================================
              TABS
          ======================================== */}

          <div className="bg-white border border-gray-200 rounded-xl p-2 inline-flex flex-wrap">

            {/* MY WORK */}

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "myWork"
                )
              }
              className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                activeView ===
                "myWork"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ClipboardList
                size={17}
              />

              My Work

              {unreadCount >
                0 && (
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${
                    activeView ===
                    "myWork"
                      ? "bg-white text-gray-900"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* ASSIGN WORK */}

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "assignWork"
                )
              }
              className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                activeView ===
                "assignWork"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Plus size={17} />

              Assign Work
            </button>

            {/* TEAM UPDATES */}

            <button
              type="button"
              onClick={() =>
                setActiveView(
                  "teamUpdates"
                )
              }
              className={`px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                activeView ===
                "teamUpdates"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users size={17} />

              Team Updates

              {teamUnreadCount >
                0 && (
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${
                    activeView ===
                    "teamUpdates"
                      ? "bg-white text-gray-900"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {teamUnreadCount}
                </span>
              )}
            </button>

          </div>

          {/* ========================================
              MY WORK
          ======================================== */}

          {activeView ===
            "myWork" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {myStats.pending}
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    In Progress
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {myStats.inProgress}
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Hold
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {myStats.hold}
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Finished
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {myStats.completed}
                  </p>
                </div>

              </div>

              <section>

                <div className="mb-5">

                  <h3 className="text-xl font-bold text-gray-900">
                    My Assigned Work
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Only tasks assigned to you are shown here.
                  </p>

                </div>

                {loadingMyTasks ? (
                  <div className="bg-white rounded-2xl border p-10 text-center text-gray-500">
                    Loading tasks...
                  </div>
                ) : myTasks.length ===
                  0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center">

                    <ClipboardList
                      size={45}
                      className="mx-auto text-gray-300"
                    />

                    <h4 className="mt-4 text-lg font-semibold text-gray-900">
                      No work assigned
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      You currently don't have any assigned tasks.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {myTasks.map(
                      (task) => (
                        <div
                          key={
                            task._id
                          }
                          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                        >

                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                            <div className="flex-1">

                              <div className="flex flex-wrap items-center gap-2">

                                <h4 className="text-lg font-semibold text-gray-900">
                                  {
                                    task.title
                                  }
                                </h4>

                                <span
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                                    task.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    task.status
                                  )}
                                </span>

                                <span
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityStyle(
                                    task.priority
                                  )}`}
                                >
                                  {
                                    task.priority
                                  }
                                </span>

                              </div>

                              {task.description && (
                                <p className="text-gray-600 mt-3">
                                  {
                                    task.description
                                  }
                                </p>
                              )}

                              {renderAttachments(
                                task.attachments
                              )}

                              <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500">

                                <span>
                                  Task Date:{" "}
                                  {new Date(
                                    task.taskDate
                                  ).toLocaleDateString()}
                                </span>

                                {task.dueDate && (
                                  <span>
                                    Due:{" "}
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                )}

                              </div>

                            </div>

                            {/* STATUS UPDATE */}

                            <div className="flex flex-wrap gap-2">

                              {task.status ===
                                "Pending" && (
                                <button
                                  onClick={() =>
                                    updateTaskStatus(
                                      task._id,
                                      "In Progress"
                                    )
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  <Play
                                    size={
                                      16
                                    }
                                  />

                                  Start
                                </button>
                              )}

                              {task.status ===
                                "In Progress" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateTaskStatus(
                                        task._id,
                                        "Hold"
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                                  >
                                    <Pause
                                      size={
                                        16
                                      }
                                    />

                                    Hold
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateTaskStatus(
                                        task._id,
                                        "Completed"
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                  >
                                    <CheckCircle2
                                      size={
                                        16
                                      }
                                    />

                                    Finish
                                  </button>
                                </>
                              )}

                              {task.status ===
                                "Hold" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateTaskStatus(
                                        task._id,
                                        "In Progress"
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                    <Play
                                      size={
                                        16
                                      }
                                    />

                                    Resume
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateTaskStatus(
                                        task._id,
                                        "Completed"
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                  >
                                    <CheckCircle2
                                      size={
                                        16
                                      }
                                    />

                                    Finish
                                  </button>
                                </>
                              )}

                            </div>

                          </div>

                          {task.dueDate &&
                            task.status !==
                              "Completed" &&
                            new Date(
                              task.dueDate
                            ) <
                              new Date() && (
                              <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                                <AlertCircle
                                  size={
                                    17
                                  }
                                />

                                This task is overdue.
                              </div>
                            )}

                        </div>
                      )
                    )}

                  </div>
                )}

              </section>
            </>
          )}

          {/* ========================================
              ASSIGN WORK
          ======================================== */}

          {activeView ===
            "assignWork" && (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

              <div className="mb-7">

                <h3 className="text-xl font-bold text-gray-900">
                  Assign Work
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Assign work to another employee and track their progress.
                </p>

              </div>

              <form
                onSubmit={
                  handleAssignTask
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >

                {/* EMPLOYEE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>

                  <select
                    name="employeeId"
                    value={
                      form.employeeId
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  >

                    <option value="">
                      Select Employee
                    </option>

                    {employees.map(
                      (item) => {
                        const id =
                          item._id ||
                          item.id ||
                          item.employeeId;

                        return (
                          <option
                            key={id}
                            value={id}
                          >
                            {
                              item.employeeFullName
                            }

                            {item.employeeCode
                              ? ` (${item.employeeCode})`
                              : ""}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

                {/* TITLE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter task title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  />

                </div>

                {/* TASK DATE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Date
                  </label>

                  <input
                    type="date"
                    name="taskDate"
                    value={
                      form.taskDate
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  />

                </div>

                {/* DUE DATE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      form.dueDate
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  />

                </div>

                {/* PRIORITY */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      form.priority
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  >

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={5}
                    placeholder="Enter task details..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />

                </div>

                {/* ATTACHMENTS */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Documents / Images
                  </label>

                  <div className="border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50">

                    <label className="inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">

                      <Paperclip size={17} />

                      Choose Files

                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={
                          handleFileChange
                        }
                        className="hidden"
                      />

                    </label>

                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WEBP, GIF, PDF, DOC,
                      DOCX, XLS, XLSX, PPT and PPTX.
                      Maximum 5 files, 10 MB each.
                    </p>

                    {form.attachments
                      .length >
                      0 && (
                      <div className="mt-4 space-y-2">

                        {form.attachments.map(
                          (
                            file,
                            index
                          ) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-3 bg-white border rounded-lg px-3 py-2"
                            >

                              <div className="flex items-center gap-3 min-w-0">

                                {file.type.startsWith(
                                  "image/"
                                ) ? (
                                  <ImageIcon
                                    size={
                                      18
                                    }
                                    className="text-blue-600 shrink-0"
                                  />
                                ) : (
                                  <FileText
                                    size={
                                      18
                                    }
                                    className="text-red-500 shrink-0"
                                  />
                                )}

                                <span className="text-sm text-gray-700 truncate">
                                  {
                                    file.name
                                  }
                                </span>

                                <span className="text-xs text-gray-400 shrink-0">
                                  {(
                                    file.size /
                                    1024 /
                                    1024
                                  ).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </span>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeAttachment(
                                    index
                                  )
                                }
                                className="text-gray-400 hover:text-red-600"
                              >
                                <X
                                  size={
                                    17
                                  }
                                />
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>

                </div>

                {/* SUBMIT */}

                <div className="md:col-span-2 flex justify-end">

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black disabled:opacity-50"
                  >

                    <Plus
                      size={18}
                    />

                    {saving
                      ? "Assigning..."
                      : "Assign Task"}

                  </button>

                </div>

              </form>

            </section>
          )}

          {/* ========================================
              TEAM UPDATES
          ======================================== */}

          {activeView ===
            "teamUpdates" && (
            <section>

              <div className="mb-6">

                <h3 className="text-xl font-bold text-gray-900">
                  Team Updates
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Track the work you assigned to other employees.
                </p>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {
                      teamStats.pending
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    In Progress
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {
                      teamStats.inProgress
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Hold
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {teamStats.hold}
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">
                    Finished
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {
                      teamStats.completed
                    }
                  </p>
                </div>

              </div>

              {/* FILTER */}

              <div className="bg-white border rounded-xl p-4 mb-5">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>

                    <p className="font-medium text-gray-900">
                      Work Assigned By You
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {teamTasks.length} total task
                      {teamTasks.length !==
                        1
                        ? "s"
                        : ""}
                    </p>

                  </div>

                  <select
                    value={
                      teamFilter
                    }
                    onChange={(e) =>
                      setTeamFilter(
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
                  >

                    <option value="All">
                      All Status
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Hold">
                      Hold
                    </option>

                    <option value="Completed">
                      Finished
                    </option>

                  </select>

                </div>

              </div>

              {/* TEAM TASKS */}

              {loadingTeamTasks ? (
                <div className="bg-white rounded-2xl border p-10 text-center text-gray-500">
                  Loading team updates...
                </div>
              ) : filteredTeamTasks.length ===
                0 ? (
                <div className="bg-white rounded-2xl border p-12 text-center">

                  <Users
                    size={45}
                    className="mx-auto text-gray-300"
                  />

                  <h4 className="mt-4 text-lg font-semibold text-gray-900">
                    No assigned work found
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Work that you assign to other employees will appear here.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {filteredTeamTasks.map(
                    (task) => (
                      <div
                        key={
                          task._id
                        }
                        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                          <div className="flex-1">

                            {/* EMPLOYEE */}

                            <div className="flex items-center gap-3 mb-4">

                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                                <User
                                  size={
                                    19
                                  }
                                  className="text-gray-600"
                                />

                              </div>

                              <div>

                                <h4 className="font-semibold text-gray-900">
                                  {
                                    task
                                      .employeeId
                                      ?.employeeFullName ||
                                    "Employee"
                                  }
                                </h4>

                                <p className="text-sm text-gray-500">

                                  {
                                    task
                                      .employeeId
                                      ?.employeeCode
                                  }

                                  {task
                                    .employeeId
                                    ?.designation
                                    ? ` • ${task.employeeId.designation}`
                                    : ""}

                                </p>

                              </div>

                            </div>

                            {/* TASK */}

                            <div className="flex flex-wrap items-center gap-2">

                              <h4 className="text-lg font-semibold text-gray-900">
                                {
                                  task.title
                                }
                              </h4>

                              <span
                                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                                  task.status
                                )}`}
                              >
                                {getStatusLabel(
                                  task.status
                                )}
                              </span>

                              <span
                                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityStyle(
                                  task.priority
                                )}`}
                              >
                                {
                                  task.priority
                                }
                              </span>

                            </div>

                            {task.description && (
                              <p className="text-gray-600 mt-3">
                                {
                                  task.description
                                }
                              </p>
                            )}

                            {renderAttachments(
                              task.attachments
                            )}

                            {/* DATES */}

                            <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500">

                              <span>
                                Assigned:{" "}
                                {task.createdAt
                                  ? new Date(
                                      task.createdAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>

                              <span>
                                Task Date:{" "}
                                {task.taskDate
                                  ? new Date(
                                      task.taskDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>

                              {task.dueDate && (
                                <span>
                                  Due:{" "}
                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString()}
                                </span>
                              )}

                            </div>

                            {/* LAST UPDATE */}

                            {task.updatedAt && (
                              <p className="text-xs text-gray-400 mt-3">
                                Last updated:{" "}
                                {new Date(
                                  task.updatedAt
                                ).toLocaleString()}
                              </p>
                            )}

                          </div>

                          {/* CURRENT STATUS */}

                          <div className="lg:min-w-[160px]">

                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                              Current Status
                            </p>

                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${getStatusStyle(
                                task.status
                              )}`}
                            >

                              {task.status ===
                                "Completed" && (
                                <CheckCircle2
                                  size={
                                    17
                                  }
                                />
                              )}

                              {task.status ===
                                "In Progress" && (
                                <Play
                                  size={
                                    17
                                  }
                                />
                              )}

                              {task.status ===
                                "Hold" && (
                                <Pause
                                  size={
                                    17
                                  }
                                />
                              )}

                              {task.status ===
                                "Pending" && (
                                <Clock3
                                  size={
                                    17
                                  }
                                />
                              )}

                              {getStatusLabel(
                                task.status
                              )}

                            </div>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>
          )}

        </div>

      </main>

    </div>
  );
}