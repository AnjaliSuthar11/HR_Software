import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    // Employee Information
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    employeeFullName: {
      type: String,
      required: true,
      trim: true,
    },

    employeePhoto: {
      type: String,
      default: "",
    },

    fatherName: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    mobileNo: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      lowercase: true,
      trim: true,
    },

    nationality: {
      type: String,
      trim: true,
    },

    religion: {
      type: String,
      trim: true,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Other"],
    },

    dateOfBirth: {
      type: Date,
    },

    panCardNo: {
      type: String,
      uppercase: true,
      trim: true,
    },

    aadharCardNo: {
      type: String,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    healthProblem: {
      type: String,
      trim: true,
    },

    highestQualification: {
      type: String,
      trim: true,
    },

    softwareKnowledge: [
      {
        type: String,
      },
    ],

    // ======================
    // Uploaded Documents
    // ======================

    panCardDocument: {
      type: String,
      default: "",
    },

    aadharCardDocument: {
      type: String,
      default: "",
    },

    highestEducationDocument: {
      type: String,
      default: "",
    },

    experienceLetter: {
      type: String,
      default: "",
    },

    salarySlip: {
      type: String,
      default: "",
    },

    // ======================
    // Family Details
    // ======================

    familyDetails: [
      {
        name: String,
        relationship: String,
        contactNo: String,
        occupation: String,
      },
    ],

    // ======================
    // Previous Employment
    // ======================

    previousEmployment: [
      {
        companyName: String,
        place: String,
        joinDate: Date,
        leftDate: Date,
        designation: String,
        annualSalary: Number,
        reasonForLeaving: String,
      },
    ],

    // ======================
    // Emergency Contacts
    // ======================

    emergencyContacts: [
      {
        name: String,
        relationship: String,
        contactNo: String,
      },
    ],

    // ======================
    // Bank Details
    // ======================

    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      branch: String,
    },

    // ======================
    // Employee Status
    // ======================

    joiningDate: {
      type: Date,
    },

    employeeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Resigned", "Terminated"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);