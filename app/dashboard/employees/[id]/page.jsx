"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import {
  User,
  IdCard,
  GraduationCap,
  Briefcase,
  Wallet,
  Eye,
  Upload,
  Pencil,
  CheckCircle,
  XCircle,
  FolderOpen,
} from "lucide-react";

export default function EmployeeProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee();
    console.log("EMPLOYEE:", employee);
    console.log("EXPERIENCE LETTER:", employee?.experienceLetter);
    console.log("SALARY SLIP:", employee?.salarySlip);
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

            <h1 className="text-3xl font-bold">Employee Profile</h1>
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

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 mb-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Profile Photo */}

            <div className="relative">
              {employee.employeePhoto ? (
                <Image
                  src={employee.employeePhoto}
                  alt={employee.employeeFullName}
                  width={180}
                  height={180}
                  className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-44 h-44 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center text-8xl">
                  👤
                </div>
              )}

              <div
                className={`absolute bottom-3 right-3 w-7 h-7 rounded-full border-4 border-white ${
                  employee.employeeStatus === "Active"
                    ? "bg-green-500"
                    : employee.employeeStatus === "Inactive"
                    ? "bg-yellow-500"
                    : employee.employeeStatus === "Resigned"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              />
            </div>

            {/* Details */}

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {employee.employeeFullName}
                  </h1>
<div className="flex flex-col  pt-2">
                  
                  {/* <p className="text-gray-500 mt-2 text-lg">
                    {" "}
                    Department: {employee.department}
                  </p> */}

                  <p className="text-gray-500 mt-2 text-lg">
                    Employee ID : {employee.employeeCode}
                  </p>


                  <p className="text-gray-500 mt-2 text-lg">
                    Designation:{" "}
                    {employee.designation || "Designation not assigned"}
                  </p>
                  </div>
                </div>

                <span
                  className={`mt-5 lg:mt-0 px-5 py-2 rounded-full text-sm font-semibold ${
                    employee.employeeStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : employee.employeeStatus === "Inactive"
                      ? "bg-yellow-100 text-yellow-700"
                      : employee.employeeStatus === "Resigned"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employee.employeeStatus}
                </span>
              </div>

              {/* Info Cards */}

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
                <div className="border rounded-2xl p-5 hover:shadow-md transition">
                  <p className="text-gray-400 text-sm mb-1">Email</p>

                  <p className="font-semibold break-all">
                    {employee.emailId || "-"}
                  </p>
                </div>

                <div className="border rounded-2xl p-5 hover:shadow-md transition">
                  <p className="text-gray-400 text-sm mb-1">Mobile</p>

                  <p className="font-semibold">{employee.mobileNo || "-"}</p>
                </div>

                <div className="border rounded-2xl p-5 hover:shadow-md transition">
                  <p className="text-gray-400 text-sm mb-1">Gender</p>

                  <p className="font-semibold">{employee.gender || "-"}</p>
                </div>

                <div className="border rounded-2xl p-5 hover:shadow-md transition">
                  <p className="text-gray-400 text-sm mb-1">Joining Date</p>
                  

                  <p className="font-semibold">
                    {employee.joiningDate
                      ? new Date(employee.joiningDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href={`/dashboard/employees/${employee._id}/edit`}
                  className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition font-medium"
                >
                  ✏️ Edit Employee
                </Link>

                <Link
                  href={`/dashboard/employees/${employee._id}/documents`}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
                >
                  📄 Documents
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>

              <p className="text-gray-500 mt-1">
                Basic employee profile and personal details.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Employee Code
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.employeeCode || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Full Name
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.employeeFullName || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Father Name
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.fatherName || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Gender
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.gender || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Date of Birth
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.dateOfBirth
                    ? new Date(employee.dateOfBirth).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Mobile Number
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.mobileNo || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Email Address
                </p>
                <p className="text-lg font-semibold text-gray-900 break-all">
                  {employee.emailId || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Nationality
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.nationality || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Religion
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.religion || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Marital Status
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.maritalStatus || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Blood Group
                </p>
                <p className="text-lg font-semibold text-red-600">
                  {employee.bloodGroup || "-"}
                </p>
              </div>

              <div className="border rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Health Problem
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.healthProblem || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ADDRESS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Address Information
            </h2>

            <p className="text-gray-500 mt-1">
              Current and permanent address details.
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Current Address */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Current Address
                </p>

                <p className="text-gray-800 leading-8 text-base whitespace-pre-wrap">
                  {employee.address || "-"}
                </p>
              </div>

              {/* Permanent Address */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Permanent Address
                </p>

                <p className="text-gray-800 leading-8 text-base whitespace-pre-wrap">
                  {employee.permanentAddress || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IDENTITY DETAILS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Identity Details
            </h2>

            <p className="text-gray-500 mt-1">
              Government-issued identity information of the employee.
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-10">
              {/* PAN Card */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                  PAN Card Number
                </p>

                <p className="text-lg font-semibold text-gray-900 tracking-widest break-all">
                  {employee.panCardNo || "-"}
                </p>
              </div>

              {/* Aadhar Card */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Aadhar Card Number
                </p>

                <p className="text-lg font-semibold text-gray-900 tracking-widest break-all">
                  {employee.aadharCardNo || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATION */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Education & Skills
            </h2>

            <p className="text-gray-500 mt-1">
              Academic qualification and technical expertise of the employee.
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Highest Qualification */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Highest Qualification
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {employee.highestQualification || "-"}
                </p>
              </div>

              {/* Software Knowledge */}

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-4">
                  Software Knowledge
                </p>

                {employee.softwareKnowledge?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {employee.softwareKnowledge.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 text-sm font-medium hover:bg-gray-100 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 font-medium">-</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* BANK DETAILS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>

              <p className="text-gray-500 mt-1">
                Banking information for salary and payroll processing.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Bank Name */}

              <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Bank Name
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {employee.bankDetails?.bankName || "-"}
                </p>
              </div>

              {/* Account Holder */}

              <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Account Holder
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {employee.bankDetails?.accountName || "-"}
                </p>
              </div>

              {/* Account Number */}

              <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Account Number
                </p>

                <p className="text-lg font-semibold text-gray-900 tracking-wider">
                  {employee.bankDetails?.accountNumber || "-"}
                </p>
              </div>

              {/* IFSC */}

              <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  IFSC Code
                </p>

                <p className="text-lg font-semibold text-gray-900 tracking-wider">
                  {employee.bankDetails?.ifscCode || "-"}
                </p>
              </div>

              {/* Branch */}

              <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Branch
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {employee.bankDetails?.branch || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAMILY DETAILS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">Family Details</h2>

            <p className="text-gray-500 mt-1">
              Family members and their relationship with the employee.
            </p>
          </div>

          <div className="p-8">
            {employee.familyDetails?.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Relationship
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Contact Number
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Occupation
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employee.familyDetails.map((member, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {member.name || "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {member.relationship || "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {member.contactNo || "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {member.occupation || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-14 border-2 border-dashed border-gray-300 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Family Details Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Family information has not been added for this employee.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* EMERGENCY CONTACTS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Emergency Contacts
            </h2>

            <p className="text-gray-500 mt-1">
              Emergency contact persons for the employee.
            </p>
          </div>

          <div className="p-8">
            {employee.emergencyContacts?.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Contact Name
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Relationship
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Contact Number
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employee.emergencyContacts.map((contact, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {contact.name || "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {contact.relationship || "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {contact.contactNo || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl py-14 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  No Emergency Contacts Added
                </h3>

                <p className="text-gray-500 mt-2">
                  No emergency contact information has been provided for this
                  employee.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PREVIOUS EMPLOYMENT */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Previous Employment
            </h2>

            <p className="text-gray-500 mt-1">
              Employment history and professional experience of the employee.
            </p>
          </div>

          <div className="p-8">
            {employee.previousEmployment?.length > 0 ? (
              <div className="space-y-8">
                {employee.previousEmployment.map((job, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.companyName || "Company Name"}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Employment #{index + 1}
                        </p>
                      </div>

                      <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                        {job.designation || "-"}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Company Name
                        </p>

                        <p className="font-semibold text-gray-900">
                          {job.companyName || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Designation
                        </p>

                        <p className="font-semibold text-gray-900">
                          {job.designation || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Place
                        </p>

                        <p className="font-semibold text-gray-900">
                          {job.place || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Annual Salary
                        </p>

                        <p className="font-semibold text-gray-900">
                          ₹ {job.annualSalary || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Joining Date
                        </p>

                        <p className="font-semibold text-gray-900">
                          {job.joinDate
                            ? new Date(job.joinDate).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                          Leaving Date
                        </p>

                        <p className="font-semibold text-gray-900">
                          {job.leftDate
                            ? new Date(job.leftDate).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                        Reason For Leaving
                      </p>

                      <p className="text-gray-800 leading-7">
                        {job.reasonForLeaving || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl py-14 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  No Previous Employment Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Previous employment details have not been added for this
                  employee.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DOCUMENTS */}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          {/* Header */}

          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-gray-700" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Employee Documents
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    View, upload and manage all employee documents.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/employees/${employee._id}/documents`}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition"
            >
              <Upload className="w-5 h-5" />
              Manage Documents
            </Link>
          </div>

          {/* Documents */}

          <div className="p-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                {
                  title: "Employee Photo",
                  url: employee.employeePhoto,
                  icon: User,
                },
                {
                  title: "PAN Card",
                  url: employee.panCardDocument,
                  icon: IdCard,
                },
                {
                  title: "Aadhar Card",
                  url: employee.aadharCardDocument,
                  icon: IdCard,
                },
                {
                  title: "Highest Qualification",
                  url: employee.highestEducationDocument,
                  icon: GraduationCap,
                },
                {
                  title: "Experience Letter",
                  url: employee.experienceLetter,
                  icon: Briefcase,
                },
                {
                  title: "Salary Slip",
                  url: employee.salarySlip,
                  icon: Wallet,
                },
              ].map((doc, index) => {
                const Icon = doc.icon;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Top */}

                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-gray-700" />
                        </div>

                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {doc.title}
                          </h3>

                          {doc.url ? (
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />

                              <span className="text-green-600 text-sm font-medium">
                                Uploaded
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <XCircle className="w-4 h-4 text-red-500" />

                              <span className="text-red-500 text-sm font-medium">
                                Not Uploaded
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}

                    {doc.url ? (
                      <div className="space-y-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-medium"
                        >
                          <Eye className="w-5 h-5" />
                          View Document
                        </a>

                        <Link
                          href={`/dashboard/employees/${employee._id}/documents`}
                          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl transition font-medium"
                        >
                          <Pencil className="w-5 h-5" />
                          Update Document
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={`/dashboard/employees/${employee._id}/documents`}
                        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition font-medium"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Document
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <p className="text-gray-500 text-sm">Employee Code</p>
            <h2 className="text-2xl font-bold mt-2">{employee.employeeCode}</h2>
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
