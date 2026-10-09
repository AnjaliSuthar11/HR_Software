
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import HR from "@/models/HR";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { HRLoginEmail, HRLoginPassword } = body;

    if (!HRLoginEmail?.trim() || !HRLoginPassword) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    console.log("Database:", HR.db.name);
    console.log("Collection:", HR.collection.name);

    const records = await HR.find({})
      .select("HRLoginEmail")
      .lean();

    console.log("HR records:", records);

    const email = HRLoginEmail.trim().toLowerCase();

    const hr = await HR.findOne({
      HRLoginEmail: email,
    }).select("+HRLoginPassword");

    if (!hr) {
      return NextResponse.json(
        {
          success: false,
          message:
            "HR account not found. Check the database and HR collection.",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      HRLoginPassword,
      hr.HRLoginPassword
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      employee: {
        id: hr._id.toString(),
        HRLoginEmail: hr.HRLoginEmail,
      },
    });
  } catch (error) {
    console.error("HR Login Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error during login." },
      { status: 500 }
    );
  }
}

