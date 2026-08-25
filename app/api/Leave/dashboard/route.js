import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    /*
      TEMPORARY EMPLOYEE ID

      We will replace this with the
      logged-in employee ID once your
      authentication is connected.
    */

    const employeeId = req.headers.get("x-employee-id");

    if (!employeeId) {
      return NextResponse.json({
        success: true,

        balance: {
          casualLeave: 6,
          sickLeave: 6,
          lop: 0,
        },

        requests: {
          pending: 0,
          approved: 0,
          rejected: 0,
        },
      });
    }

    const currentYear = new Date().getFullYear();

    const leaves = await Leave.find({
      employeeId,
      year: currentYear,
    });

    let casualUsed = 0;
    let sickUsed = 0;
    let lop = 0;

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    leaves.forEach((leave) => {

      if (leave.status === "Pending") {
        pending++;
      }

      if (leave.status === "Approved") {
        approved++;

        if (leave.leaveType === "CL") {
          casualUsed += leave.numberOfDays;
        }

        if (leave.leaveType === "SL") {
          sickUsed += leave.numberOfDays;
        }

        if (leave.leaveType === "LOP") {
          lop += leave.numberOfDays;
        }
      }

      if (leave.status === "Rejected") {
        rejected++;
      }

    });

    return NextResponse.json({
      success: true,

      balance: {
        casualLeave: Math.max(0, 6 - casualUsed),
        sickLeave: Math.max(0, 6 - sickUsed),
        lop,
      },

      requests: {
        pending,
        approved,
        rejected,
      },
    });

  } catch (error) {

    console.error("Leave Dashboard Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}