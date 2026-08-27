import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    monthlySalary: {
      type: Number,
      required: true,
    },


    // ================================================
    // ATTENDANCE
    // ================================================

    workingDays: {
      type: Number,
      default: 0,
    },

    holidayDays: {
      type: Number,
      default: 0,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
    },


    // ================================================
    // LEAVES
    // ================================================

    casualLeaveDays: {
      type: Number,
      default: 0,
    },

    sickLeaveDays: {
      type: Number,
      default: 0,
    },

    paidLeaveDays: {
      type: Number,
      default: 0,
    },

    lopDays: {
      type: Number,
      default: 0,
    },

    unpaidAbsenceDays: {
      type: Number,
      default: 0,
    },


    // ================================================
    // LATE
    // ================================================

    lateMarks: {
      type: Number,
      default: 0,
    },

    totalLateMinutes: {
      type: Number,
      default: 0,
    },


    // ================================================
    // SALARY
    // ================================================

    payableDays: {
      type: Number,
      default: 0,
    },

    perDaySalary: {
      type: Number,
      default: 0,
    },

    lopDeduction: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


// One salary record per employee per month
SalarySchema.index(
  {
    employeeId: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.models.Salary ||
  mongoose.model(
    "Salary",
    SalarySchema
  );