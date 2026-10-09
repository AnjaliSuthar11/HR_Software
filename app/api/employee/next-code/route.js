import { NextResponse } from "next/server";

import Employee from "@/models/Employee";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    // Fetch existing employee codes from MongoDB
    const employees = await Employee.find({})
      .select("employeeCode")
      .lean();

    // Find the highest existing EMP number
    let highestNumber = 0;

    for (const employee of employees) {
      const match = String(
        employee.employeeCode || ""
      )
        .trim()
        .match(/^EMP-(\d+)$/i);

      if (match) {
        const number = Number(match[1]);

        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    }

    // Generate the next employee code
    const nextNumber = highestNumber + 1;

    const employeeCode = `EMP-${String(
      nextNumber
    ).padStart(3, "0")}`;

    return NextResponse.json({
      success: true,
      employeeCode,
    });
  } catch (error) {
    console.error(
      "Generate employee code error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate employee code",
      },
      { status: 500 }
    );
  }
}