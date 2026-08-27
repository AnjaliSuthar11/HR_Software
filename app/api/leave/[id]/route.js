import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const TOTAL_CL = 6;
const TOTAL_SL = 6;
const MONTHLY_PAID_LIMIT = 1;

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Leave ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid leave ID",
        },
        { status: 400 }
      );
    }

    const {
      status,
      hrRemarks,
    } = await req.json();

    if (
      !["Approved", "Rejected"].includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 }
      );
    }

    if (
      status === "Rejected" &&
      !hrRemarks?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "HR remarks are required when rejecting",
        },
        { status: 400 }
      );
    }

    const leave =
      await Leave.findById(id);

    if (!leave) {
      return NextResponse.json(
        {
          success: false,
          message: "Leave not found",
        },
        { status: 404 }
      );
    }

    if (leave.status !== "Pending") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This leave has already been processed",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // REJECTION
    // ==================================================

    if (status === "Rejected") {
      leave.status = "Rejected";
      leave.hrRemarks = hrRemarks.trim();

      await leave.save();

      return NextResponse.json({
        success: true,
        message: "Leave Rejected",
        leave,
      });
    }

    // ==================================================
    // APPROVAL
    // ==================================================

    const requestedDays =
      Number(leave.numberOfDays || 0);

    // LOP requests are directly approved as LOP
    if (leave.leaveType === "LOP") {
      leave.status = "Approved";
      leave.hrRemarks = "";

      await leave.save();

      return NextResponse.json({
        success: true,
        message: "LOP Leave Approved",
        leave,
      });
    }

    // ==================================================
    // CL / SL
    // ==================================================

    if (
      leave.leaveType === "CL" ||
      leave.leaveType === "SL"
    ) {
      const leaveDate =
        new Date(leave.fromDate);

      const year =
        leaveDate.getFullYear();

      const month =
        leaveDate.getMonth();

      const monthStart =
        new Date(year, month, 1);

      const nextMonthStart =
        new Date(year, month + 1, 1);

      // ==================================================
      // GET APPROVED PAID LEAVES OF THAT MONTH
      // ==================================================

      const approvedPaidLeaves =
        await Leave.find({
          employeeId:
            leave.employeeId,

          _id: {
            $ne: leave._id,
          },

          status: "Approved",

          leaveType: {
            $in: ["CL", "SL"],
          },

          fromDate: {
            $lt: nextMonthStart,
          },

          toDate: {
            $gte: monthStart,
          },
        });

      const paidDaysUsed =
        approvedPaidLeaves.reduce(
          (total, item) =>
            total +
            Number(
              item.numberOfDays || 0
            ),
          0
        );

      // ==================================================
      // CHECK YEARLY BALANCE
      // ==================================================

      const approvedSameType =
        await Leave.find({
          employeeId:
            leave.employeeId,

          _id: {
            $ne: leave._id,
          },

          status: "Approved",

          leaveType:
            leave.leaveType,
        });

      const usedSameType =
        approvedSameType.reduce(
          (total, item) =>
            total +
            Number(
              item.numberOfDays || 0
            ),
          0
        );

      const totalAllowed =
        leave.leaveType === "CL"
          ? TOTAL_CL
          : TOTAL_SL;

      const remainingBalance =
        totalAllowed -
        usedSameType;

      // ==================================================
      // IF YEARLY CL / SL IS ALREADY FINISHED
      // THEN IT BECOMES LOP
      // ==================================================

      if (
        remainingBalance <= 0 ||
        requestedDays >
          remainingBalance
      ) {
        leave.leaveType = "LOP";
        leave.status = "Approved";
        leave.hrRemarks =
          "Converted to LOP because paid leave balance is exhausted.";

        await leave.save();

        return NextResponse.json({
          success: true,
          message:
            "Leave approved as LOP",
          leave,
        });
      }

      // ==================================================
      // MONTHLY PAID LEAVE RULE
      // ==================================================

      const availablePaidDays =
        Math.max(
          MONTHLY_PAID_LIMIT -
            paidDaysUsed,
          0
        );

      // ==================================================
      // NO PAID LEAVE LEFT THIS MONTH
      // → CONVERT ENTIRE REQUEST TO LOP
      // ==================================================

      if (
        availablePaidDays <= 0
      ) {
        leave.leaveType = "LOP";

        leave.status = "Approved";

        leave.hrRemarks =
          "Converted to LOP because the monthly paid leave allowance was already used.";

        await leave.save();

        return NextResponse.json({
          success: true,
          message:
            "Leave approved as LOP",
          leave,
        });
      }

      // ==================================================
      // PARTIALLY AVAILABLE
      // ==================================================

      if (
        requestedDays >
        availablePaidDays
      ) {
        /*
          Example:

          Monthly remaining = 0.5
          Requested = 1

          Because your Leave schema
          stores one leaveType for the
          entire request, we classify
          this request as LOP.
        */

        leave.leaveType = "LOP";

        leave.status = "Approved";

        leave.hrRemarks =
          "Converted to LOP because the monthly paid leave allowance was exceeded.";

        await leave.save();

        return NextResponse.json({
          success: true,
          message:
            "Leave approved as LOP",
          leave,
        });
      }

      // ==================================================
      // NORMAL PAID LEAVE
      // ==================================================

      leave.status = "Approved";
      leave.hrRemarks = "";

      await leave.save();

      return NextResponse.json({
        success: true,
        message:
          "Paid leave approved",
        leave,
      });
    }

    // ==================================================
    // FALLBACK
    // ==================================================

    leave.status = "Approved";
    leave.hrRemarks = "";

    await leave.save();

    return NextResponse.json({
      success: true,
      message: "Leave Approved",
      leave,
    });

  } catch (error) {
    console.error(
      "Update leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}