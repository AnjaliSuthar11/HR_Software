// import { connectDB } from "@/lib/mongodb";
// import Employee from "@/models/Employee";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const employee = await Employee.findById(id);

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Employee not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       employee,
//     });

//   } catch (error) {
//     console.log(error);
 
    
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("EMPLOYEE ID RECEIVED:", id);

    const employee = await Employee.findById(id)
      .select("-companyLoginPassword")
      .lean();

    console.log("EMPLOYEE FOUND:", employee);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });

  } catch (error) {
    console.error("Employee GET API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const {
      employeeCode,
      employeeFullName,
      designation,
      employeeStatus,

      emailId,
      mobileNo,
      gender,
      joiningDate,

      fatherName,
      dateOfBirth,
      nationality,
      religion,
      maritalStatus,
      bloodGroup,
      healthProblem,

      address,
      permanentAddress,

      panCardNo,
      aadharCardNo,

      highestQualification,
      softwareKnowledge,

      bankDetails,

      familyDetails,
      emergencyContacts,
      previousEmployment,
    } = body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!employeeCode?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee code is required",
        },
        { status: 400 }
      );
    }

    if (!employeeFullName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee name is required",
        },
        { status: 400 }
      );
    }

    // ========================================
    // CHECK DUPLICATE EMPLOYEE CODE
    // ========================================

    const existingEmployee =
      await Employee.findOne({
        employeeCode: employeeCode.trim(),
        _id: { $ne: id },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee code already exists",
        },
        { status: 400 }
      );
    }

    // ========================================
    // BUILD UPDATE DATA
    // ========================================

    const updateData = {
      employeeCode: employeeCode.trim(),

      employeeFullName:
        employeeFullName.trim(),

      designation:
        designation?.trim() || "",

      employeeStatus:
        employeeStatus || "Active",

      emailId:
        emailId?.trim() || "",

      mobileNo:
        mobileNo?.trim() || "",

      joiningDate:
        joiningDate || null,

      fatherName:
        fatherName?.trim() || "",

      dateOfBirth:
        dateOfBirth || null,

      nationality:
        nationality?.trim() || "",

      religion:
        religion?.trim() || "",

      healthProblem:
        healthProblem?.trim() || "",

      address:
        address?.trim() || "",

      permanentAddress:
        permanentAddress?.trim() || "",

      panCardNo:
        panCardNo?.trim() || "",

      aadharCardNo:
        aadharCardNo?.trim() || "",

      highestQualification:
        highestQualification?.trim() || "",

      softwareKnowledge:
        Array.isArray(softwareKnowledge)
          ? softwareKnowledge
          : [],

      bankDetails:
        bankDetails || {},

      familyDetails:
        Array.isArray(familyDetails)
          ? familyDetails
          : [],

      emergencyContacts:
        Array.isArray(emergencyContacts)
          ? emergencyContacts
          : [],

      previousEmployment:
        Array.isArray(previousEmployment)
          ? previousEmployment
          : [],
    };

    // ========================================
    // ENUM FIELDS
    // ONLY SEND THEM WHEN THEY HAVE A VALUE
    // ========================================

    if (gender) {
      updateData.gender = gender;
    }

    if (maritalStatus) {
      updateData.maritalStatus =
        maritalStatus;
    }

    if (bloodGroup) {
      updateData.bloodGroup =
        bloodGroup;
    }

    // ========================================
    // UPDATE
    // ========================================

    const employee =
      await Employee.findByIdAndUpdate(
        id,
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      ).select(
        "-companyLoginPassword"
      );

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update employee",
      },
      { status: 500 }
    );
  }
}