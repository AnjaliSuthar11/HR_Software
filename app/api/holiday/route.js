import { connectDB } from "@/lib/mongodb";
import Holiday from "@/models/Holiday";
import { NextResponse } from "next/server";


// ======================================================
// GET HOLIDAYS
// ======================================================

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const year =
      searchParams.get("year");

    let query = {};

    // -----------------------------------------------
    // Filter by year
    // -----------------------------------------------

    if (year) {
      const numericYear =
        Number(year);

      if (
        !Number.isInteger(
          numericYear
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid year",
          },
          {
            status: 400,
          }
        );
      }

      const startDate =
        new Date(
          numericYear,
          0,
          1
        );

      const endDate =
        new Date(
          numericYear + 1,
          0,
          1
        );

      query = {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    }

    const holidays =
      await Holiday.find(
        query
      )
        .sort({
          date: 1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      holidays,
    });

  } catch (error) {
    console.error(
      "GET /api/holiday error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to load holidays",
      },
      {
        status: 500,
      }
    );
  }
}


// ======================================================
// ADD HOLIDAY
// ======================================================

export async function POST(req) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      date,
      name,
      type,
      description,
      paid,
    } = body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Holiday date is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !name ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Holiday name is required",
        },
        {
          status: 400,
        }
      );
    }


    const holidayDate =
      new Date(date);

    holidayDate.setHours(
      0,
      0,
      0,
      0
    );


    if (
      Number.isNaN(
        holidayDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid holiday date",
        },
        {
          status: 400,
        }
      );
    }


    // -----------------------------------------------
    // CHECK DUPLICATE DATE + NAME
    // -----------------------------------------------

    const existingHoliday =
      await Holiday.findOne({
        date: holidayDate,
        name: name.trim(),
      }).lean();


    if (existingHoliday) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This holiday already exists",
        },
        {
          status: 409,
        }
      );
    }


    // -----------------------------------------------
    // CREATE
    // -----------------------------------------------

    const holiday =
      await Holiday.create({
        date:
          holidayDate,

        name:
          name.trim(),

        type:
          type ||
          "Company Holiday",

        description:
          description?.trim() ||
          "",

        paid:
          paid !== false,
      });


    return NextResponse.json(
      {
        success: true,

        message:
          "Holiday added successfully",

        holiday,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "POST /api/holiday error:",
      error
    );

    // Duplicate index error
    if (
      error.code ===
      11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This holiday already exists",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to add holiday",
      },
      {
        status: 500,
      }
    );
  }
}