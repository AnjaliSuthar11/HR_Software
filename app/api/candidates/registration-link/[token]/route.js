import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import RegistrationLink from "@/models/RegistrationLink";

export async function GET(
  request,
  { params }
) {
  try {
    await connectDB();

    const { token } =
      await params;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Token is required",
        },
        {
          status: 400,
        }
      );
    }

    const registrationLink =
      await RegistrationLink.findOne({
        token,
      }).lean();

    if (!registrationLink) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid registration link",
        },
        {
          status: 404,
        }
      );
    }

    if (
      registrationLink.used
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This registration link has already been used",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,

      department:
        registrationLink.department,

      appliedPosition:
        registrationLink.appliedPosition,
    });

  } catch (error) {

    console.error(
      "Registration link fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load registration link",
      },
      {
        status: 500,
      }
    );
  }
}