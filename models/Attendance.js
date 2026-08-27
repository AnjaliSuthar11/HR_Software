import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    inTime: {
      type: String,
      default: "",
    },

    outTime: {
      type: String,
      default: "",
    },

    workingMinutes: {
      type: Number,
      default: 0,
    },

    workingHours: {
      type: Number,
      default: 0,
    },

    /*
      Present:
        Employee has attendance
        OR blank row on Monday-Saturday

      Absent:
        Machine explicitly says "Absence"

      Holiday:
        Sunday
    */

    status: {
      type: String,
      enum: [
        "Present",
        "Absent",
        "Holiday",
      ],
      default: "Present",
    },

    /*
      Late after 10:00 AM
    */

    lateMark: {
      type: Boolean,
      default: false,
    },

    lateMinutes: {
      type: Number,
      default: 0,
    },

    /*
      Leave is attached only when
      attendance status is Absent
      and there is an approved leave.
    */

    leaveType: {
      type: String,
      enum: [
        "CL",
        "SL",
        "LOP",
        "",
      ],
      default: "",
    },

    leaveStatus: {
      type: String,
      enum: [
        "Paid",
        "LOP",
        "",
      ],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


// One attendance record per employee per date
AttendanceSchema.index(
  {
    employeeId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.models.Attendance ||
  mongoose.model(
    "Attendance",
    AttendanceSchema
  );