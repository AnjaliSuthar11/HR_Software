import { NextResponse } from "next/server";




// original code 
// 21st september added login for this dashboard

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, checking hardcoded credentials on the backend
    if (email === "anjali@gmail.com" && password === "123456") {
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "401 Unauthorized" }, { status: 401 });
  } 
  
  catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
