
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const employeeId = formData.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        {
          status: 404,
        }
      );
    }

    const uploadToCloudinary = async (
      file,
      folder
    ) => {
      if (!file || file.size === 0) return null;

      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          )
          .end(buffer);
      });
    };

    // Employee Photo

    const employeePhoto =
      await uploadToCloudinary(
        formData.get("employeePhoto"),
        "employees/photos"
      );

    if (employeePhoto) {
      employee.employeePhoto =
        employeePhoto;
    }

    // PAN Card

    const panCardDocument =
      await uploadToCloudinary(
        formData.get("panCardDocument"),
        "employees/pan"
      );

    if (panCardDocument) {
      employee.panCardDocument =
        panCardDocument;
    }

    // Aadhar Card

    const aadharCardDocument =
      await uploadToCloudinary(
        formData.get("aadharCardDocument"),
        "employees/aadhar"
      );

    if (aadharCardDocument) {
      employee.aadharCardDocument =
        aadharCardDocument;
    }

    // Education

    const highestEducationDocument =
      await uploadToCloudinary(
        formData.get(
          "highestEducationDocument"
        ),
        "employees/education"
      );

    if (highestEducationDocument) {
      employee.highestEducationDocument =
        highestEducationDocument;
    }

    // Experience

    const experienceLetter =
      await uploadToCloudinary(
        formData.get("experienceLetter"),
        "employees/experience"
      );

    if (experienceLetter) {
      employee.experienceLetter =
        experienceLetter;
    }

    // Salary Slip

    const salarySlip =
      await uploadToCloudinary(
        formData.get("salarySlip"),
        "employees/salary-slip"
      );

    if (salarySlip) {
      employee.salarySlip = salarySlip;
    }

    await employee.save();

    return NextResponse.json({
      success: true,
      message:
        "Documents Uploaded Successfully",
      employee,
    });
  } catch (error) {
    console.log(
      "Upload Documents Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}