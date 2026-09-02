import { connectDB } from "@/lib/mongodb";
import RegistrationLink from "@/models/RegistrationLink";
import crypto from "crypto";
import { NextResponse } from "next/server";



export async function POST(request) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      department,
      appliedPosition,
    } = body;


    // ============================================
    // VALIDATION
    // ============================================

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Department is required",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !appliedPosition ||
      !appliedPosition.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Applied position is required",
        },
        {
          status: 400,
        }
      );
    }


    // ============================================
    // GENERATE TOKEN
    // ============================================

    const token =
      crypto
        .randomBytes(32)
        .toString("hex");


    // ============================================
    // SAVE LINK
    // ============================================

    const registrationLink =
      await RegistrationLink.create({
        token,

        used: false,

        expiresAt: null,

        department,

        appliedPosition:
          appliedPosition.trim(),
      });


    // ============================================
    // RESPONSE
    // ============================================

    return NextResponse.json({
      success: true,

      token:
        registrationLink.token,

      department:
        registrationLink.department,

      appliedPosition:
        registrationLink.appliedPosition,
    });

  } catch (error) {

    console.error(
      "Generate registration link error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to generate registration link",
      },
      {
        status: 500,
      }
    );
  }
}