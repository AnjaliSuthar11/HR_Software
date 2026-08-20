import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { candidateId, ...employeeData } = body;

    // Convert empty strings to undefined
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key] === "") {
        employeeData[key] = undefined;
      }
    });

    const employee = await Employee.create(employeeData);

    // Candidate → Employee
    if (candidateId) {
      await Candidate.findByIdAndUpdate(
        candidateId,
        {
          convertedToEmployee: true,
          employeeId: employee._id,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee Created Successfully",
      employee,
    });

  } catch (error) {
    console.error("Employee API Error:", error);

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