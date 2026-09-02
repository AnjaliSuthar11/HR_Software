import { NextResponse } from "next/server";

import PettyCash from "@/models/PettyCash";
import { connectDB } from "@/lib/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    const filter = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const expenses = await PettyCash.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const total = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      expenses,
      total,
    });
  } catch (error) {
    console.error("Petty cash GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load petty cash",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      date,
      category,
      description,
      amount,
      paidTo,
      paymentMethod,
      reference,
      notes,
    } = body;

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message: "Date is required",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required",
        },
        { status: 400 }
      );
    }

    if (
      amount === undefined ||
      amount === null ||
      Number(amount) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid amount is required",
        },
        { status: 400 }
      );
    }

    const expense = await PettyCash.create({
      date,
      category,
      description,
      amount: Number(amount),
      paidTo: paidTo || "",
      paymentMethod: paymentMethod || "Cash",
      reference: reference || "",
      notes: notes || "",
    });

    return NextResponse.json({
      success: true,
      message: "Petty cash expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Petty cash POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add petty cash expense",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense ID is required",
        },
        { status: 400 }
      );
    }

    await PettyCash.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Petty cash DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete expense",
      },
      {
        status: 500,
      }
    );
  }
}