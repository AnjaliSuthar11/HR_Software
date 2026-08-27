import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";


// ======================================================
// CREATE LEAVE
// ======================================================

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      employeeId,
      leaveType,
      fromDate,
      toDate,
      duration,
      reason,
    } = body;

    // ============================================
    // VALIDATION
    // ============================================

    if (
      !employeeId ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !duration ||
      !reason?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // ============================================
    // CHECK EMPLOYEE
    // ============================================

    const employee =
      await Employee.findById(
        employeeId
      );

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    // ============================================
    // CHECK DATES
    // ============================================

    const startDate =
      new Date(fromDate);

    const endDate =
      new Date(toDate);

    if (
      startDate > endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "From date cannot be later than To date",
        },
        { status: 400 }
      );
    }

    // ============================================
    // CALCULATE DAYS
    // ============================================

    let days =
      Math.ceil(
        (
          endDate.getTime() -
          startDate.getTime()
        ) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      duration === "Half Day"
    ) {
      days = 0.5;
    }

    // ============================================
    // CREATE LEAVE
    // ============================================

    const leave =
      await Leave.create({
        employeeId,

        leaveType,

        fromDate: startDate,

        toDate: endDate,

        duration,

        numberOfDays: days,

        reason: reason.trim(),

        status: "Pending",

        hrRemarks: "",
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Leave request submitted",
        leave,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Create leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to create leave",
      },
      { status: 500 }
    );
  }
}


// ======================================================
// GET ALL LEAVES - HR
// ======================================================

export async function GET() {
  try {
    await connectDB();

    const leaves =
      await Leave.find()
        .populate(
          "employeeId",
          "employeeFullName employeeCode companyLoginEmail"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      leaves,
    });

  } catch (error) {
    console.error(
      "Get leaves error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to fetch leaves",
      },
      { status: 500 }
    );
  }
}