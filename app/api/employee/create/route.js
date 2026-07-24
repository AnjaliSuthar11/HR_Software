import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Convert empty strings to undefined
    Object.keys(body).forEach((key) => {
      if (body[key] === "") {
        body[key] = undefined;
      }
    });

    const employee = await Employee.create(body);

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