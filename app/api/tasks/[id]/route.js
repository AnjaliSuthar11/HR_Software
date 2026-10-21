// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Task from "@/models/Task";


// // ========================================
// // UPDATE TASK
// // ========================================


// export async function PATCH(
//   request,
//   { params }
// ) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const body = await request.json();

//     const {
//       status,
//       title,
//       description,
//       taskDate,
//       dueDate,
//       priority,
//       seen,
//     } = body;

//     const updateData = {};

//     if (status !== undefined) {
//       updateData.status = status;

//       if (status === "Completed") {
//         updateData.completedAt = new Date();
//       } else {
//         updateData.completedAt = null;
//       }
//     }

//     if (title !== undefined) {
//       updateData.title = title.trim();
//     }

//     if (description !== undefined) {
//       updateData.description = description.trim();
//     }

//     if (taskDate !== undefined) {
//       updateData.taskDate = taskDate;
//     }

//     if (dueDate !== undefined) {
//       updateData.dueDate = dueDate || null;
//     }

//     if (priority !== undefined) {
//       updateData.priority = priority;
//     }

//     // NEW
//     if (seen === true) {
//       updateData.seenAt = new Date();
//     }

//     const task =
//       await Task.findByIdAndUpdate(
//         id,
//         updateData,
//         {
//           new: true,
//           runValidators: true,
//         }
//       )
//         .populate(
//           "employeeId",
//           "employeeFullName employeeCode department designation"
//         )
//         .populate(
//           "assignedByEmployeeId",
//           "employeeFullName employeeCode"
//         );

//     if (!task) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Task not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Task updated successfully",
//       task,
//     });
//   } catch (error) {
//     console.error(
//       "UPDATE TASK ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to update task",
//       },
//       { status: 500 }
//     );
//   }
// }

// // ========================================
// // DELETE TASK
// // ========================================
// export async function DELETE(
//   request,
//   { params }
// ) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const task =
//       await Task.findByIdAndDelete(id);

//     if (!task) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Task not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message:
//         "Task deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "DELETE TASK ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to delete task",
//       },
//       { status: 500 }
//     );
//   }
// }


// 21st october


import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

const ASSIGNER_FIELDS = [
  "taskTitle",
  "description",
  "assignedDate",
  "deadline",
  "assignedQuantity",
  "approvedQuantity",
];

const EMPLOYEE_FIELDS = [
  "completedQuantity",
  "startTime",
  "endTime",
  "status",
  "remarks",
];

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid task ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { updatedById } = body;

    if (!mongoose.isValidObjectId(updatedById)) {
      return NextResponse.json(
        { success: false, message: "Valid employee ID is required." },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    const isAssigner = task.assignedById.toString() === updatedById;
    const isAssignee = task.assignedToId.toString() === updatedById;

    if (!isAssigner && !isAssignee) {
      return NextResponse.json(
        { success: false, message: "You cannot update this task." },
        { status: 403 }
      );
    }

    const allowedFields = [
      ...(isAssigner ? ASSIGNER_FIELDS : []),
      ...(isAssignee ? EMPLOYEE_FIELDS : []),
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        task[field] = body[field];
      }
    }

    if (
      task.assignedQuantity < 0 ||
      task.completedQuantity < 0 ||
      task.approvedQuantity < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Quantities cannot be negative." },
        { status: 400 }
      );
    }

    if (
      task.completedQuantity > task.assignedQuantity ||
      task.approvedQuantity > task.completedQuantity
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Completed quantity cannot exceed assigned quantity, and approved quantity cannot exceed completed quantity.",
        },
        { status: 400 }
      );
    }

    if (
      !["Pending", "In Progress", "Completed", "On Hold"].includes(
        task.status
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid task status." },
        { status: 400 }
      );
    }

    if (!task.taskTitle?.trim()) {
      return NextResponse.json(
        { success: false, message: "Task title is required." },
        { status: 400 }
      );
    }

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("PATCH task error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(employeeId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid task or employee ID." },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    if (task.assignedById.toString() !== employeeId) {
      return NextResponse.json(
        { success: false, message: "Only the assigner can delete this task." },
        { status: 403 }
      );
    }

    await task.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE task error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete task." },
      { status: 500 }
    );
  }
}

