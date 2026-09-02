import { NextResponse } from "next/server";



import Salary from "@/models/Salary";
import { connectDB } from "@/lib/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const month =
      Number(
        searchParams.get("month")
      );

    const year =
      Number(
        searchParams.get("year")
      );


    if (
      !month ||
      !year
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Month and year are required",
        },
        {
          status: 400,
        }
      );
    }


    const salaries =
      await Salary.find({
        month,
        year,
      })
        .populate(
          "employeeId",
          "employeeFullName employeeCode employeePhoto"
        )
        .sort({
          createdAt: 1,
        })
        .lean();


    const formatted =
      salaries.map(
        (salary) => {
          const workingDays =
            Number(
              salary.workingDays ||
                0
            );


          const presentDays =
            Number(
              salary.presentDays ||
                0
            );


          const holidayDays =
            Number(
              salary.holidayDays ||
                0
            );


          const paidLeaveDays =
            Number(
              salary.paidLeaveDays ||
                0
            );


          const lopDays =
            Number(
              salary.lopDays ||
                0
            );


          const unpaidAbsenceDays =
            Number(
              salary.unpaidAbsenceDays ||
                0
            );


          /*
            ALWAYS use the saved
            lopDeduction field.
          */

          const lopDeduction =
            Number(
              salary.lopDeduction ||
                0
            );


          /*
            If old records don't have
            lopDeduction, calculate it
            from their saved values.
          */

          const deductibleDays =
            lopDays +
            unpaidAbsenceDays;


          const calculatedPerDay =
            workingDays > 0
              ? Number(
                  salary.monthlySalary ||
                    0
                ) /
                workingDays
              : 0;


          const deduction =
            lopDeduction > 0
              ? lopDeduction
              : deductibleDays *
                calculatedPerDay;


          const actualNetSalary =
            Number(
              salary.monthlySalary ||
                0
            ) -
            deduction;


          return {
            _id:
              salary._id,

            employeeId:
              salary.employeeId?._id ||
              null,

            employeeName:
              salary.employeeId
                ?.employeeFullName ||
              "Unknown Employee",

            employeeCode:
              salary.employeeId
                ?.employeeCode ||
              "-",

            employeePhoto:
              salary.employeeId
                ?.employeePhoto ||
              "",


            month:
              salary.month,

            year:
              salary.year,


            /*
              Actual monthly salary
            */

            actualSalary:
              Number(
                salary.monthlySalary ||
                  0
              ),


            /*
              Total calendar days
            */

            workingDays,


            totalDays:
              workingDays,


            /*
              Attendance
            */

            presentDays,

            holidayDays,


            /*
              Leave
            */

            casualLeaveDays:
              Number(
                salary.casualLeaveDays ||
                  0
              ),

            sickLeaveDays:
              Number(
                salary.sickLeaveDays ||
                  0
              ),

            paidLeaveDays,


            /*
              Paid days =
              Present + Holiday + Paid Leave
            */

            paidDays:
              Number(
                salary.payableDays ||
                  presentDays +
                    holidayDays +
                    paidLeaveDays
              ),


            /*
              Deduction
            */

            lopDays,

            unpaidAbsenceDays,

            deductibleDays,


            /*
              Salary
            */

            perDaySalary:
              Number(
                salary.perDaySalary ||
                  calculatedPerDay
              ),


            /*
              IMPORTANT
            */

            totalDeduction:
              deduction,

            lopDeduction:
              deduction,


            netSalary:
              Math.max(
                actualNetSalary,
                0
              ),


            lateMarks:
              Number(
                salary.lateMarks ||
                  0
              ),

            totalLateMinutes:
              Number(
                salary.totalLateMinutes ||
                  0
              ),


            status:
              "Calculated",


            createdAt:
              salary.createdAt,
          };
        }
      );


    return NextResponse.json({
      success: true,

      salaries:
        formatted,
    });
  } catch (error) {
    console.error(
      "Salary list error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Unable to load salary register",
      },
      {
        status: 500,
      }
    );
  }
}