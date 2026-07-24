import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const employees = await Employee.find()
      .select(
        "employeeFullName employeeCode employeePhoto employeeStatus panCardDocument aadharCardDocument highestEducationDocument experienceLetter salarySlip"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.log(error);

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