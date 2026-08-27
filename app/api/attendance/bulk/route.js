import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Employee from "@/models/Employee";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";


// ======================================================
// TIME TO MINUTES
// ======================================================

function timeToMinutes(time) {
  if (!time) {
    return null;
  }

  const match = String(time)
    .trim()
    .match(
      /^(\d{1,2}):(\d{2})$/
    );

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return (
    hours * 60 +
    minutes
  );
}


// ======================================================
// CALCULATE WORKING MINUTES
// ======================================================

function calculateWorkingMinutes(
  inTime,
  outTime
) {
  const inMinutes =
    timeToMinutes(inTime);

  const outMinutes =
    timeToMinutes(outTime);

  if (
    inMinutes === null ||
    outMinutes === null
  ) {
    return 0;
  }

  let difference =
    outMinutes - inMinutes;

  // Overnight shift
  if (difference < 0) {
    difference += 24 * 60;
  }

  return difference;
}


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
// POST
// ======================================================

export async function POST(req) {
  try {
    await connectDB();

    const {
      employeeId,
      month,
      year,
      rows,
    } = await req.json();


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !employeeId ||
      !month ||
      !year ||
      !Array.isArray(rows)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee, month, year and attendance data are required",
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


    if (
      numericMonth < 1 ||
      numericMonth > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid month",
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
      );

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
    // DAYS IN MONTH
    // ==================================================

    const daysInMonth =
      new Date(
        numericYear,
        numericMonth,
        0
      ).getDate();


    // ==================================================
    // ONLY REJECT EXTRA ROWS
    // ==================================================

    if (
      rows.length > daysInMonth
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Maximum ${daysInMonth} rows are allowed for this month.`,
        },
        {
          status: 400,
        }
      );
    }


    // ==================================================
    // MONTH RANGE
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


    // ==================================================
    // GET APPROVED LEAVES
    // ==================================================

    const approvedLeaves =
      await Leave.find({
        employeeId,

        status: "Approved",

        fromDate: {
          $lt: nextMonthStart,
        },

        toDate: {
          $gte: monthStart,
        },
      }).lean();


    // ==================================================
    // LEAVE MAP
    // ==================================================

    const leaveMap = {};

    for (
      const leave of
        approvedLeaves
    ) {
      const start =
        new Date(
          leave.fromDate
        );

      const end =
        new Date(
          leave.toDate
        );

      start.setHours(
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
        start <= end
      ) {
        leaveMap[
          getDateKey(start)
        ] = leave;

        start.setDate(
          start.getDate() + 1
        );
      }
    }


    // ==================================================
    // BUILD EVERY CALENDAR DAY
    // ==================================================

    const operations = [];

    for (
      let index = 0;
      index < daysInMonth;
      index++
    ) {
      const day =
        index + 1;

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


      // If pasted row exists, use it.
      // If not, create blank working-day record.

      const row =
        rows[index] || {
          inTime: "",
          outTime: "",
          status: "Present",
        };


      const inTime =
        String(
          row.inTime || ""
        ).trim();

      const outTime =
        String(
          row.outTime || ""
        ).trim();


      let status = "Present";

      let workingMinutes = 0;

      let lateMark = false;

      let lateMinutes = 0;


      // ==================================================
      // SUNDAY = HOLIDAY
      // ==================================================

      if (
        date.getDay() === 0
      ) {
        status = "Holiday";
      }


      // ==================================================
      // MONDAY - SATURDAY
      // ==================================================

      else {

        // ==============================================
        // ABSENCE
        // ==============================================

        if (
          String(
            row.status || ""
          ).toLowerCase() ===
            "absence" ||
          String(
            row.status || ""
          ).toLowerCase() ===
            "absent"
        ) {
          status = "Absent";
        }


        // ==============================================
        // PRESENT OR BLANK
        // ==============================================

        else {

          /*
            Blank is Present/Working Day.

            It is NOT absence.
          */

          status = "Present";


          // ==========================================
          // WORKING HOURS
          // ==========================================

          if (
            inTime &&
            outTime
          ) {
            workingMinutes =
              calculateWorkingMinutes(
                inTime,
                outTime
              );
          }


          // ==========================================
          // LATE AFTER 10:00 AM
          // ==========================================

          const inMinutes =
            timeToMinutes(
              inTime
            );

          if (
            inMinutes !== null &&
            inMinutes > 600
          ) {
            lateMark = true;

            lateMinutes =
              inMinutes - 600;
          }
        }
      }


      // ==================================================
      // LEAVE
      // ==================================================

      let leaveType = "";

      let leaveStatus = "";

      const leave =
        leaveMap[
          getDateKey(date)
        ];


      /*
        Leave is applied to an ABSENCE only.

        Absence + CL = Paid
        Absence + SL = Paid
        Absence + LOP = LOP
      */

      if (
        status === "Absent" &&
        leave
      ) {

        leaveType =
          leave.leaveType;


        if (
          leave.leaveType ===
            "CL" ||
          leave.leaveType ===
            "SL"
        ) {
          leaveStatus =
            "Paid";
        }


        if (
          leave.leaveType ===
          "LOP"
        ) {
          leaveStatus =
            "LOP";
        }
      }


      // ==================================================
      // WORKING HOURS
      // ==================================================

      const workingHours =
        Number(
          (
            workingMinutes /
            60
          ).toFixed(2)
        );


      // ==================================================
      // SAVE / UPDATE
      // ==================================================

      operations.push({
        updateOne: {
          filter: {
            employeeId,
            date,
          },

          update: {
            $set: {
              employeeId,
              date,

              inTime,
              outTime,

              workingMinutes,
              workingHours,

              status,

              lateMark,
              lateMinutes,

              leaveType,
              leaveStatus,
            },
          },

          upsert: true,
        },
      });
    }


    // ==================================================
    // SAVE
    // ==================================================

    await Attendance.bulkWrite(
      operations
    );


    return NextResponse.json({
      success: true,

      message:
        "Attendance imported successfully",

      totalRecords:
        operations.length,
    });

  } catch (error) {

    console.error(
      "Attendance import error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to import attendance",
      },
      {
        status: 500,
      }
    );
  }
}