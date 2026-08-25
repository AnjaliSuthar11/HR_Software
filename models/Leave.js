import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    // Employee who applied for the leave
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Leave type
    leaveType: {
      type: String,
      enum: ["CL", "SL", "LOP"],
      required: true,
    },

    // First day of leave
    fromDate: {
      type: Date,
      required: true,
    },

    // Last day of leave
    toDate: {
      type: Date,
      required: true,
    },

    // Full day / Half day
    leaveDuration: {
      type: String,
      enum: ["Full Day", "Half Day"],
      required: true,
    },

    // Total leave days
    // Full day = 1
    // Half day = 0.5
    numberOfDays: {
      type: Number,
      required: true,
      min: 0.5,
    },

    // Employee's reason
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Request status
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // HR's remarks
    hrRemarks: {
      type: String,
      default: "",
      trim: true,
    },

    // Year for which leave is applied
    year: {
      type: Number,
      required: true,
    },

    // When employee submitted the request
    appliedDate: {
      type: Date,
      default: Date.now,
    },

    // Who approved/rejected it
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // When HR reviewed it
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Leave ||
  mongoose.model("Leave", leaveSchema);