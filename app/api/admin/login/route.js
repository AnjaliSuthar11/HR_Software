import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const { adminEmail, adminPassword } = body || {};

    if (
      typeof adminEmail !== "string" ||
      !adminEmail.trim() ||
      typeof adminPassword !== "string" ||
      !adminPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter your email and password.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findOne({
      adminEmail: adminEmail.trim().toLowerCase(),
    }).select("+adminPassword");

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      adminPassword,
      admin.adminPassword
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin._id.toString(),
        adminEmail: admin.adminEmail,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Server error during login." },
      { status: 500 }
    );
  }
}