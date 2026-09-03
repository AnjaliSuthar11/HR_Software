// 2nd september new code for register salry and payroll and other 
import { NextResponse } from "next/server";

import Employee from "@/models/Employee";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import Holiday from "@/models/Holiday";
import Salary from "@/models/Salary";

import { connectDB } from "@/lib/mongodb";

// ============================================================
// DATE KEY
// ============================================================

function getDateKey(date) {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// ============================================================
// SECOND SATURDAY
// ============================================================

function isSecondSaturday(date) {
  return (
    date.getDay() === 6 &&
    Math.ceil(date.getDate() / 7) === 2
  );
}

// ============================================================
// FOURTH SATURDAY
// ============================================================

function isFourthSaturday(date) {
  return (
    date.getDay() === 6 &&
    Math.ceil(date.getDate() / 7) === 4
  );
}

// ============================================================
// API
// ============================================================

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      employeeId,
      month,
      year,
      monthlySalary,
    } = body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee is required",
        },
        { status: 400 }
      );
    }

    if (!month || !year) {
      return NextResponse.json(
        {
          success: false,
          message: "Month and year are required",
        },
        { status: 400 }
      );
    }

    if (
      monthlySalary === undefined ||
      monthlySalary === null ||
      Number(monthlySalary) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid monthly salary is required",
        },
        { status: 400 }
      );
    }

    const salaryAmount = Number(monthlySalary);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    // ========================================================
    // EMPLOYEE
    // ========================================================

    const employee = await Employee.findById(employeeId).lean();

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    // ========================================================
    // TOTAL CALENDAR DAYS
    // ========================================================

    const calendarDays = new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();

    const firstDay = new Date(
      selectedYear,
      selectedMonth - 1,
      1
    );

    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(
      selectedYear,
      selectedMonth - 1,
      calendarDays
    );

    lastDay.setHours(23, 59, 59, 999);

    // ========================================================
    // ATTENDANCE
    // ========================================================

    const attendance = await Attendance.find({
      employeeId,
      date: {
        $gte: firstDay,
        $lte: lastDay,
      },
    })
      .sort({ date: 1 })
      .lean();

    const attendanceMap = {};

    attendance.forEach((record) => {
      const key = getDateKey(record.date);
      attendanceMap[key] = record;
    });

    // ========================================================
    // APPROVED LEAVES
    // ========================================================

    const approvedLeaves = await Leave.find({
      employeeId,
      status: "Approved",
    })
      .sort({ fromDate: 1 })
      .lean();

    // ========================================================
    // HR HOLIDAYS
    // ========================================================

    const holidays = await Holiday.find({
      date: {
        $gte: new Date(selectedYear, 0, 1),
        $lt: new Date(selectedYear + 1, 0, 1),
      },
    }).lean();

    const holidayMap = {};

    holidays
      .filter((holiday) => holiday.paid !== false)
      .forEach((holiday) => {
        holidayMap[getDateKey(holiday.date)] = holiday;
      });

    // ========================================================
    // BIRTHDAY
    // ========================================================

    let birthdayKey = null;

    if (employee.dateOfBirth) {
      const dob = new Date(employee.dateOfBirth);

      const birthday = new Date(
        selectedYear,
        dob.getMonth(),
        dob.getDate()
      );

      birthday.setHours(0, 0, 0, 0);

      birthdayKey = getDateKey(birthday);
    }

    // ========================================================
    // LEAVE TREATMENT
    //
    // First CL / SL day in month = PAID
    // Next CL / SL days = LOP
    // Direct LOP = LOP
    //
    // Holiday always wins
    // Leave only applies when attendance = Absent
    // ========================================================

    const leaveTreatmentMap = {};

    let paidLeaveUsed = 0;

    for (const leave of approvedLeaves) {
      const start = new Date(leave.fromDate);
      const end = new Date(leave.toDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const current = new Date(start);

      while (current <= end) {
        const key = getDateKey(current);

        // Only selected month
        if (
          current >= firstDay &&
          current <= lastDay
        ) {
          const sunday =
            current.getDay() === 0;

          const secondSaturday =
            isSecondSaturday(current);

          const fourthSaturday =
            isFourthSaturday(current);

          const hrHoliday =
            holidayMap[key];

          const birthday =
            birthdayKey === key;

          const isHoliday =
            sunday ||
            secondSaturday ||
            fourthSaturday ||
            !!hrHoliday ||
            birthday;

          // Holiday always wins
          if (!isHoliday) {
            const record =
              attendanceMap[key];

            // Leave only applies to absent attendance
            if (record?.status === "Absent") {
              const requestedDays =
                leave.duration === "Half Day"
                  ? 0.5
                  : 1;

              // ==================================================
              // CL / SL
              // ==================================================

              if (
                leave.leaveType === "CL" ||
                leave.leaveType === "SL"
              ) {
                let paidDays = 0;
                let lopDaysForLeave = 0;

                if (paidLeaveUsed < 1) {
                  const available =
                    1 - paidLeaveUsed;

                  paidDays = Math.min(
                    requestedDays,
                    available
                  );

                  lopDaysForLeave = Math.max(
                    requestedDays - paidDays,
                    0
                  );

                  paidLeaveUsed += paidDays;
                } else {
                  lopDaysForLeave =
                    requestedDays;
                }

                leaveTreatmentMap[key] = {
                  leaveType:
                    leave.leaveType,

                  leaveName:
                    leave.leaveType === "CL"
                      ? "Casual Leave"
                      : "Sick Leave",

                  payment:
                    lopDaysForLeave > 0
                      ? "LOP"
                      : "Paid",

                  paidDays,
                  lopDays:
                    lopDaysForLeave,
                };
              }

              // ==================================================
              // DIRECT LOP
              // ==================================================

              if (
                leave.leaveType === "LOP"
              ) {
                leaveTreatmentMap[key] = {
                  leaveType: "LOP",
                  leaveName: "Loss of Pay",
                  payment: "LOP",
                  paidDays: 0,
                  lopDays: requestedDays,
                };
              }
            }
          }
        }

        current.setDate(
          current.getDate() + 1
        );
      }
    }

    // ========================================================
    // COUNTERS
    // ========================================================

    let presentDays = 0;
    let holidayDays = 0;

    let casualLeaveDays = 0;
    let sickLeaveDays = 0;
    let paidLeaveDays = 0;

    let lopDays = 0;
    let unpaidAbsenceDays = 0;

    let lateMarks = 0;
    let totalLateMinutes = 0;

    // ========================================================
    // DAY BY DAY CLASSIFICATION
    //
    // Every calendar date gets exactly ONE classification:
    //
    // Holiday
    // Present
    // Paid Leave
    // LOP
    // Unpaid Absence
    // ========================================================

    for (
      let day = 1;
      day <= calendarDays;
      day++
    ) {
      const date = new Date(
        selectedYear,
        selectedMonth - 1,
        day
      );

      date.setHours(0, 0, 0, 0);

      const key = getDateKey(date);

      const record =
        attendanceMap[key];

      // ====================================================
      // HOLIDAY
      // ====================================================

      const sunday =
        date.getDay() === 0;

      const secondSaturday =
        isSecondSaturday(date);

      const fourthSaturday =
        isFourthSaturday(date);

      const hrHoliday =
        holidayMap[key];

      const birthday =
        birthdayKey === key;

      const isHoliday =
        sunday ||
        secondSaturday ||
        fourthSaturday ||
        !!hrHoliday ||
        birthday;

      if (isHoliday) {
        holidayDays++;
        continue;
      }

      // ====================================================
      // PRESENT
      // ====================================================

      if (
        record?.status === "Present"
      ) {
        presentDays++;

        if (record.lateMark === true) {
          lateMarks++;

          totalLateMinutes += Number(
            record.lateMinutes || 0
          );
        }

        continue;
      }

      // ====================================================
      // APPROVED LEAVE
      // ====================================================

      const leaveInfo =
        leaveTreatmentMap[key];

      if (leaveInfo) {
        const paid = Number(
          leaveInfo.paidDays || 0
        );

        const lop = Number(
          leaveInfo.lopDays || 0
        );

        paidLeaveDays += paid;
        lopDays += lop;

        if (
          leaveInfo.leaveType === "CL"
        ) {
          casualLeaveDays += paid;
        }

        if (
          leaveInfo.leaveType === "SL"
        ) {
          sickLeaveDays += paid;
        }

        continue;
      }

      // ====================================================
      // UNPAID ABSENCE
      // ====================================================

      unpaidAbsenceDays++;
    }

    // ========================================================
    // CLASSIFICATION VALIDATION
    // ========================================================

    const classifiedDays =
      presentDays +
      holidayDays +
      paidLeaveDays +
      lopDays +
      unpaidAbsenceDays;

    console.log(
      "========================================"
    );

    console.log(
      "SALARY CALCULATION"
    );

    console.log(
      "Employee:",
      employee.employeeFullName
    );

    console.log(
      "Month:",
      selectedMonth,
      selectedYear
    );

    console.log(
      "Calendar Days:",
      calendarDays
    );

    console.log(
      "Present Days:",
      presentDays
    );

    console.log(
      "Holiday Days:",
      holidayDays
    );

    console.log(
      "Paid Leave Days:",
      paidLeaveDays
    );

    console.log(
      "LOP Days:",
      lopDays
    );

    console.log(
      "Unpaid Absence Days:",
      unpaidAbsenceDays
    );

    console.log(
      "Classified Days:",
      classifiedDays
    );

    console.log(
      "Classification Valid:",
      classifiedDays === calendarDays
    );

    console.log(
      "Late Marks:",
      lateMarks
    );

    console.log(
      "Total Late Minutes:",
      totalLateMinutes
    );

    // ========================================================
    // STOP IF CLASSIFICATION IS IMPOSSIBLE
    // ========================================================

    if (
      classifiedDays !== calendarDays
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Attendance classification error. ` +
            `${classifiedDays} days classified ` +
            `for a ${calendarDays}-day month.`,
          details: {
            calendarDays,
            presentDays,
            holidayDays,
            paidLeaveDays,
            lopDays,
            unpaidAbsenceDays,
            classifiedDays,
          },
        },
        { status: 400 }
      );
    }

    // ========================================================
    // PER DAY SALARY
    // ========================================================

    const perDaySalary =
      salaryAmount / calendarDays;

    // ========================================================
    // LATE DEDUCTION DAYS
    //
    // 1-3 = 0
    // 4th = 0.5
    // 5th = 1
    // 6th = 1.5
    // 7th = 2
    // etc.
    // ========================================================

    let lateDeductionDays = 0;

    if (lateMarks <= 3) {
      lateDeductionDays = 0;
    } else if (lateMarks === 4) {
      lateDeductionDays = 0.5;
    } else {
      lateDeductionDays =
        1 +
        (lateMarks - 5) * 0.5;
    }

    // ========================================================
    // LATE DEDUCTION MONEY
    // ========================================================

    const lateDeduction =
      lateDeductionDays *
      perDaySalary;

    // ========================================================
    // BASE PAID DAYS
    //
    // Present + Holiday + Paid Leave
    // ========================================================

    const basePaidDays =
      presentDays +
      holidayDays +
      paidLeaveDays;

    // ========================================================
    // FINAL PAID DAYS
    //
    // Subtract late deduction days
    // ========================================================

    const payableDays = Math.max(
      basePaidDays -
        lateDeductionDays,
      0
    );

    // ========================================================
    // DEDUCTIBLE DAYS
    //
    // LOP + Unpaid Absence
    //
    // NOTE:
    // Late deduction is NOT included here.
    // It is calculated separately.
    // ========================================================

    const deductibleDays =
      lopDays +
      unpaidAbsenceDays;

    // ========================================================
    // ABSENCE / LEAVE DEDUCTION
    // ========================================================

    const absenceLeaveDeduction =
      deductibleDays *
      perDaySalary;

    // ========================================================
    // TOTAL DEDUCTION
    //
    // LOP + Unpaid Absence + Late Penalty
    // ========================================================

    const totalDeduction =
      absenceLeaveDeduction +
      lateDeduction;

    // ========================================================
    // NET SALARY
    // ========================================================

    const netSalary = Math.max(
      salaryAmount -
        totalDeduction,
      0
    );

    // ========================================================
    // LOG FINAL CALCULATION
    // ========================================================

    console.log(
      "Late Deduction Days:",
      lateDeductionDays
    );

    console.log(
      "Per Day Salary:",
      perDaySalary
    );

    console.log(
      "Base Paid Days:",
      basePaidDays
    );

    console.log(
      "Final Paid Days:",
      payableDays
    );

    console.log(
      "Late Deduction:",
      lateDeduction
    );

    console.log(
      "Absence/Leave Deduction:",
      absenceLeaveDeduction
    );

    console.log(
      "Total Deduction:",
      totalDeduction
    );

    console.log(
      "Net Salary:",
      netSalary
    );

    console.log(
      "========================================"
    );

    // ========================================================
    // SAVE SALARY
    // ========================================================

    const savedSalary =
      await Salary.findOneAndUpdate(
        {
          employeeId,

          month: selectedMonth,

          year: selectedYear,
        },

        {
          employeeId,

          month: selectedMonth,

          year: selectedYear,

          monthlySalary:
            salaryAmount,

          // Calendar days
          workingDays:
            calendarDays,

          holidayDays,

          presentDays,

          // Existing schema field
          absentDays:
            unpaidAbsenceDays,

          casualLeaveDays,

          sickLeaveDays,

          paidLeaveDays,

          lopDays,

          unpaidAbsenceDays,

          lateMarks,

          totalLateMinutes,

          // Late deduction
          lateDeductionDays,

          lateDeduction,

          // Final paid days
          payableDays,

          perDaySalary,

          // Complete deduction
          lopDeduction:
            totalDeduction,

          netSalary,

          generatedAt:
            new Date(),
        },

        {
          new: true,

          upsert: true,

          runValidators: true,

          setDefaultsOnInsert: true,
        }
      ).lean();

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,

      message:
        "Salary calculated and saved successfully",

      salary: {
        ...savedSalary,

        employeeName:
          employee.employeeFullName,

        employeeCode:
          employee.employeeCode,

        totalCalendarDays:
          calendarDays,

        deductibleDays,

        // Final paid days
        paidDays:
          payableDays,

        // Late details
        lateDeductionDays,

        lateDeduction,

        absenceLeaveDeduction,

        totalDeduction,

        netSalary,
      },
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






// 31st working for calender
// import { connectDB } from "@/lib/mongodb";
// import Attendance from "@/models/Attendance";
// import Leave from "@/models/Leave";
// import Employee from "@/models/Employee";
// import Salary from "@/models/Salary";
// import Holiday from "@/models/Holiday";
// import { NextResponse } from "next/server";

// // ======================================================
// // DATE KEY
// // ======================================================

// function getDateKey(date) {
//   const d = new Date(date);

//   return `${d.getFullYear()}-${String(
//     d.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;
// }

// // ======================================================
// // LEAVE DAY VALUE
// // ======================================================

// function getLeaveDays(leave) {
//   return leave.duration === "Half Day"
//     ? 0.5
//     : 1;
// }

// // ======================================================
// // POST
// // ======================================================

// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       employeeId,
//       month,
//       year,
//       monthlySalary,
//     } = body;

//     // ==================================================
//     // VALIDATION
//     // ==================================================

//     if (
//       !employeeId ||
//       month === undefined ||
//       year === undefined ||
//       monthlySalary === undefined ||
//       monthlySalary === null ||
//       monthlySalary === ""
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Employee, month, year and monthly salary are required",
//         },
//         { status: 400 }
//       );
//     }

//     const numericMonth = Number(month);
//     const numericYear = Number(year);
//     const salaryAmount = Number(monthlySalary);

//     if (
//       !Number.isInteger(numericMonth) ||
//       numericMonth < 1 ||
//       numericMonth > 12
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid month",
//         },
//         { status: 400 }
//       );
//     }

//     if (
//       !Number.isInteger(numericYear)
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid year",
//         },
//         { status: 400 }
//       );
//     }

//     if (
//       !Number.isFinite(salaryAmount) ||
//       salaryAmount <= 0
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Monthly salary must be greater than zero",
//         },
//         { status: 400 }
//       );
//     }

//     // ==================================================
//     // EMPLOYEE
//     // ==================================================

//     const employee =
//       await Employee.findById(
//         employeeId
//       ).lean();

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Employee not found",
//         },
//         { status: 404 }
//       );
//     }

//     // ==================================================
//     // MONTH RANGE
//     // ==================================================

//     const monthStart =
//       new Date(
//         numericYear,
//         numericMonth - 1,
//         1
//       );

//     monthStart.setHours(
//       0,
//       0,
//       0,
//       0
//     );

//     const nextMonthStart =
//       new Date(
//         numericYear,
//         numericMonth,
//         1
//       );

//     nextMonthStart.setHours(
//       0,
//       0,
//       0,
//       0
//     );

//     const totalDays =
//       new Date(
//         numericYear,
//         numericMonth,
//         0
//       ).getDate();

//     // ==================================================
//     // ATTENDANCE
//     // ==================================================

//     const attendance =
//       await Attendance.find({
//         employeeId,

//         date: {
//           $gte: monthStart,
//           $lt: nextMonthStart,
//         },
//       })
//         .sort({
//           date: 1,
//         })
//         .lean();

//     // ==================================================
//     // APPROVED LEAVES
//     // ==================================================

//     const approvedLeaves =
//       await Leave.find({
//         employeeId,

//         status: "Approved",

//         fromDate: {
//           $lt: nextMonthStart,
//         },

//         toDate: {
//           $gte: monthStart,
//         },
//       })
//         .sort({
//           fromDate: 1,
//           createdAt: 1,
//         })
//         .lean();

//     // ==================================================
//     // HR PAID HOLIDAYS
//     // ==================================================

//     const hrHolidays =
//       await Holiday.find({
//         paid: true,

//         date: {
//           $gte: monthStart,
//           $lt: nextMonthStart,
//         },
//       })
//         .sort({
//           date: 1,
//         })
//         .lean();

//     // ==================================================
//     // ATTENDANCE MAP
//     // ==================================================

//     const attendanceMap = {};

//     for (
//       const record of attendance
//     ) {
//       attendanceMap[
//         getDateKey(record.date)
//       ] = record;
//     }

//     // ==================================================
//     // HR HOLIDAY MAP
//     // ==================================================

//     const holidayMap = {};

//     for (
//       const holiday of hrHolidays
//     ) {
//       holidayMap[
//         getDateKey(holiday.date)
//       ] = holiday;
//     }

//     // ==================================================
//     // EMPLOYEE BIRTHDAY
//     // ==================================================

//     let birthdayKey = null;

//     if (
//       employee.dateOfBirth
//     ) {
//       const dob =
//         new Date(
//           employee.dateOfBirth
//         );

//       const birthday =
//         new Date(
//           numericYear,
//           dob.getMonth(),
//           dob.getDate()
//         );

//       birthday.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       birthdayKey =
//         getDateKey(
//           birthday
//         );
//     }

//     // ==================================================
//     // LEAVE MAP
//     // ==================================================

//     const leaveMap = {};

//     for (
//       const leave of approvedLeaves
//     ) {
//       const start =
//         new Date(
//           leave.fromDate
//         );

//       const end =
//         new Date(
//           leave.toDate
//         );

//       start.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       end.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       const current =
//         new Date(start);

//       while (
//         current <= end
//       ) {
//         if (
//           current >= monthStart &&
//           current < nextMonthStart
//         ) {
//           const key =
//             getDateKey(
//               current
//             );

//           leaveMap[key] =
//             leave;
//         }

//         current.setDate(
//           current.getDate() + 1
//         );
//       }
//     }

//     // ==================================================
//     // COUNTERS
//     // ==================================================

//     let presentDays = 0;
//     let absentDays = 0;
//     let holidayDays = 0;

//     let casualLeaveDays = 0;
//     let sickLeaveDays = 0;
//     let paidLeaveDays = 0;

//     let lopDays = 0;
//     let unpaidAbsenceDays = 0;

//     let lateMarks = 0;
//     let totalLateMinutes = 0;

//     // ==================================================
//     // ONLY ONE PAID CL OR SL PER MONTH
//     // ==================================================

//     let paidLeaveUsed = 0;

//     // ==================================================
//     // PROCESS EVERY CALENDAR DAY
//     // ==================================================

//     for (
//       let day = 1;
//       day <= totalDays;
//       day++
//     ) {
//       const date =
//         new Date(
//           numericYear,
//           numericMonth - 1,
//           day
//         );

//       date.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       const key =
//         getDateKey(date);

//       const record =
//         attendanceMap[key];

//       const leave =
//         leaveMap[key];

//       const hrHoliday =
//         holidayMap[key];

//       const isSunday =
//         date.getDay() === 0;

//       const isBirthday =
//         birthdayKey === key;

//       // =================================================
//       // 1. SUNDAY
//       // =================================================

//       if (
//         isSunday
//       ) {
//         holidayDays++;

//         continue;
//       }

//       // =================================================
//       // 2. HR HOLIDAY
//       // =================================================

//       if (
//         hrHoliday
//       ) {
//         /*
//           HR holiday ALWAYS wins.

//           Even if:
//           - machine says Absent
//           - CL was approved earlier
//           - SL was approved earlier
//           - LOP was approved earlier

//           Payroll treats this as a paid holiday.

//           It does not consume CL/SL.
//         */

//         holidayDays++;

//         continue;
//       }

//       // =================================================
//       // 3. EMPLOYEE BIRTHDAY
//       // =================================================

//       if (
//         isBirthday
//       ) {
//         holidayDays++;

//         continue;
//       }

//       // =================================================
//       // 4. LATE MARK
//       // =================================================

//       if (
//         record?.lateMark === true
//       ) {
//         lateMarks++;

//         totalLateMinutes +=
//           Number(
//             record.lateMinutes || 0
//           );
//       }

//       // =================================================
//       // 5. PRESENT
//       // =================================================

//       if (
//         record?.status === "Present"
//       ) {
//         presentDays++;

//         continue;
//       }

//       // =================================================
//       // 6. BLANK / NO RECORD
//       // =================================================

//       if (
//         !record ||
//         record.status === "Blank"
//       ) {
//         /*
//           Blank is paid.
//         */

//         continue;
//       }

//       // =================================================
//       // 7. ABSENT
//       // =================================================

//       if (
//         record.status === "Absent"
//       ) {
//         /*
//           Actual machine absence.
//         */

//         absentDays++;

//         // ==============================================
//         // APPROVED CL / SL
//         // ==============================================

//         if (
//           leave &&
//           (
//             leave.leaveType === "CL" ||
//             leave.leaveType === "SL"
//           )
//         ) {
//           const requestedDays =
//             getLeaveDays(
//               leave
//             );

//           // --------------------------------------------
//           // FIRST PAID CL / SL
//           // --------------------------------------------

//           if (
//             paidLeaveUsed < 1
//           ) {
//             const availablePaid =
//               1 -
//               paidLeaveUsed;

//             const paidDays =
//               Math.min(
//                 requestedDays,
//                 availablePaid
//               );

//             const extraLop =
//               Math.max(
//                 requestedDays -
//                   paidDays,
//                 0
//               );

//             paidLeaveUsed +=
//               paidDays;

//             paidLeaveDays +=
//               paidDays;

//             if (
//               leave.leaveType ===
//               "CL"
//             ) {
//               casualLeaveDays +=
//                 paidDays;
//             }

//             if (
//               leave.leaveType ===
//               "SL"
//             ) {
//               sickLeaveDays +=
//                 paidDays;
//             }

//             if (
//               extraLop > 0
//             ) {
//               lopDays +=
//                 extraLop;
//             }
//           }

//           // --------------------------------------------
//           // SECOND / LATER CL OR SL
//           // --------------------------------------------

//           else {
//             lopDays +=
//               requestedDays;
//           }

//           continue;
//         }

//         // ==============================================
//         // APPROVED LOP
//         // ==============================================

//         if (
//           leave &&
//           leave.leaveType === "LOP"
//         ) {
//           lopDays +=
//             getLeaveDays(
//               leave
//             );

//           continue;
//         }

//         // ==============================================
//         // ABSENT WITHOUT LEAVE
//         // ==============================================

//         unpaidAbsenceDays++;

//         continue;
//       }
//     }

//     // ==================================================
//     // WORKING DAYS
//     // ==================================================

//     /*
//       Full calendar month.

//       Sunday and paid HR holidays are INCLUDED.
//     */

//     const workingDays =
//       totalDays;

//     // ==================================================
//     // DEDUCTIBLE DAYS
//     // ==================================================

//     const deductibleDays =
//       lopDays +
//       unpaidAbsenceDays;

//     // ==================================================
//     // PAID DAYS
//     // ==================================================

//     const paidDays =
//       Math.max(
//         workingDays -
//           deductibleDays,
//         0
//       );

//     // ==================================================
//     // PER DAY SALARY
//     // ==================================================

//     const perDaySalary =
//       salaryAmount /
//       workingDays;

//     // ==================================================
//     // DEDUCTION
//     // ==================================================

//     const totalDeduction =
//       deductibleDays *
//       perDaySalary;

//     // ==================================================
//     // NET SALARY
//     // ==================================================

//     const netSalary =
//       Math.max(
//         salaryAmount -
//           totalDeduction,
//         0
//       );

//     // ==================================================
//     // SAVE SALARY
//     // ==================================================

//     const salaryRecord =
//       await Salary.findOneAndUpdate(
//         {
//           employeeId,

//           month:
//             numericMonth,

//           year:
//             numericYear,
//         },

//         {
//           employeeId,

//           month:
//             numericMonth,

//           year:
//             numericYear,

//           monthlySalary:
//             salaryAmount,

//           workingDays,

//           holidayDays,

//           presentDays,

//           /*
//             Actual machine absence.
//           */

//           absentDays,

//           casualLeaveDays,

//           sickLeaveDays,

//           paidLeaveDays,

//           lopDays,

//           unpaidAbsenceDays,

//           lateMarks,

//           totalLateMinutes,

//           payableDays:
//             paidDays,

//           perDaySalary,

//           lopDeduction:
//             totalDeduction,

//           netSalary,

//           generatedAt:
//             new Date(),
//         },

//         {
//           upsert: true,

//           new: true,

//           setDefaultsOnInsert:
//             true,
//         }
//       );

//     // ==================================================
//     // RESULT
//     // ==================================================

//     const calculation = {
//       totalDays,

//       workingDays,

//       presentDays,

//       absentDays,

//       holidayDays,

//       paidDays,

//       paidLeaveDays,

//       casualLeaveDays,

//       sickLeaveDays,

//       lopDays,

//       unpaidAbsenceDays,

//       deductibleDays,

//       lateMarks,

//       totalLateMinutes,

//       perDaySalary,

//       totalDeduction,

//       netSalary,
//     };

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return NextResponse.json({
//       success: true,

//       message:
//         "Salary calculated successfully",

//       salary: {
//         ...salaryRecord.toObject(),

//         ...calculation,
//       },

//       calculation,
//     });

//   } catch (error) {
//     console.error(
//       "Salary calculation error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,

//         message:
//           error.message ||
//           "Unable to calculate salary",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


// saturday 29th auguat
// import { connectDB } from "@/lib/mongodb";
// import Attendance from "@/models/Attendance";
// import Leave from "@/models/Leave";
// import Employee from "@/models/Employee";
// import Salary from "@/models/Salary";
// import { NextResponse } from "next/server";


// // ======================================================
// // DATE KEY
// // ======================================================

// function getDateKey(date) {
//   const d = new Date(date);

//   return `${d.getFullYear()}-${String(
//     d.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;
// }


// // ======================================================
// // GET MONTH DATE RANGE
// // ======================================================

// function isDateInsideMonth(
//   date,
//   year,
//   month
// ) {
//   const d = new Date(date);

//   return (
//     d.getFullYear() === Number(year) &&
//     d.getMonth() + 1 === Number(month)
//   );
// }


// // ======================================================
// // GET DAY NUMBER
// // ======================================================

// function getDayNumber(date) {
//   const d = new Date(date);

//   return d.getDate();
// }


// // ======================================================
// // POST
// // ======================================================

// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       employeeId,
//       month,
//       year,
//       monthlySalary,
//     } = body;


//     // ==================================================
//     // VALIDATION
//     // ==================================================

//     if (
//       !employeeId ||
//       !month ||
//       !year ||
//       monthlySalary === undefined ||
//       monthlySalary === null ||
//       monthlySalary === ""
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Employee, month, year and monthly salary are required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }


//     const numericMonth =
//       Number(month);

//     const numericYear =
//       Number(year);

//     const salaryAmount =
//       Number(monthlySalary);


//     if (
//       numericMonth < 1 ||
//       numericMonth > 12
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Invalid month",
//         },
//         {
//           status: 400,
//         }
//       );
//     }


//     if (
//       !Number.isFinite(
//         salaryAmount
//       ) ||
//       salaryAmount <= 0
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Monthly salary must be greater than zero",
//         },
//         {
//           status: 400,
//         }
//       );
//     }


//     // ==================================================
//     // FIND EMPLOYEE
//     // ==================================================

//     const employee =
//       await Employee.findById(
//         employeeId
//       ).lean();

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Employee not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }


//     // ==================================================
//     // MONTH RANGE
//     // ==================================================

//     const monthStart =
//       new Date(
//         numericYear,
//         numericMonth - 1,
//         1
//       );

//     monthStart.setHours(
//       0,
//       0,
//       0,
//       0
//     );


//     const nextMonthStart =
//       new Date(
//         numericYear,
//         numericMonth,
//         1
//       );

//     nextMonthStart.setHours(
//       0,
//       0,
//       0,
//       0
//     );


//     const totalDays =
//       new Date(
//         numericYear,
//         numericMonth,
//         0
//       ).getDate();


//     // ==================================================
//     // ATTENDANCE
//     // ==================================================

//     const attendance =
//       await Attendance.find({
//         employeeId,

//         date: {
//           $gte: monthStart,
//           $lt: nextMonthStart,
//         },
//       })
//         .sort({
//           date: 1,
//         })
//         .lean();


//     if (
//       attendance.length === 0
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "No attendance found for this employee and month",
//         },
//         {
//           status: 400,
//         }
//       );
//     }


//     // ==================================================
//     // APPROVED LEAVES
//     // ==================================================

//     const approvedLeaves =
//       await Leave.find({
//         employeeId,

//         status: "Approved",

//         fromDate: {
//           $lt: nextMonthStart,
//         },

//         toDate: {
//           $gte: monthStart,
//         },
//       })
//         .sort({
//           fromDate: 1,
//         })
//         .lean();


//     // ==================================================
//     // ATTENDANCE MAP
//     // ==================================================

//     const attendanceMap = {};

//     for (
//       const record of attendance
//     ) {
//       attendanceMap[
//         getDateKey(
//           record.date
//         )
//       ] = record;
//     }


//     // ==================================================
//     // LEAVE MAP
//     // ==================================================

//     /*
//       We create the leave information
//       date by date.

//       No getDatesBetween().
//     */

//     const leaveMap = {};

//     for (
//       const leave of approvedLeaves
//     ) {

//       const start =
//         new Date(
//           leave.fromDate
//         );

//       const end =
//         new Date(
//           leave.toDate
//         );

//       start.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       end.setHours(
//         0,
//         0,
//         0,
//         0
//       );


//       /*
//         Check every calendar day of
//         this leave directly.
//       */

//       let current =
//         new Date(start);

//       while (
//         current <= end
//       ) {

//         if (
//           isDateInsideMonth(
//             current,
//             numericYear,
//             numericMonth
//           )
//         ) {

//           const key =
//             getDateKey(
//               current
//             );

//           leaveMap[key] =
//             leave;
//         }


//         current.setDate(
//           current.getDate() + 1
//         );
//       }
//     }


//     // ==================================================
//     // COUNTERS
//     // ==================================================

//     let paidLeaveUsed = 0;

//     let paidClDays = 0;

//     let paidSlDays = 0;

//     let lopDays = 0;

//     let unpaidAbsenceDays = 0;

//     let presentDays = 0;

//     let holidayDays = 0;

//     let lateMarks = 0;

//     let totalLateMinutes = 0;


//     // ==================================================
//     // PROCESS EVERY CALENDAR DAY
//     // ==================================================

//     for (
//       let day = 1;
//       day <= totalDays;
//       day++
//     ) {

//       const date =
//         new Date(
//           numericYear,
//           numericMonth - 1,
//           day
//         );

//       date.setHours(
//         0,
//         0,
//         0,
//         0
//       );


//       const key =
//         getDateKey(date);


//       const record =
//         attendanceMap[key];


//       const leave =
//         leaveMap[key];


//       // =================================================
//       // SUNDAY
//       // =================================================

//       if (
//         date.getDay() === 0
//       ) {
//         holidayDays++;

//         /*
//           Sunday is a paid day.
//           No deduction.
//         */

//         continue;
//       }


//       // =================================================
//       // LATE
//       // =================================================

//       if (
//         record?.lateMark === true
//       ) {

//         lateMarks++;

//         totalLateMinutes +=
//           Number(
//             record.lateMinutes ||
//               0
//           );
//       }


//       // =================================================
//       // ABSENCE
//       // =================================================

//       if (
//         record?.status === "Absent"
//       ) {

//         // ==============================================
//         // APPROVED CL / SL
//         // ==============================================

//         if (
//           leave &&
//           (
//             leave.leaveType === "CL" ||
//             leave.leaveType === "SL"
//           )
//         ) {

//           const requestedDays =
//             leave.duration ===
//             "Half Day"
//               ? 0.5
//               : 1;


//           // ==========================================
//           // FIRST PAID LEAVE
//           // ==========================================

//           if (
//             paidLeaveUsed < 1
//           ) {

//             const remainingPaid =
//               1 -
//               paidLeaveUsed;


//             const paidDays =
//               Math.min(
//                 requestedDays,
//                 remainingPaid
//               );


//             const extraDays =
//               requestedDays -
//               paidDays;


//             paidLeaveUsed +=
//               paidDays;


//             if (
//               leave.leaveType ===
//               "CL"
//             ) {
//               paidClDays +=
//                 paidDays;
//             }


//             if (
//               leave.leaveType ===
//               "SL"
//             ) {
//               paidSlDays +=
//                 paidDays;
//             }


//             /*
//               Extra part of a leave request
//               becomes LOP.
//             */

//             if (
//               extraDays > 0
//             ) {
//               lopDays +=
//                 extraDays;
//             }

//           }

//           // ==========================================
//           // SECOND / LATER CL OR SL
//           // ==========================================

//           else {

//             lopDays +=
//               requestedDays;
//           }


//           continue;
//         }


//         // ==============================================
//         // APPROVED LOP
//         // ==============================================

//         if (
//           leave &&
//           leave.leaveType ===
//             "LOP"
//         ) {

//           const requestedDays =
//             leave.duration ===
//             "Half Day"
//               ? 0.5
//               : 1;

//           lopDays +=
//             requestedDays;

//           continue;
//         }


//         // ==============================================
//         // ABSENCE WITHOUT APPROVED LEAVE
//         // ==============================================

//         unpaidAbsenceDays++;

//         continue;
//       }


//       // =================================================
//       // PRESENT
//       // =================================================

//       if (
//         record?.status ===
//         "Present"
//       ) {
//         presentDays++;
//       }

//       /*
//         Blank day:

//         No attendance record
//         = no absence
//         = no salary deduction
//       */
//     }


//     // ==================================================
//     // WORKING DAYS
//     // ==================================================

//     const workingDays =
//       totalDays;


//     // ==================================================
//     // PAID DAYS
//     // ==================================================

//     const deductibleDays =
//       lopDays +
//       unpaidAbsenceDays;


//     const paidDays =
//       Math.max(
//         totalDays -
//           deductibleDays,
//         0
//       );


//     // ==================================================
//     // PER DAY SALARY
//     // ==================================================

//     const perDaySalary =
//       salaryAmount /
//       workingDays;


//     // ==================================================
//     // DEDUCTION
//     // ==================================================

//     const totalDeduction =
//       deductibleDays *
//       perDaySalary;


//     // ==================================================
//     // NET SALARY
//     // ==================================================

//     const netSalary =
//       Math.max(
//         salaryAmount -
//           totalDeduction,
//         0
//       );


//     // ==================================================
//     // PAID LEAVE TOTAL
//     // ==================================================

//     const paidLeaveDays =
//       paidClDays +
//       paidSlDays;


//     // ==================================================
//     // ABSENT TOTAL
//     // ==================================================

//     const absentDays =
//       deductibleDays;


//     // ==================================================
//     // SAVE SALARY
//     // ==================================================

//     const salaryRecord =
//       await Salary.findOneAndUpdate(
//         {
//           employeeId,

//           month:
//             numericMonth,

//           year:
//             numericYear,
//         },

//         {
//           employeeId,

//           month:
//             numericMonth,

//           year:
//             numericYear,

//           monthlySalary:
//             salaryAmount,

//           workingDays,

//           holidayDays,

//           presentDays,

//           absentDays,

//           paidLeaveDays,

//           casualLeaveDays:
//             paidClDays,

//           sickLeaveDays:
//             paidSlDays,

//           lopDays,

//           unpaidAbsenceDays,

//           lateMarks,

//           totalLateMinutes,

//           payableDays:
//             paidDays,

//           perDaySalary,

//           lopDeduction:
//             totalDeduction,

//           netSalary,

//           generatedAt:
//             new Date(),
//         },

//         {
//           upsert: true,

//           new: true,
//         }
//       );


//     // ==================================================
//     // RESULT
//     // ==================================================

//     const result = {

//       totalDays,

//       workingDays,

//       holidayDays,

//       presentDays,

//       paidDays,

//       absenceDays:
//         deductibleDays,

//       absentDays,

//       paidLeaveDays,

//       casualLeaveDays:
//         paidClDays,

//       sickLeaveDays:
//         paidSlDays,

//       lopDays,

//       unpaidAbsenceDays,

//       lateMarks,

//       totalLateMinutes,

//       perDaySalary,

//       totalDeduction,

//       netSalary,
//     };


//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return NextResponse.json({

//       success: true,

//       message:
//         "Salary calculated successfully",

//       salary: {
//         ...salaryRecord.toObject(),

//         ...result,
//       },

//       calculation:
//         result,

//     });

//   } catch (error) {

//     console.error(
//       "Salary calculation error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,

//         message:
//           error.message ||
//           "Unable to calculate salary",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }