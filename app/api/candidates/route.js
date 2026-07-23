import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";

export async function GET() {
  try {
    await connectDB();

    const candidates = await Candidate.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("Candidate API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        stack: error.stack,
      },
      {
        status: 500,
      }
    );
  }
}