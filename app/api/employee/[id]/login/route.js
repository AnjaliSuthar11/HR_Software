import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const {
      companyLoginEmail,
      companyLoginPassword,
    } = body;

    if (
      !companyLoginEmail ||
      !companyLoginPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const existingEmployee =
      await Employee.findOne({
        companyLoginEmail:
          companyLoginEmail.toLowerCase(),
        _id: { $ne: id },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "This company login email is already in use",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      companyLoginPassword,
      10
    );

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        companyLoginEmail:
          companyLoginEmail.toLowerCase(),
        companyLoginPassword: hashedPassword,
      },
      {
        new: true,
      }
    ).select("-companyLoginPassword");

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
      message: "Employee login created successfully",
      employee,
    });

  } catch (error) {
    console.error("Create Employee Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}