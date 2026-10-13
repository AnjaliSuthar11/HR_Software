import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Holiday from "@/models/Holiday";
import Leave from "@/models/Leave";

function getDateKey(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const employeeId = searchParams.get("employeeId");
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (
      !employeeId ||
      !mongoose.Types.ObjectId.isValid(employeeId) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid employee, month and year are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(
      Date.UTC(year, month, 0)
    ).getUTCDate();

    const [attendance, holidays, leaves] = await Promise.all([
      Attendance.find({
        employeeId,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).lean(),

      Holiday.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).lean(),

      Leave.find({
        employeeId,
        status: { $in: ["Approved", "Pending"] },
        fromDate: { $lt: endDate },
        toDate: { $gte: startDate },
      }).lean(),
    ]);

    const attendanceMap = new Map();

    attendance.forEach((record) => {
      attendanceMap.set(getDateKey(record.date), record);
    });

    const holidayMap = new Map();

    holidays.forEach((holiday) => {
      const key = getDateKey(holiday.date);

      if (!holidayMap.has(key)) {
        holidayMap.set(key, []);
      }

      holidayMap.get(key).push(holiday);
    });

    const records = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month - 1, day));
      const dateKey = getDateKey(date);
      const weekday = date.getUTCDay();

      const attendanceRecord = attendanceMap.get(dateKey);
      const dayHolidays = holidayMap.get(dateKey) || [];

      const saturdayNumber = Math.ceil(day / 7);

      const isSunday = weekday === 0;

      const isSecondSaturday =
        weekday === 6 && saturdayNumber === 2;

      const isFourthSaturday =
        weekday === 6 && saturdayNumber === 4;

      // Find a leave overlapping this date.
      const matchingLeaves = leaves.filter((leave) => {
        return (
          getDateKey(leave.fromDate) <= dateKey &&
          getDateKey(leave.toDate) >= dateKey
        );
      });

      const approvedLeave = matchingLeaves.find(
        (leave) => leave.status === "Approved"
      );

      const pendingLeave = matchingLeaves.find(
        (leave) => leave.status === "Pending"
      );

      let status = "No Record";
      let details = "";

      // Holiday takes precedence over attendance and leave.
      if (dayHolidays.length > 0) {
        status = "Holiday";
        details = dayHolidays.map((item) => item.name).join(", ");
      } else if (isSunday) {
        status = "Holiday";
        details = "Sunday";
      } else if (isSecondSaturday) {
        status = "Holiday";
        details = "2nd Saturday";
      } else if (isFourthSaturday) {
        status = "Holiday";
        details = "4th Saturday";
      } else if (attendanceRecord?.status === "Holiday") {
        status = "Holiday";
        details = "Marked as holiday in attendance";
      } else if (
        attendanceRecord?.status === "Absent" &&
        approvedLeave
      ) {
        status = "Leave";
        details = `${approvedLeave.leaveType} Leave · Approved`;
      } else if (attendanceRecord?.status === "Absent") {
        status = "Absent";

        if (pendingLeave) {
          details = `${pendingLeave.leaveType} Leave · Pending approval`;
        }
      } else if (
        attendanceRecord?.status === "Present" &&
        attendanceRecord.lateMark
      ) {
        status = "Late";
        details = `Present · ${Number(
          attendanceRecord.lateMinutes || 0
        )} minutes late`;
      } else if (attendanceRecord?.status === "Present") {
        status = "Present";
      } else if (approvedLeave) {
        status = "Leave";
        details = `${approvedLeave.leaveType} Leave · Approved`;
      } else if (pendingLeave) {
        status = "Leave Pending";
        details = `${pendingLeave.leaveType} Leave · Awaiting approval`;
      }

      records.push({
        dateKey,
        day,
        inTime: attendanceRecord?.inTime || "",
        outTime: attendanceRecord?.outTime || "",
        workingMinutes: Number(
          attendanceRecord?.workingMinutes || 0
        ),
        workingHours: Number(
          attendanceRecord?.workingHours ||
            (attendanceRecord?.workingMinutes || 0) / 60
        ),
        lateMark: Boolean(attendanceRecord?.lateMark),
        lateMinutes: Number(
          attendanceRecord?.lateMinutes || 0
        ),
        status,
        details,
        paidHoliday:
          dayHolidays.length > 0 &&
          dayHolidays.some((holiday) => holiday.paid === true),
      });
    }

    return NextResponse.json({
      success: true,
      month,
      year,
      records,
    });
  } catch (error) {
    console.error("Attendance history API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load attendance history.",
      },
      { status: 500 }
    );
  }
}