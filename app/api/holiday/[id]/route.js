import { connectDB } from "@/lib/mongodb";
import Holiday from "@/models/Holiday";
import { NextResponse } from "next/server";


// ======================================================
// UPDATE HOLIDAY
// ======================================================

export async function PATCH(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } =
      await params;

    const body =
      await req.json();

    const {
      date,
      name,
      type,
      description,
      paid,
    } = body;


    const updateData = {};


    // -----------------------------------------------
    // DATE
    // -----------------------------------------------

    if (
      date !== undefined
    ) {
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

      updateData.date =
        holidayDate;
    }


    // -----------------------------------------------
    // NAME
    // -----------------------------------------------

    if (
      name !== undefined
    ) {
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

      updateData.name =
        name.trim();
    }


    // -----------------------------------------------
    // TYPE
    // -----------------------------------------------

    if (
      type !== undefined
    ) {
      updateData.type =
        type;
    }


    // -----------------------------------------------
    // DESCRIPTION
    // -----------------------------------------------

    if (
      description !== undefined
    ) {
      updateData.description =
        description || "";
    }


    // -----------------------------------------------
    // PAID
    // -----------------------------------------------

    if (
      paid !== undefined
    ) {
      updateData.paid =
        Boolean(paid);
    }


    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    const holiday =
      await Holiday.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );


    if (!holiday) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Holiday not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      success: true,

      message:
        "Holiday updated successfully",

      holiday,
    });

  } catch (error) {

    console.error(
      "PATCH /api/holiday/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to update holiday",
      },
      {
        status: 500,
      }
    );
  }
}


// ======================================================
// DELETE HOLIDAY
// ======================================================

export async function DELETE(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } =
      await params;


    const holiday =
      await Holiday.findByIdAndDelete(
        id
      );


    if (!holiday) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Holiday not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({
      success: true,

      message:
        "Holiday deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE /api/holiday/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Unable to delete holiday",
      },
      {
        status: 500,
      }
    );
  }
}