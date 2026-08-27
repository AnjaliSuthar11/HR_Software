import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const employeeId =
      searchParams.get(
        "employeeId"
      );

    const month =
      Number(
        searchParams.get(
          "month"
        )
      );

    const year =
      Number(
        searchParams.get(
          "year"
        )
      );


    if (
      !employeeId ||
      !month ||
      !year
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee, month and year are required",
        },
        {
          status: 400,
        }
      );
    }


    const monthStart =
      new Date(
        year,
        month - 1,
        1
      );

    const nextMonthStart =
      new Date(
        year,
        month,
        1
      );


    const attendance =
      await Attendance.find({
        employeeId,

        date: {
          $gte: monthStart,
          $lt: nextMonthStart,
        },
      })
        .sort({
          date: 1,
        })
        .lean();


    return NextResponse.json({
      success: true,
      attendance,
    });

  } catch (error) {

    console.error(
      "Get attendance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to fetch attendance",
      },
      {
        status: 500,
      }
    );
  }
}