import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import Employee from "@/models/Employee";
import Salary from "@/models/Salary";
import { NextResponse } from "next/server";


// ======================================================
// DATE KEY
// ======================================================

function getDateKey(date) {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}


// ======================================================
// GET ALL DATE KEYS
// ======================================================

function getDateKeys(
  fromDate,
  toDate
) {
  const dates = [];

  const current =
    new Date(fromDate);

  const end =
    new Date(toDate);

  current.setHours(
    0,
    0,
    0,
    0
  );

  end.setHours(
    0,
    0,
    0,
    0
  );

  while (
    current <= end
  ) {
    dates.push(
      getDateKey(current)
    );

    current.setDate(
      current.getDate() + 1
    );
  }

  return dates;
}


// ======================================================
// POST
// ======================================================

export async function POST(req) {
  try {
    await connectDB();

    const {
      employeeId,
      month,
      year,
      monthlySalary,
    } = await req.json();


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !employeeId ||
      !month ||
      !year ||
      monthlySalary ===
        undefined ||
      monthlySalary ===
        null ||
      monthlySalary === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee, month, year and monthly salary are required",
        },
        {
          status: 400,
        }
      );
    }


    const numericMonth =
      Number(month);

    const numericYear =
      Number(year);

    const salaryAmount =
      Number(monthlySalary);


    if (
      numericMonth < 1 ||
      numericMonth > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid month",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !Number.isFinite(
        salaryAmount
      ) ||
      salaryAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Monthly salary must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }


    // ==================================================
    // EMPLOYEE
    // ==================================================

    const employee =
      await Employee.findById(
        employeeId
      ).lean();

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee not found",
        },
        {
          status: 404,
        }
      );
    }


    // ==================================================
    // MONTH
    // ==================================================

    const monthStart =
      new Date(
        numericYear,
        numericMonth - 1,
        1
      );

    const nextMonthStart =
      new Date(
        numericYear,
        numericMonth,
        1
      );

    const calendarDays =
      new Date(
        numericYear,
        numericMonth,
        0
      ).getDate();


    // ==================================================
    // ATTENDANCE
    // ==================================================

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


    if (
      attendance.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No attendance found for this month",
        },
        {
          status: 400,
        }
      );
    }


    // ==================================================
    // APPROVED LEAVES
    // ==================================================

    const approvedLeaves =
      await Leave.find({
        employeeId,

        status:
          "Approved",

        fromDate: {
          $lt: nextMonthStart,
        },

        toDate: {
          $gte: monthStart,
        },
      })
        .sort({
          fromDate: 1,
        })
        .lean();


    // ==================================================
    // ATTENDANCE MAP
    // ==================================================

    const attendanceMap =
      {};

    for (
      const record of
        attendance
    ) {
      attendanceMap[
        getDateKey(
          record.date
        )
      ] = record;
    }


    // ==================================================
    // LEAVE MAP
    // ==================================================

    const leaveMap =
      {};

    for (
      const leave of
        approvedLeaves
    ) {
      const keys =
        getDateKeys(
          leave.fromDate,
          leave.toDate
        );

      for (
        const key of keys
      ) {
        leaveMap[key] =
          leave;
      }
    }


    // ==================================================
    // COUNTERS
    // ==================================================

    let holidayDays = 0;

    let presentDays = 0;

    let absentDays = 0;

    let casualLeaveDays = 0;

    let sickLeaveDays = 0;

    let paidLeaveDays = 0;

    let lopDays = 0;

    let unpaidAbsenceDays = 0;

    let lateMarks = 0;

    let totalLateMinutes = 0;


    // ==================================================
    // PROCESS EVERY CALENDAR DAY
    // ==================================================

    for (
      let day = 1;
      day <= calendarDays;
      day++
    ) {

      const date =
        new Date(
          numericYear,
          numericMonth - 1,
          day
        );

      date.setHours(
        0,
        0,
        0,
        0
      );

      const key =
        getDateKey(date);


      // ================================================
      // SUNDAY
      // ================================================

      if (
        date.getDay() === 0
      ) {
        holidayDays++;

        continue;
      }


      // ================================================
      // ATTENDANCE
      // ================================================

      const record =
        attendanceMap[key];


      // ================================================
      // LEAVE
      // ================================================

      const leave =
        leaveMap[key];


      // ================================================
      // LATE
      // ================================================

      if (
        record?.lateMark ===
        true
      ) {
        lateMarks++;

        totalLateMinutes +=
          Number(
            record.lateMinutes ||
              0
          );
      }


      // ================================================
      // ACTUAL ABSENCE
      // ================================================

      if (
        record?.status ===
        "Absent"
      ) {

        // ----------------------------------------------
        // CASUAL LEAVE
        // ----------------------------------------------

        if (
          leave &&
          leave.leaveType ===
            "CL"
        ) {

          const days =
            leave.duration ===
            "Half Day"
              ? 0.5
              : 1;

          casualLeaveDays +=
            days;

          paidLeaveDays +=
            days;

          continue;
        }


        // ----------------------------------------------
        // SICK LEAVE
        // ----------------------------------------------

        if (
          leave &&
          leave.leaveType ===
            "SL"
        ) {

          const days =
            leave.duration ===
            "Half Day"
              ? 0.5
              : 1;

          sickLeaveDays +=
            days;

          paidLeaveDays +=
            days;

          continue;
        }


        // ----------------------------------------------
        // LOP
        // ----------------------------------------------

        if (
          leave &&
          leave.leaveType ===
            "LOP"
        ) {

          const days =
            leave.duration ===
            "Half Day"
              ? 0.5
              : 1;

          lopDays +=
            days;

          continue;
        }


        // ----------------------------------------------
        // NO APPROVED LEAVE
        // ----------------------------------------------

        unpaidAbsenceDays++;

        absentDays++;

        continue;
      }


      // ================================================
      // PRESENT
      // ================================================

      if (
        record?.status ===
        "Present"
      ) {
        presentDays++;

        continue;
      }


      // ================================================
      // BLANK / NO RECORD
      // ================================================
      //
      // Blank is NOT absence.
      //
      // Therefore:
      // no deduction.
      //
    }


    // ==================================================
    // WORKING DAYS
    // ==================================================
    //
    // You specifically asked that working days
    // include the full number of calendar days.
    //
    // May = 31
    // June = 30
    //

    const workingDays =
      calendarDays;


    // ==================================================
    // PER DAY SALARY
    // ==================================================

    const perDaySalary =
      salaryAmount /
      workingDays;


    // ==================================================
    // DEDUCTIBLE DAYS
    // ==================================================

    const deductibleDays =
      lopDays +
      unpaidAbsenceDays;


    // ==================================================
    // DEDUCTION
    // ==================================================

    const totalDeduction =
      deductibleDays *
      perDaySalary;


    // ==================================================
    // PAYABLE DAYS
    // ==================================================

    const payableDays =
      Math.max(
        workingDays -
          deductibleDays,
        0
      );


    // ==================================================
    // NET SALARY
    // ==================================================

    const netSalary =
      Math.max(
        salaryAmount -
          totalDeduction,
        0
      );


    // ==================================================
    // SAVE
    // ==================================================

    const salaryRecord =
      await Salary.findOneAndUpdate(
        {
          employeeId,

          month:
            numericMonth,

          year:
            numericYear,
        },

        {
          employeeId,

          month:
            numericMonth,

          year:
            numericYear,

          monthlySalary:
            salaryAmount,

          workingDays,

          holidayDays,

          presentDays,

          absentDays,

          casualLeaveDays,

          sickLeaveDays,

          paidLeaveDays,

          lopDays,

          unpaidAbsenceDays,

          lateMarks,

          totalLateMinutes,

          payableDays,

          perDaySalary,

          lopDeduction:
            totalDeduction,

          netSalary,

          generatedAt:
            new Date(),
        },

        {
          upsert: true,

          new: true,
        }
      );


    // ==================================================
    // RETURN FRESH CALCULATION
    // ==================================================

    const calculation = {
      calendarDays,

      workingDays,

      holidayDays,

      presentDays,

      absentDays,

      casualLeaveDays,

      sickLeaveDays,

      paidLeaveDays,

      lopDays,

      unpaidAbsenceDays,

      lateMarks,

      totalLateMinutes,

      deductibleDays,

      perDaySalary,

      totalDeduction,

      payableDays,

      netSalary,
    };


    return NextResponse.json({
      success: true,

      message:
        "Salary calculated successfully",

      salary: {
        ...salaryRecord.toObject(),

        ...calculation,

        lopDeduction:
          totalDeduction,

        netSalary,
      },

      calculation,
    });

  } catch (error) {

    console.error(
      "Salary calculation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to calculate salary",
      },
      {
        status: 500,
      }
    );
  }
}