import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const setupKey = request.headers.get("x-admin-setup-key");

    if (
      !process.env.ADMIN_SETUP_KEY ||
      setupKey !== process.env.ADMIN_SETUP_KEY
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid setup key." },
        { status: 403 }
      );
    }

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
      adminPassword.length < 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter an email and a password of at least 10 characters.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({});

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "The owner account has already been created.",
        },
        { status: 409 }
      );
    }

    const admin = await Admin.create({
      adminEmail: adminEmail.trim().toLowerCase(),
      adminPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Owner account created successfully.",
      admin: {
        id: admin._id.toString(),
        adminEmail: admin.adminEmail,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create owner account." },
      { status: 500 }
    );
  }
}