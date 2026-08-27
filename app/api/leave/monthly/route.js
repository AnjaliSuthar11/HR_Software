import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

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

    const leaves =
      await Leave.find({
        employeeId,
        status: "Approved",
      })
        .sort({
          fromDate: -1,
        })
        .lean();

    const monthlyData = {};

    leaves.forEach((leave) => {
      const date =
        new Date(leave.fromDate);

      const year =
        date.getFullYear();

      const month =
        date.getMonth();

      const key =
        `${year}-${String(month + 1).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          year,
          month: month + 1,
          monthName: date.toLocaleString(
            "en-IN",
            {
              month: "long",
            }
          ),
          paidDays: 0,
          lopDays: 0,
          leaves: [],
        };
      }

      const days =
        Number(
          leave.numberOfDays || 0
        );

      if (
        leave.leaveType === "LOP"
      ) {
        monthlyData[key].lopDays +=
          days;
      } else {
        monthlyData[key].paidDays +=
          days;
      }

      monthlyData[key].leaves.push({
        id: leave._id,
        leaveType:
          leave.leaveType,
        fromDate:
          leave.fromDate,
        toDate:
          leave.toDate,
        duration:
          leave.duration,
        numberOfDays:
          leave.numberOfDays,
        reason:
          leave.reason,
      });
    });

    return NextResponse.json({
      success: true,
      months:
        Object.values(monthlyData),
    });
  } catch (error) {
    console.error(
      "Monthly leave error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch monthly leave",
      },
      { status: 500 }
    );
  }
}