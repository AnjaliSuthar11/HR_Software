"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    const res = await axios.get("/api/employee/list");
    setEmployees(res.data.employees);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Employees
        </h1>

        <Link
          href="/dashboard/employees/add"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Employee
        </Link>

      </div>

      <div className="grid gap-5">

        {employees.map((employee) => {

          const uploaded =
            employee.employeePhoto &&
            employee.panCardDocument &&
            employee.aadharCardDocument &&
            employee.highestEducationDocument &&
            employee.experienceLetter &&
            employee.salarySlip;

          return (

            <div
              key={employee._id}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
            >

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full overflow-hidden border">

                  {employee.employeePhoto ? (

                    <Image
                      src={employee.employeePhoto}
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">

                      👤

                    </div>

                  )}

                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    {employee.employeeFullName}
                  </h2>

                  <p className="text-gray-500">
                    {employee.employeeCode}
                  </p>

                  <p
                    className={`font-medium ${
                      uploaded
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {uploaded
                      ? "Documents Uploaded"
                      : "Documents Pending"}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                {!uploaded ? (

                  <Link
                    href={`/dashboard/employees/${employee._id}/documents`}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >
                    Upload Documents
                  </Link>

                ) : (

                  <Link
                    href={`/dashboard/employees/${employee._id}/documents`}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    View Documents
                  </Link>

                )}

                <Link
                  href={`/dashboard/employees/${employee._id}`}
                  className="border px-5 py-2 rounded-lg"
                >
                  View
                </Link>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}