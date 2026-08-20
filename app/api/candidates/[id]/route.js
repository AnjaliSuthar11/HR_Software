import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return NextResponse.json(
        {
          success: false,
          message: "Candidate not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      candidate,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}