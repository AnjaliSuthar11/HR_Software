import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { NextResponse } from "next/server";


// ================= GET =================

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
    console.error("GET Candidate Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


// ================= PUT =================

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    console.log("========== UPDATE CANDIDATE ==========");
    console.log("Candidate ID:", id);
    console.log("Request Body:", body);

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


    // ================= ROUND 1 =================

    if (body.round1) {
      candidate.round1 = {
        ...(candidate.round1?.toObject?.() || candidate.round1 || {}),
        ...body.round1,
      };
    }


    // ================= ROUND 2 =================

    if (body.round2) {
      candidate.round2 = {
        ...(candidate.round2?.toObject?.() || candidate.round2 || {}),
        ...body.round2,
      };
    }


    // ================= FINAL STATUS =================

    if (body.finalStatus !== undefined) {
      candidate.finalStatus = body.finalStatus;
    }


    // ================= NOTES =================

    if (body.notes !== undefined) {
      candidate.notes = body.notes;
    }


    // ================= OFFERED JOINING DATE =================

    if (body.offeredJoiningDate !== undefined) {

      console.log(
        "Saving Offered Joining Date:",
        body.offeredJoiningDate
      );

      candidate.offeredJoiningDate =
        body.offeredJoiningDate
          ? new Date(body.offeredJoiningDate)
          : null;
    }


    await candidate.save();

    console.log(
      "Saved Offered Joining Date:",
      candidate.offeredJoiningDate
    );

    return NextResponse.json({
      success: true,
      message: "Candidate updated successfully",
      candidate,
    });

  } catch (error) {

    console.error("PUT Candidate Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}