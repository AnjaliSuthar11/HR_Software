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

          <h2 className="font-bold text-xl mb-4">
            Employee Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="employeeCode"
              placeholder="Employee Code"
              value={formData.employeeCode}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="employeeFullName"
              placeholder="Employee Name"
              value={formData.employeeFullName}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="fatherName"
              placeholder="Father Name"
              value={formData.fatherName}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <textarea
              name="permanentAddress"
              placeholder="Permanent Address"
              value={formData.permanentAddress}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              name="mobileNo"
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="emailId"
              placeholder="Email"
              value={formData.emailId}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="nationality"
              placeholder="Nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="religion"
              placeholder="Religion"
              value={formData.religion}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Marital Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="panCardNo"
              placeholder="PAN Number"
              value={formData.panCardNo}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="aadharCardNo"
              placeholder="Aadhar Number"
              value={formData.aadharCardNo}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Blood Group</option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>

            </select>

            <input
              name="healthProblem"
              placeholder="Health Problem"
              value={formData.healthProblem}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="highestQualification"
              placeholder="Highest Qualification"
              value={formData.highestQualification}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <textarea
              name="softwareKnowledge"
              placeholder="React, Node, MongoDB"
              value={formData.softwareKnowledge}
              onChange={handleChange}
              className="border p-3 rounded md:col-span-3"
            />

          </div>
        </div>

        {/* Family */}

        <div>

          <h2 className="font-bold text-xl mb-4">
            Family Details
          </h2>

          {formData.familyDetails.map((item, index) => (

            <div
              key={index}
              className="grid md:grid-cols-4 gap-3 mb-3"
            >

              <input
                placeholder="Name"
                value={item.name}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    "name",
                    e.target.value,
                    "familyDetails"
                  )
                }
                className="border p-3 rounded"
              />

              <input
                placeholder="Relationship"
                value={item.relationship}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    "relationship",
                    e.target.value,
                    "familyDetails"
                  )
                }
                className="border p-3 rounded"
              />

              <input
                placeholder="Contact"
                value={item.contactNo}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    "contactNo",
                    e.target.value,
                    "familyDetails"
                  )
                }
                className="border p-3 rounded"
              />

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
                className="border p-3 rounded"
              />

            </div>

          ))}

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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Family Member
          </button>

        </div>

        {/* Previous Employment */}

        <div>

          <h2 className="font-bold text-xl mb-4">
            Previous Employment
          </h2>

          {formData.previousEmployment.map((item, index) => (

            <div
              key={index}
              className="grid md:grid-cols-3 gap-3 mb-5"
            >

              <input placeholder="Company"
                value={item.companyName}
                onChange={(e)=>handleArrayChange(index,"companyName",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <input placeholder="Designation"
                value={item.designation}
                onChange={(e)=>handleArrayChange(index,"designation",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <input placeholder="Place"
                value={item.place}
                onChange={(e)=>handleArrayChange(index,"place",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <input type="date"
                value={item.joinDate}
                onChange={(e)=>handleArrayChange(index,"joinDate",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <input type="date"
                value={item.leftDate}
                onChange={(e)=>handleArrayChange(index,"leftDate",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <input placeholder="Annual Salary"
                value={item.annualSalary}
                onChange={(e)=>handleArrayChange(index,"annualSalary",e.target.value,"previousEmployment")}
                className="border p-3 rounded"/>

              <textarea placeholder="Reason"
                value={item.reasonForLeaving}
                onChange={(e)=>handleArrayChange(index,"reasonForLeaving",e.target.value,"previousEmployment")}
                className="border p-3 rounded md:col-span-3"/>

            </div>

          ))}

        </div>

        {/* Bank */}

        <div>

          <h2 className="font-bold text-xl mb-4">
            Bank Details
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input name="bankName" placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={handleBankChange} className="border p-3 rounded"/>

            <input name="accountName" placeholder="Account Holder" value={formData.bankDetails.accountName} onChange={handleBankChange} className="border p-3 rounded"/>

            <input name="accountNumber" placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={handleBankChange} className="border p-3 rounded"/>

            <input name="ifscCode" placeholder="IFSC" value={formData.bankDetails.ifscCode} onChange={handleBankChange} className="border p-3 rounded"/>

            <input name="branch" placeholder="Branch" value={formData.bankDetails.branch} onChange={handleBankChange} className="border p-3 rounded"/>

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