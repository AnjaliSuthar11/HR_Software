import { NextResponse } from "next/server";

import Salary from "@/models/Salary";
import { connectDB } from "@/lib/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        {
          success: false,
          message: "Month and year are required",
        },
        { status: 400 }
      );
    }

    const salaries = await Salary.find({
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

    const formatted = salaries.map((salary) => {
      /* =========================
         BASIC VALUES
      ========================= */

      const workingDays = Number(
        salary.workingDays || 0
      );

      const monthlySalary = Number(
        salary.monthlySalary || 0
      );

      const presentDays = Number(
        salary.presentDays || 0
      );

      const holidayDays = Number(
        salary.holidayDays || 0
      );

      const paidLeaveDays = Number(
        salary.paidLeaveDays || 0
      );

      const lopDays = Number(
        salary.lopDays || 0
      );

      const unpaidAbsenceDays = Number(
        salary.unpaidAbsenceDays || 0
      );

      const deductibleDays =
        lopDays + unpaidAbsenceDays;

      /* =========================
         PER DAY SALARY
      ========================= */

      const calculatedPerDay =
        workingDays > 0
          ? monthlySalary / workingDays
          : 0;

      const perDaySalary = Number(
        salary.perDaySalary ??
          calculatedPerDay
      );

      /* =========================
         LATE MARKS
      ========================= */

      const lateMarks = Number(
        salary.lateMarks || 0
      );

      const totalLateMinutes = Number(
        salary.totalLateMinutes || 0
      );

      /* =========================
         LATE DEDUCTION DAYS
         
         1-3 late  = 0 days
         4th late  = 0.5 day
         5th late  = 1 day
         6th late  = 1.5 days
         7th late  = 2 days
         ...
      ========================= */

      let calculatedLateDeductionDays = 0;

      if (lateMarks <= 3) {
        calculatedLateDeductionDays = 0;
      } else if (lateMarks === 4) {
        calculatedLateDeductionDays = 0.5;
      } else {
        calculatedLateDeductionDays =
          1 + (lateMarks - 5) * 0.5;
      }

      const calculatedLateDeduction =
        calculatedLateDeductionDays *
        perDaySalary;

      /*
        Check whether this salary record
        was generated with the new
        late deduction fields.
      */

      const hasLateDeductionField =
        Object.prototype.hasOwnProperty.call(
          salary,
          "lateDeduction"
        );

      const hasLateDeductionDaysField =
        Object.prototype.hasOwnProperty.call(
          salary,
          "lateDeductionDays"
        );

      /*
        For NEW records:
        use saved values.

        For OLD records:
        calculate them from lateMarks.
      */

      const lateDeductionDays =
        hasLateDeductionDaysField
          ? Number(
              salary.lateDeductionDays || 0
            )
          : calculatedLateDeductionDays;

      const lateDeduction =
        hasLateDeductionField
          ? Number(
              salary.lateDeduction || 0
            )
          : calculatedLateDeduction;

      /* =========================
         ABSENCE / LOP DEDUCTION
      ========================= */

      const absenceLeaveDeduction =
        deductibleDays * perDaySalary;

      /* =========================
         TOTAL DEDUCTION
      ========================= */

      let totalDeduction;

      /*
        New records:
        lopDeduction already contains

        LOP/unpaid deduction
        +
        late deduction
      */

      if (hasLateDeductionField) {
        totalDeduction = Number(
          salary.lopDeduction ??
            absenceLeaveDeduction +
              lateDeduction
        );
      } else {
        /*
          Old records:
          old lopDeduction generally contains
          only LOP + unpaid absence deduction.

          Therefore add late deduction here.
        */

        const oldDeduction =
          Number(
            salary.lopDeduction || 0
          ) || absenceLeaveDeduction;

        totalDeduction =
          oldDeduction + lateDeduction;
      }

      /* =========================
         NET SALARY
      ========================= */

      const actualNetSalary =
        monthlySalary - totalDeduction;

      const netSalary = Math.max(
        actualNetSalary,
        0
      );

      /* =========================
         PAID DAYS
      ========================= */

    const basePaidDays =
  presentDays +
  holidayDays +
  paidLeaveDays;

const paidDays = Math.max(
  basePaidDays - lateDeductionDays,
  0
);

      /* =========================
         RETURN
      ========================= */

      return {
        _id: salary._id,

        employeeId:
          salary.employeeId?._id || null,

        employeeName:
          salary.employeeId
            ?.employeeFullName ||
          "Unknown Employee",

        employeeCode:
          salary.employeeId
            ?.employeeCode || "-",

        employeePhoto:
          salary.employeeId
            ?.employeePhoto || "",

        month: salary.month,
        year: salary.year,

        /* =========================
           SALARY
        ========================= */

        actualSalary: monthlySalary,

        monthlySalary,

        /* =========================
           DAYS
        ========================= */

        workingDays,

        totalDays: workingDays,

        presentDays,

        holidayDays,

        paidLeaveDays,

        paidDays,

        payableDays: paidDays,

        /* =========================
           LEAVE
        ========================= */

        casualLeaveDays: Number(
          salary.casualLeaveDays || 0
        ),

        sickLeaveDays: Number(
          salary.sickLeaveDays || 0
        ),

        lopDays,

        unpaidAbsenceDays,

        deductibleDays,

        /* =========================
           LATE
        ========================= */

        lateMarks,

        totalLateMinutes,

        lateDeductionDays,

        lateDeduction,

        /* =========================
           PER DAY SALARY
        ========================= */

        perDaySalary,

        /* =========================
           DEDUCTION
        ========================= */

        absenceLeaveDeduction,

        totalDeduction,

        /*
          Keep lopDeduction as the
          final total deduction because
          your frontend already uses it.
        */

        lopDeduction: totalDeduction,

        /* =========================
           NET
        ========================= */

        netSalary,

        status: "Calculated",

        createdAt: salary.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      salaries: formatted,
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