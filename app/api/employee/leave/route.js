import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import Employee from "@/models/Employee";


// ======================================================
// GET LEAVE HISTORY
// ======================================================

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const employeeId =
      searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    const leaves = await Leave.find({
      employeeId,
    })
      .sort({
        appliedDate: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error(
      "Get leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch leave records",
      },
      { status: 500 }
    );
  }
}


// ======================================================
// APPLY LEAVE
// ======================================================

export async function POST(request) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      employeeId,
      leaveType,
      fromDate,
      toDate,
      duration,
      numberOfDays,
      reason,
    } = body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !employeeId ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !duration ||
      !numberOfDays ||
      !reason
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please fill all leave fields",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK EMPLOYEE
    // ==================================================

    const employee =
      await Employee.findById(
        employeeId
      );

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee not found",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // CHECK DATE
    // ==================================================

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
            "From date cannot be after To date",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK NUMBER OF DAYS
    // ==================================================

    if (
      Number(numberOfDays) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Number of days must be greater than 0",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK OVERLAPPING LEAVE
    // ==================================================

    const overlappingLeave =
      await Leave.findOne({
        employeeId,

        status: {
          $in: [
            "Pending",
            "Approved",
          ],
        },

        fromDate: {
          $lte: endDate,
        },

        toDate: {
          $gte: startDate,
        },
      });

    if (overlappingLeave) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a leave request for these dates",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CREATE LEAVE
    // ==================================================

    const leave =
      await Leave.create({
        employeeId,
        leaveType,
        fromDate: startDate,
        toDate: endDate,
        duration,
        numberOfDays:
          Number(numberOfDays),
        reason: reason.trim(),
        status: "Pending",
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Leave applied successfully",
        leave,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Apply leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to apply leave",
      },
      { status: 500 }
    );
  }
}