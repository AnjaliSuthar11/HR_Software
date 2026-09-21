"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
    const router = useRouter()
  const [email, setemail] = useState("");

  const [password, setpassword] = useState("");

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    if(email == "anjali@gmail.com" && password ){

        router.push("/dashboard")
    }
    else if( email && !password){
        alert("enter the password")
    }
    else{
        alert("401 unauthorized")
    }

  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl text-center capitalize">login page </h2>

      <form
        onSubmit={handlesubmit}
        className="flex flex-col justify-center items-center gap-2 bg-gray-300 m-auto p-20 rounded-4xl capitalize"
      >
        <div className="flex gap-2 justify-center items-center">
          <label>email id</label>

          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            className="border-1 rounded-3xl p-1"
          />
        </div>

        <div className="flex gap-2 justify-center items-center">
          <label>password</label>

          <input
            className="border-1 rounded-2xl p-1"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type="password"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-400 text-white px-3 py-1 rounded-full mt-3"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default page;


const handlesubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    alert("Enter the email");
    return;
  }

  if (!password) {
    alert("Enter the password");
    return;
  }

  try {
    const response = await fetch("/api/example", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};