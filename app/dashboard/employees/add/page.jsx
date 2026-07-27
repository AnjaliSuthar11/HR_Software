"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddEmployee() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeFullName: "",
    employeePhoto: "",

    fatherName: "",
    address: "",
    permanentAddress: "",
    gender: "",
    mobileNo: "",
    emailId: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    dateOfBirth: "",

    panCardNo: "",
    aadharCardNo: "",
    bloodGroup: "",
    healthProblem: "",

    highestQualification: "",
    softwareKnowledge: "",

    panCardDocument: "",
    aadharCardDocument: "",
    highestEducationDocument: "",
    experienceLetter: "",
    salarySlip: "",

    familyDetails: [
      {
        name: "",
        relationship: "",
        contactNo: "",
        occupation: "",
      },
    ],

    previousEmployment: [
      {
        companyName: "",
        place: "",
        joinDate: "",
        leftDate: "",
        designation: "",
        annualSalary: "",
        reasonForLeaving: "",
      },
    ],

    emergencyContacts: [
      {
        name: "",
        relationship: "",
        contactNo: "",
      },
    ],

    bankDetails: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
    },

    joiningDate: "",
    employeeStatus: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBankChange = (e) => {
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const updated = [...formData[arrayName]];
    updated[index][field] = value;

    setFormData({
      ...formData,
      [arrayName]: updated,
    });
  };

  const addRow = (arrayName, obj) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], obj],
    });
  };

  const removeRow = (arrayName, index) => {
    const updated = [...formData[arrayName]];
    updated.splice(index, 1);

    setFormData({
      ...formData,
      [arrayName]: updated,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,

      gender: formData.gender || undefined,
      maritalStatus: formData.maritalStatus || undefined,
      bloodGroup: formData.bloodGroup || undefined,

      dateOfBirth: formData.dateOfBirth || undefined,
      joiningDate: formData.joiningDate || undefined,

      softwareKnowledge: formData.softwareKnowledge
        ? formData.softwareKnowledge
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      familyDetails: formData.familyDetails.filter(
        (item) =>
          item.name ||
          item.relationship ||
          item.contactNo ||
          item.occupation
      ),

      previousEmployment: formData.previousEmployment.filter(
        (item) =>
          item.companyName ||
          item.place ||
          item.joinDate ||
          item.leftDate ||
          item.designation ||
          item.annualSalary ||
          item.reasonForLeaving
      ),

      emergencyContacts: formData.emergencyContacts.filter(
        (item) =>
          item.name ||
          item.relationship ||
          item.contactNo
      ),

      bankDetails:
        formData.bankDetails.bankName ||
        formData.bankDetails.accountName ||
        formData.bankDetails.accountNumber ||
        formData.bankDetails.ifscCode ||
        formData.bankDetails.branch
          ? formData.bankDetails
          : undefined,
    };

    console.log(payload);

    const res = await axios.post("/api/employee/create", payload);

    alert(res.data.message);

    router.push("/dashboard/employees");
  } catch (err) {
    console.log(err.response?.data || err);
    alert(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Employee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Employee Information */}
        <div>

       <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
       <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6">

    <p className="text-blue-100 mt-1">
      Fill in the employee's personal information.
    </p>

  </div>

  {/* Header */}
  <div className="p-8">

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {/* Employee Code */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Employee Code
        </label>

        <input
          name="employeeCode"
          placeholder="EMP-001"
          value={formData.employeeCode}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />

      </div>

      {/* Employee Name */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Employee Full Name
        </label>

        <input
          name="employeeFullName"
          placeholder="Employee Name"
          value={formData.employeeFullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Father Name */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Father Name
        </label>

        <input
          name="fatherName"
          placeholder="Father Name"
          value={formData.fatherName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Address */}

      <div className="md:col-span-2">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Current Address
        </label>

        <textarea
          rows={4}
          name="address"
          placeholder="Current Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

      </div>

      {/* Permanent Address */}

      <div className="md:col-span-2">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Permanent Address
        </label>

        <textarea
          rows={4}
          name="permanentAddress"
          placeholder="Permanent Address"
          value={formData.permanentAddress}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

      </div>

      {/* Gender */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

      </div>

      {/* Mobile */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mobile Number
        </label>

        <input
          name="mobileNo"
          placeholder="9876543210"
          value={formData.mobileNo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Email */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>

        <input
          name="emailId"
          placeholder="employee@email.com"
          value={formData.emailId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Nationality */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nationality
        </label>

        <input
          name="nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Religion */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Religion
        </label>

        <input
          name="religion"
          placeholder="Religion"
          value={formData.religion}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Marital Status */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Marital Status
        </label>

        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Status</option>
          <option>Single</option>
          <option>Married</option>
          <option>Divorced</option>
          <option>Widowed</option>
          <option>Other</option>
        </select>

      </div>

      {/* DOB */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Date of Birth
        </label>

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* PAN */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          PAN Card Number
        </label>

        <input
          name="panCardNo"
          placeholder="ABCDE1234F"
          value={formData.panCardNo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Aadhaar */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Aadhaar Number
        </label>

        <input
          name="aadharCardNo"
          placeholder="123456789012"
          value={formData.aadharCardNo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Blood Group */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Blood Group
        </label>

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

      </div>

      {/* Health */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Health Problem
        </label>

        <input
          name="healthProblem"
          placeholder="If any..."
          value={formData.healthProblem}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Qualification */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Highest Qualification
        </label>

        <input
          name="highestQualification"
          placeholder="Highest Qualification"
          value={formData.highestQualification}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* Skills */}

      <div className="md:col-span-2 xl:col-span-3">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Software Knowledge
        </label>

        <textarea
          rows={4}
          name="softwareKnowledge"
          placeholder="React, Next.js, Node.js, MongoDB..."
          value={formData.softwareKnowledge}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

      </div>

    </div>

  </div>

</div>
        </div>

        {/* Family */}
<div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

  {/* Header */}



  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
    <p className="text-purple-100 mt-1">
      Add family member information for the employee.
    </p>

  </div>

  <div className="p-8 space-y-6">
<h2 className="font-bold text-xl mb-4">
           Family Information
          </h2>

    {formData.familyDetails.map((item, index) => (

      <div
        key={index}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
      >

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-lg font-semibold text-gray-800">
            Family Member #{index + 1}
          </h3>

          {formData.familyDetails.length > 1 && (
            <button
              type="button"
              onClick={() => removeRow("familyDetails", index)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Remove
            </button>
          )}

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Name */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <input
              placeholder="Enter Name"
              value={item.name}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "name",
                  e.target.value,
                  "familyDetails"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />

          </div>

          {/* Relationship */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Relationship
            </label>

            <input
              placeholder="Father / Mother / Wife"
              value={item.relationship}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "relationship",
                  e.target.value,
                  "familyDetails"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />

          </div>

          {/* Contact */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Number
            </label>

            <input
              placeholder="9876543210"
              value={item.contactNo}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "contactNo",
                  e.target.value,
                  "familyDetails"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />

          </div>

          {/* Occupation */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Occupation
            </label>

            <input
              placeholder="Occupation"
              value={item.occupation}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "occupation",
                  e.target.value,
                  "familyDetails"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />

          </div>

        </div>

      </div>

    ))}

    <div className="flex justify-end">

      <button
        type="button"
        onClick={() =>
          addRow("familyDetails", {
            name: "",
            relationship: "",
            contactNo: "",
            occupation: "",
          })
        }
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
      >
        + Add Family Member
      </button>

    </div>

  </div>

</div>
        {/* Previous Employment */}

     <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

  {/* Header */}

  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
    <p className="text-emerald-100 mt-1">
      Add previous employment history of the employee.
    </p>

  </div>

  <div className="p-8 space-y-6">
  <h2 className="text-2xl font-bold">
       Previous Employment
    </h2>
    {formData.previousEmployment.map((item, index) => (

      <div
        key={index}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
      >

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-lg font-semibold text-gray-800">
            Employment #{index + 1}
          </h3>

          {formData.previousEmployment.length > 1 && (
            <button
              type="button"
              onClick={() => removeRow("previousEmployment", index)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Remove
            </button>
          )}

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Company */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>

            <input
              placeholder="ABC Pvt. Ltd."
              value={item.companyName}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "companyName",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Designation */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Designation
            </label>

            <input
              placeholder="Software Engineer"
              value={item.designation}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "designation",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Place */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Place
            </label>

            <input
              placeholder="Mumbai"
              value={item.place}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "place",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Joining Date */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Joining Date
            </label>

            <input
              type="date"
              value={item.joinDate}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "joinDate",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Leaving Date */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Leaving Date
            </label>

            <input
              type="date"
              value={item.leftDate}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "leftDate",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Annual Salary */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Annual Salary
            </label>

            <input
              placeholder="Annual Salary"
              value={item.annualSalary}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "annualSalary",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

          </div>

          {/* Reason */}

          <div className="md:col-span-2 xl:col-span-3">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason For Leaving
            </label>

            <textarea
              rows={4}
              placeholder="Reason for leaving..."
              value={item.reasonForLeaving}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "reasonForLeaving",
                  e.target.value,
                  "previousEmployment"
                )
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />

          </div>

        </div>

      </div>

    ))}

    <div className="flex justify-end">

      <button
        type="button"
        onClick={() =>
          addRow("previousEmployment", {
            companyName: "",
            designation: "",
            place: "",
            joinDate: "",
            leftDate: "",
            annualSalary: "",
            reasonForLeaving: "",
          })
        }
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
      >
        + Add Previous Employment
      </button>

    </div>

  </div>

</div>

        {/* Bank */}

     <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

  {/* Header */}

  <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-6">
    <p className="text-blue-100 mt-1">
      Enter the employee's bank account information for salary processing.
    </p>

  </div>

  <div className="p-8">

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {/* Bank Name */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bank Name
        </label>

        <input
          name="bankName"
          placeholder="State Bank of India"
          value={formData.bankDetails.bankName}
          onChange={handleBankChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
        />

      </div>

      {/* Account Holder */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Account Holder Name
        </label>

        <input
          name="accountName"
          placeholder="Account Holder Name"
          value={formData.bankDetails.accountName}
          onChange={handleBankChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
        />

      </div>

      {/* Account Number */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Account Number
        </label>

        <input
          name="accountNumber"
          placeholder="Account Number"
          value={formData.bankDetails.accountNumber}
          onChange={handleBankChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
        />

      </div>

      {/* IFSC Code */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          IFSC Code
        </label>

        <input
          name="ifscCode"
          placeholder="SBIN0001234"
          value={formData.bankDetails.ifscCode}
          onChange={handleBankChange}
          className="w-full border border-gray-300 rounded-xl p-3 uppercase focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
        />

      </div>

      {/* Branch */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Branch Name
        </label>

        <input
          name="branch"
          placeholder="Mumbai Main Branch"
          value={formData.bankDetails.branch}
          onChange={handleBankChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
        />

      </div>

    </div>

  </div>

</div>

        {/* Status */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <select
            name="employeeStatus"
            value={formData.employeeStatus}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Resigned</option>
            <option>Terminated</option>
          </select>

        </div>

        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded"
        >
          Save Employee
        </button>

      </form>
    </div>
  );
}