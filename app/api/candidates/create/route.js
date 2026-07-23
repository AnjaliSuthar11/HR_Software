import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

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

      joiningDate: body.joiningDate,
      criminalRecord: body.criminalRecord,
      reference: body.reference,

      finalStatus: "New",
    });

    return NextResponse.json({
      success: true,
      message: "Candidate Created Successfully",
      candidate,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}