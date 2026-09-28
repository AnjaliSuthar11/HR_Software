import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";


// ========================================
// UPDATE TASK
// ========================================


export async function PATCH(
  request,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const {
      status,
      title,
      description,
      taskDate,
      dueDate,
      priority,
      seen,
    } = body;

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;

      if (status === "Completed") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (taskDate !== undefined) {
      updateData.taskDate = taskDate;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate || null;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    // NEW
    if (seen === true) {
      updateData.seenAt = new Date();
    }

    const task =
      await Task.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "employeeId",
          "employeeFullName employeeCode department designation"
        )
        .populate(
          "assignedByEmployeeId",
          "employeeFullName employeeCode"
        );

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(
      "UPDATE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE TASK
// ========================================
export async function DELETE(
  request,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    const task =
      await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Task deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}