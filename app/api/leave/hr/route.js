import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import Employee from "@/models/Employee";

// ======================================================
// HR ADD LEAVE / ABSENCE
// ======================================================

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      employeeId,
      leaveType,
      date,
      fromDate,
      toDate,
      reason,
    } = body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !employeeId ||
      !leaveType ||
      (!date && !fromDate) ||
      !reason?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK LEAVE TYPE
    // ==================================================

    if (
      !["CL", "SL", "PL", "LOP"].includes(
        leaveType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid leave type",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK EMPLOYEE
    // ==================================================

    const employee =
      await Employee.findById(employeeId);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // CREATE START DATE
    // ==================================================

    // Support:
    // date     -> single day
    // fromDate -> multiple days

    const startDate = new Date(
      fromDate || date
    );

    if (
      Number.isNaN(
        startDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid from date",
        },
        { status: 400 }
      );
    }

    startDate.setHours(
      0,
      0,
      0,
      0
    );

    // ==================================================
    // CREATE END DATE
    // ==================================================

    const endDate = new Date(
      toDate || fromDate || date
    );

    if (
      Number.isNaN(
        endDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid to date",
        },
        { status: 400 }
      );
    }

    endDate.setHours(
      0,
      0,
      0,
      0
    );

    // ==================================================
    // CHECK DATE RANGE
    // ==================================================

    if (startDate > endDate) {
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
    // CALCULATE NUMBER OF DAYS
    // ==================================================

    const difference =
      endDate.getTime() -
      startDate.getTime();

    const numberOfDays =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // ==================================================
    // PRIVILEGE LEAVE RULES
    // ==================================================

    if (leaveType === "PL") {
      // ----------------------------------------------
      // PL MAXIMUM 6 DAYS
      // ----------------------------------------------

      if (numberOfDays > 6) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Privilege Leave can be maximum 6 days.",
          },
          { status: 400 }
        );
      }

      // ----------------------------------------------
      // PL ONLY ONCE PER YEAR
      // ----------------------------------------------

      const year =
        startDate.getFullYear();

      const startOfYear =
        new Date(year, 0, 1);

      const endOfYear =
        new Date(year + 1, 0, 1);

      const existingPL =
        await Leave.findOne({
          employeeId,

          leaveType: "PL",

          status: {
            $in: [
              "Pending",
              "Approved",
            ],
          },

          fromDate: {
            $lt: endOfYear,
          },

          toDate: {
            $gte: startOfYear,
          },
        });

      if (existingPL) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Privilege Leave can only be taken once per year.",
          },
          { status: 400 }
        );
      }
    }

    // ==================================================
    // CHECK EXISTING LEAVE / OVERLAP
    // ==================================================

    const existingLeave =
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

    if (existingLeave) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee already has a leave record for one or more selected dates",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CREATE HR LEAVE
    // ==================================================

   const leave = await Leave.create({
  employeeId,
  leaveType,
  fromDate: startDate,
  toDate: endDate,

  duration: "Full Day",

  numberOfDays,

  reason,
  status: "Approved",
  hrRemarks: "Added directly by HR.",
});

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Employee leave added successfully",

        leave,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "HR add leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to add employee leave",
      },
      { status: 500 }
    );
  }
}