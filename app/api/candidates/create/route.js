import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";
import RegistrationLink from "@/models/RegistrationLink";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("========== CREATE CANDIDATE ==========");
    console.log("Registration Token:", body.registrationToken);

    // ==========================================
    // CHECK TOKEN
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

    // ==========================================
    // FIND REGISTRATION LINK
    // ==========================================

    const registrationLink =
      await RegistrationLink.findOne({
        token: body.registrationToken,
        used: false,
      });

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
    // EXPIRATION
    // ==========================================

    if (
      registrationLink.expiresAt &&
      new Date() >
        registrationLink.expiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This registration link has expired.",
        },
        { status: 410 }
      );
    }

    // ==========================================
    // GET JOB INFORMATION FROM LINK
    // ==========================================

    const department =
      registrationLink.department || "";

    const appliedPosition =
      registrationLink.appliedPosition || "";

    console.log(
      "RegistrationLink Department:",
      department
    );

    console.log(
      "RegistrationLink Applied Position:",
      appliedPosition
    );

    // ==========================================
    // CREATE CANDIDATE
    // ==========================================

    const candidate =
      await Candidate.create({
        fullName:
          body.fullName,

        gender:
          body.gender || undefined,

        dateOfBirth:
          body.dateOfBirth || undefined,

        maritalStatus:
          body.maritalStatus || undefined,

        mobile:
          body.mobile,

        email:
          body.email,

        address:
          body.address || "",

        highestQualification:
          body.highestQualification || "",

        university:
          body.university || "",

        passingYear:
          body.passingYear || "",

        percentage:
          body.percentage || "",

        softwareKnowledge:
          body.softwareKnowledge || [],

        previousCompany:
          body.previousCompany || "",

        previousDesignation:
          body.previousDesignation || "",

        experience:
          body.experience ||
          undefined,

        experienceYears:
          body.experienceYears || "",

        lastSalary:
          body.lastSalary || "",

        lastInHandSalary:
          body.lastInHandSalary || "",

        salarySlip:
          body.salarySlip ||
          undefined,

        currentlyWorking:
          body.currentlyWorking ||
          undefined,

        preferredJoiningDate:
          body.preferredJoiningDate ||
          null,

        criminalRecord:
          body.criminalRecord || "",

        noticePeriod:
          body.noticePeriod || undefined,

        experienceLetter:
          body.experienceLetter ||
          undefined,

        reference:
          body.reference || "",

        // ======================================
        // IMPORTANT
        // FROM REGISTRATION LINK
        // ======================================

        department:
          department,

        appliedPosition:
          appliedPosition,

        // ======================================
        // DEFAULT
        // ======================================

        finalStatus:
          "New",

        registrationToken:
          body.registrationToken,

        registrationTokenUsed:
          true,
      });

    // ==========================================
    // VERIFY WHAT WAS SAVED
    // ==========================================

    console.log(
      "========== CANDIDATE CREATED =========="
    );

    console.log(
      "Candidate ID:",
      candidate._id
    );

    console.log(
      "Candidate Department:",
      candidate.department
    );

    console.log(
      "Candidate Position:",
      candidate.appliedPosition
    );

    // ==========================================
    // MARK LINK USED
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

      message:
        "Candidate Created Successfully",

      candidate,
    });
  } catch (error) {
    console.error(
      "Candidate creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to create candidate",
      },
      {
        status: 500,
      }
    );
  }
}