// import { connectDB } from "@/lib/mongodb";
// import Employee from "@/models/Employee";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const employee = await Employee.findById(id);

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Employee not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       employee,
//     });

//   } catch (error) {
//     console.log(error);
 
    
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("EMPLOYEE ID RECEIVED:", id);

    const employee = await Employee.findById(id)
      .select("-companyLoginPassword")
      .lean();

    console.log("EMPLOYEE FOUND:", employee);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });

  } catch (error) {
    console.error("Employee GET API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}