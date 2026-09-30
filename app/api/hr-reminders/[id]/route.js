import { connectDB } from "@/lib/mongodb";
import HRReminder from "@/models/HRReminder";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ==========================================
// UPDATE REMINDER
// ==========================================

export async function PATCH(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reminder ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    const {
      title,
      priority,
      completed,
    } = body;

    const updateData = {};

    if (
      title !== undefined
    ) {
      if (!title.trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Reminder cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.title =
        title.trim();
    }

    if (
      priority !== undefined
    ) {
      updateData.priority =
        priority;
    }

    if (
      completed !== undefined
    ) {
      updateData.completed =
        completed;

      updateData.completedAt =
        completed
          ? new Date()
          : null;
    }

    const reminder =
      await HRReminder.findByIdAndUpdate(
        id,
        updateData,
        {
          returnDocument:
            "after",
          runValidators: true,
        }
      );

    if (!reminder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reminder not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error(
      "Update reminder error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to update reminder.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE REMINDER
// ==========================================

export async function DELETE(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reminder ID.",
        },
        {
          status: 400,
        }
      );
    }

    const reminder =
      await HRReminder.findByIdAndDelete(
        id
      );

    if (!reminder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reminder not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Reminder deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete reminder error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete reminder.",
      },
      {
        status: 500,
      }
    );
  }
}