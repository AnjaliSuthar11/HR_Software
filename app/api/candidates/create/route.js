import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";
import RegistrationLink from "@/models/RegistrationLink";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // ==========================================
    // CHECK REGISTRATION TOKEN
    // ==========================================

    if (!body.registrationToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration link.",
        },
        { status: 400 }
      );
    }

    // Find token that has NOT been used
    const registrationLink = await RegistrationLink.findOne({
      token: body.registrationToken,
      used: false,
    });

    // Token doesn't exist or was already used
    if (!registrationLink) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This registration link is invalid or has already been used.",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // CHECK EXPIRATION
    // ==========================================

    if (
      registrationLink.expiresAt &&
      new Date() > registrationLink.expiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This registration link has expired.",
        },
        { status: 410 }
      );
    }

    // ==========================================
    // CREATE CANDIDATE
    // ==========================================

    const candidate = await Candidate.create({
      fullName: body.fullName,
      gender: body.gender || undefined,
      dateOfBirth: body.dateOfBirth || undefined,
      maritalStatus: body.maritalStatus || undefined,

      mobile: body.mobile,
      email: body.email,
      address: body.address,

      highestQualification: body.highestQualification,
      university: body.university,
      passingYear: body.passingYear,
      percentage: body.percentage,

      softwareKnowledge: body.softwareKnowledge || [],

      previousCompany: body.previousCompany,
      previousDesignation: body.previousDesignation,

      experience: body.experience || undefined,
      experienceYears: body.experienceYears,

      lastSalary: body.lastSalary,
      lastInHandSalary: body.lastInHandSalary,

      salarySlip: body.salarySlip || undefined,
      currentlyWorking: body.currentlyWorking || undefined,

      preferredJoiningDate: body.preferredJoiningDate,
      criminalRecord: body.criminalRecord,
      noticePeriod: body.noticePeriod,
      experienceLetter: body.experienceLetter,
      reference: body.reference,

      finalStatus: "New",
    });

    // ==========================================
    // MARK REGISTRATION LINK AS USED
    // ==========================================

    await RegistrationLink.findByIdAndUpdate(
      registrationLink._id,
      {
        used: true,
        usedAt: new Date(),
      }
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Candidate Created Successfully",
      candidate,
    });
  } catch (error) {
    console.error("Candidate creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}