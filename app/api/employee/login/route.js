import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


import Employee from "@/models/Employee";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    await connectDB();

    const {
      companyLoginEmail,
      companyLoginPassword,
    } = await request.json();

    // ============================================
    // VALIDATION
    // ============================================

    if (
      !companyLoginEmail ||
      !companyLoginPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Company login email and password are required",
        },
        { status: 400 }
      );
    }

    // ============================================
    // FIND EMPLOYEE
    // ============================================

    const employee = await Employee.findOne({
      companyLoginEmail:
        companyLoginEmail
          .trim()
          .toLowerCase(),
    }).lean();

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee with this company email was not found",
        },
        { status: 401 }
      );
    }

    // ============================================
    // CHECK EMPLOYEE STATUS
    // ============================================

    if (
      employee.employeeStatus !== "Active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your employee account is not active. Please contact HR.",
        },
        { status: 403 }
      );
    }

    // ============================================
    // CHECK PASSWORD USING BCRYPT
    // ============================================

    const passwordMatch =
      await bcrypt.compare(
        companyLoginPassword,
        employee.companyLoginPassword
      );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    // ============================================
    // EMPLOYEE DATA
    // ============================================

    const employeeData = {
      id: employee._id.toString(),

      employeeCode:
        employee.employeeCode,

      employeeFullName:
        employee.employeeFullName,

      employeePhoto:
        employee.employeePhoto || "",

      fatherName:
        employee.fatherName || "",

      address:
        employee.address || "",

      permanentAddress:
        employee.permanentAddress || "",

      gender:
        employee.gender || "",

      mobileNo:
        employee.mobileNo || "",

      emailId:
        employee.emailId || "",

      companyLoginEmail:
        employee.companyLoginEmail,

      nationality:
        employee.nationality || "",

      religion:
        employee.religion || "",

      maritalStatus:
        employee.maritalStatus || "",

      dateOfBirth:
        employee.dateOfBirth || null,

      panCardNo:
        employee.panCardNo || "",

      aadharCardNo:
        employee.aadharCardNo || "",

      bloodGroup:
        employee.bloodGroup || "",

      healthProblem:
        employee.healthProblem || "",

      highestQualification:
        employee.highestQualification || "",

      softwareKnowledge:
        employee.softwareKnowledge || [],

      joiningDate:
        employee.joiningDate || null,

      employeeStatus:
        employee.employeeStatus,

      familyDetails:
        employee.familyDetails || [],

      previousEmployment:
        employee.previousEmployment || [],

      emergencyContacts:
        employee.emergencyContacts || [],

      bankDetails:
        employee.bankDetails || {},

      panCardDocument:
        employee.panCardDocument || "",

      aadharCardDocument:
        employee.aadharCardDocument || "",

      highestEducationDocument:
        employee.highestEducationDocument || "",

      experienceLetter:
        employee.experienceLetter || "",

      salarySlip:
        employee.salarySlip || "",
    };

    // ============================================
    // SUCCESS
    // ============================================

    return NextResponse.json({
      success: true,

      message:
        "Employee login successful",

      employee: employeeData,
    });

  } catch (error) {
    console.error(
      "Employee Login Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while logging in",
      },
      { status: 500 }
    );
  }
}