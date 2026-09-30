import { connectDB } from "@/lib/mongodb";
import HRReminder from "@/models/HRReminder";
import { NextResponse } from "next/server";

// ==========================================
// GET ALL REMINDERS
// ==========================================

export async function GET() {
  try {
    await connectDB();

    const reminders =
      await HRReminder.find()
        .sort({
          completed: 1,
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error(
      "Get reminders error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch reminders.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE REMINDER
// ==========================================

export async function POST(req) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      title,
      priority,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reminder is required.",
        },
        {
          status: 400,
        }
      );
    }

    const reminder =
      await HRReminder.create({
        title: title.trim(),
        priority:
          priority || "Medium",
        completed: false,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Reminder added successfully.",
        reminder,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create reminder error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to create reminder.",
      },
      {
        status: 500,
      }
    );
  }
}