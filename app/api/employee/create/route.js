// import { connectDB } from "@/lib/mongodb";
// import Candidate from "@/models/Candidate";
// import Employee from "@/models/Employee";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();

// console.log("CREATE API DEPARTMENT:", body.department);
// console.log("CREATE API DESIGNATION:", body.designation);

// const { candidateId, ...employeeData } = body;

//     // Convert empty strings to undefined
//     Object.keys(employeeData).forEach((key) => {
//       if (employeeData[key] === "") {
//         employeeData[key] = undefined;
//       }
//     });

//     const employee = await Employee.create(employeeData);

//     // Candidate → Employee
//     if (candidateId) {
//       await Candidate.findByIdAndUpdate(
//         candidateId,
//         {
//           convertedToEmployee: true,
//           employeeId: employee._id,
//         }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Employee Created Successfully",
//       employee,
//     });

//   } catch (error) {
//     console.error("Employee API Error:", error);

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


// 2nd september
import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("========== CREATE EMPLOYEE ==========");
    console.log("FULL BODY:", body);
    console.log("DEPARTMENT FROM BODY:", body.department);
    console.log("DESIGNATION FROM BODY:", body.designation);

    const { candidateId, ...employeeData } = body;

    console.log("EMPLOYEE DATA BEFORE CREATE:", employeeData);
    console.log("DEPARTMENT BEFORE CREATE:", employeeData.department);
    console.log("DESIGNATION BEFORE CREATE:", employeeData.designation);

    // Convert only empty strings to undefined
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key] === "") {
        employeeData[key] = undefined;
      }
    });

    console.log("EMPLOYEE DATA AFTER CLEANUP:", employeeData);
    console.log("DEPARTMENT AFTER CLEANUP:", employeeData.department);
    console.log("DESIGNATION AFTER CLEANUP:", employeeData.designation);

    const employee = await Employee.create(employeeData);

    console.log("========== EMPLOYEE CREATED ==========");
    console.log("CREATED EMPLOYEE:", employee);
    console.log("SAVED DEPARTMENT:", employee.department);
    console.log("SAVED DESIGNATION:", employee.designation);

    // Candidate → Employee
    if (candidateId) {
      await Candidate.findByIdAndUpdate(
        candidateId,
        {
          convertedToEmployee: true,
          employeeId: employee._id,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee Created Successfully",
      employee,
    });

  } catch (error) {
    console.error("Employee API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}