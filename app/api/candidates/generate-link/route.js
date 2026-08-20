import { connectDB } from "@/lib/mongodb";
import RegistrationLink from "@/models/RegistrationLink";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    // Generate a secure unique token
    const token = crypto.randomBytes(32).toString("hex");

    const registrationLink = await RegistrationLink.create({
      token,
      used: false,
      expiresAt: null,
    });

    return NextResponse.json({
      success: true,
      token: registrationLink.token,
    });

  } catch (error) {
    console.error(error);

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