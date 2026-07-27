"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function EmployeeProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee();
  }, []);

  const getEmployee = async () => {
    try {
      const res = await axios.get(`/api/employee/${id}`);
      setEmployee(res.data.employee);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading Employee...
      </div>
    );
  }
console.log(employee);
  if (!employee) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 text-xl">
        Employee Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

          <div>

            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline mb-2"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold">
              Employee Profile
            </h1>

          </div>

          <div className="flex gap-4">

            <Link
              href={`/dashboard/employees/${employee._id}/edit`}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Edit Employee
            </Link>

            <Link
              href={`/dashboard/employees/${employee._id}/documents`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Documents
            </Link>

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* PROFILE CARD */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-8">

          <div className="flex flex-col items-center">

            {employee.employeePhoto ? (

              <Image
                src={employee.employeePhoto}
                alt=""
                width={170}
                height={170}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
              />

            ) : (

              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-7xl">
                👤
              </div>

            )}

            <h2 className="text-3xl font-bold mt-6">
              {employee.employeeFullName}
            </h2>

            <p className="text-gray-500 mt-2">
              {employee.employeeCode}
            </p>

            <span
              className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
                employee.employeeStatus === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {employee.employeeStatus}
            </span>

            <div className="flex gap-10 mt-6 text-gray-600">

              <div>
                📧 {employee.emailId || "-"}
              </div>

              <div>
                📞 {employee.mobileNo || "-"}
              </div>

            </div>

          </div>

        </div>

        {/* PERSONAL INFORMATION */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-8">
            👤 Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-6">

            <div>
              <p className="text-gray-500 text-sm">
                Employee Code
              </p>

              <p className="font-semibold">
                {employee.employeeCode || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <p className="font-semibold">
                {employee.employeeFullName || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Father Name
              </p>

              <p className="font-semibold">
                {employee.fatherName || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Gender
              </p>

              <p className="font-semibold">
                {employee.gender || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Date of Birth
              </p>

              <p className="font-semibold">
                {employee.dateOfBirth
                  ? new Date(
                      employee.dateOfBirth
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Mobile Number
              </p>

              <p className="font-semibold">
                {employee.mobileNo || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Email Address
              </p>

              <p className="font-semibold">
                {employee.emailId || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Nationality
              </p>

              <p className="font-semibold">
                {employee.nationality || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Religion
              </p>

              <p className="font-semibold">
                {employee.religion || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Marital Status
              </p>

              <p className="font-semibold">
                {employee.maritalStatus || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Blood Group
              </p>

              <p className="font-semibold">
                {employee.bloodGroup || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Health Problem
              </p>

              <p className="font-semibold">
                {employee.healthProblem || "None"}
              </p>
            </div>

          </div>

        </div>
                {/* ADDRESS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-8">
            📍 Address
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <p className="text-gray-500 text-sm mb-2">
                Current Address
              </p>

              <div className="border rounded-xl p-5 bg-gray-50 min-h-[120px]">
                <p className="font-medium whitespace-pre-wrap">
                  {employee.address || "-"}
                </p>
              </div>

            </div>

            <div>

              <p className="text-gray-500 text-sm mb-2">
                Permanent Address
              </p>

              <div className="border rounded-xl p-5 bg-gray-50 min-h-[120px]">
                <p className="font-medium whitespace-pre-wrap">
                  {employee.permanentAddress || "-"}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* IDENTITY DETAILS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-8">
            🪪 Identity Details
          </h2>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-6">

            <div>

              <p className="text-gray-500 text-sm">
                PAN Card Number
              </p>

              <p className="font-semibold tracking-wide">
                {employee.panCardNo || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Aadhar Card Number
              </p>

              <p className="font-semibold tracking-wide">
                {employee.aadharCardNo || "-"}
              </p>

            </div>

          </div>

        </div>

        {/* EDUCATION */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-8">
            🎓 Education
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            <div>

              <p className="text-gray-500 text-sm">
                Highest Qualification
              </p>

              <p className="font-semibold text-lg mt-1">
                {employee.highestQualification || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm mb-3">
                Software Knowledge
              </p>

              {employee.softwareKnowledge?.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                  {employee.softwareKnowledge.map((skill, index) => (

                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              ) : (

                <p>-</p>

              )}

            </div>

          </div>

        </div>

        {/* BANK DETAILS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-8">
            🏦 Bank Details
          </h2>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-6">

            <div>

              <p className="text-gray-500 text-sm">
                Bank Name
              </p>

              <p className="font-semibold">
                {employee.bankDetails?.bankName || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Account Holder
              </p>

              <p className="font-semibold">
                {employee.bankDetails?.accountName || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Account Number
              </p>

              <p className="font-semibold">
                {employee.bankDetails?.accountNumber || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                IFSC Code
              </p>

              <p className="font-semibold">
                {employee.bankDetails?.ifscCode || "-"}
              </p>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Branch
              </p>

              <p className="font-semibold">
                {employee.bankDetails?.branch || "-"}
              </p>

            </div>

          </div>

        </div>


                {/* FAMILY DETAILS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            👨‍👩‍👧 Family Details
          </h2>

          {employee.familyDetails?.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Relationship</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Occupation</th>

                  </tr>

                </thead>

                <tbody>

                  {employee.familyDetails.map((member, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {member.name || "-"}
                      </td>

                      <td className="p-4">
                        {member.relationship || "-"}
                      </td>

                      <td className="p-4">
                        {member.contactNo || "-"}
                      </td>

                      <td className="p-4">
                        {member.occupation || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <p>No Family Details Added</p>

          )}

        </div>

        {/* EMERGENCY CONTACTS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            🚨 Emergency Contacts
          </h2>

          {employee.emergencyContacts?.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Relationship</th>
                    <th className="text-left p-4">Contact</th>

                  </tr>

                </thead>

                <tbody>

                  {employee.emergencyContacts.map((contact, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {contact.name || "-"}
                      </td>

                      <td className="p-4">
                        {contact.relationship || "-"}
                      </td>

                      <td className="p-4">
                        {contact.contactNo || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <p>No Emergency Contacts</p>

          )}

        </div>

        {/* PREVIOUS EMPLOYMENT */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            💼 Previous Employment
          </h2>

          {employee.previousEmployment?.length > 0 ? (

            employee.previousEmployment.map((job, index) => (

              <div
                key={index}
                className="border rounded-xl p-6 mb-6 bg-gray-50"
              >

                <div className="grid md:grid-cols-2 gap-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Company
                    </p>

                    <p className="font-semibold">
                      {job.companyName || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Designation
                    </p>

                    <p className="font-semibold">
                      {job.designation || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Place
                    </p>

                    <p className="font-semibold">
                      {job.place || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Annual Salary
                    </p>

                    <p className="font-semibold">
                      ₹ {job.annualSalary || "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Joining Date
                    </p>

                    <p className="font-semibold">
                      {job.joinDate
                        ? new Date(job.joinDate).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Leaving Date
                    </p>

                    <p className="font-semibold">
                      {job.leftDate
                        ? new Date(job.leftDate).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-gray-500 text-sm">
                    Reason For Leaving
                  </p>

                  <p className="font-semibold">
                    {job.reasonForLeaving || "-"}
                  </p>

                </div>

              </div>

            ))

          ) : (

            <p>No Previous Employment Added</p>

          )}

        </div>

        {/* DOCUMENTS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10">

          <h2 className="text-2xl font-bold mb-8">
            📄 Documents
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {[
              {
                title: "Employee Photo",
                url: employee.employeePhoto,
              },
              {
                title: "PAN Card",
                url: employee.panCardDocument,
              },
              {
                title: "Aadhar Card",
                url: employee.aadharCardDocument,
              },
              {
                title: "Highest Qualification",
                url: employee.highestEducationDocument,
              },
              {
                title: "Experience Letter",
                url: employee.experienceLetter,
              },
              {
                title: "Salary Slip",
                url: employee.salarySlip,
              },
            ].map((doc, index) => (

              <div
                key={index}
                className="border rounded-xl p-6 hover:shadow-lg transition"
              >

                <h3 className="font-semibold text-lg mb-5">
                  {doc.title}
                </h3>

                {doc.url ? (

                  <>

                    <p className="text-green-600 font-medium mb-4">
                      ✅ Uploaded
                    </p>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                      View Document
                    </a>

                  </>

                ) : (

                  <>

                    <p className="text-red-500 font-medium mb-4">
                      ❌ Not Uploaded
                    </p>

                    <Link
                      href={`/dashboard/employees/${employee._id}/documents`}
                      className="inline-block bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg"
                    >
                      Upload
                    </Link>

                  </>

                )}

              </div>

            ))}

          </div>

        </div>
<div className="grid md:grid-cols-4 gap-6 mb-8">

  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <p className="text-gray-500 text-sm">Employee Code</p>
    <h2 className="text-2xl font-bold mt-2">
      {employee.employeeCode}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <p className="text-gray-500 text-sm">Joining Date</p>
    <h2 className="text-lg font-semibold mt-2">
      {employee.joiningDate
        ? new Date(employee.joiningDate).toLocaleDateString()
        : "-"}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <p className="text-gray-500 text-sm">Qualification</p>
    <h2 className="text-lg font-semibold mt-2">
      {employee.highestQualification || "-"}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <p className="text-gray-500 text-sm">Status</p>

    <span className="inline-block mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
      {employee.employeeStatus}
    </span>
  </div>

</div>
      </div>

    </div>
    

  );
}
