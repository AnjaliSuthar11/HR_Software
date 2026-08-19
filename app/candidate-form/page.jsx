
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function CandidateForm() {
    const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    mobile: "",
    email: "",
    address: "",

    highestQualification: "",
    university: "",
    passingYear: "",
    percentage: "",

    softwareKnowledge: "",

    previousCompany: "",
    previousDesignation: "",
    experience: "",
    experienceYears: "",
    lastSalary: "",
    lastInHandSalary: "",
    salarySlip: "",
    currentlyWorking: "",
    noticePeriod:"",
    experienceLetter:"",
    preferredJoiningDate: "",
    criminalRecord:"",
    reference: "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,

      softwareKnowledge: formData.softwareKnowledge
        ? formData.softwareKnowledge
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
    };

    // Fresher → remove experience-specific fields
    if (formData.experience === "No") {
      delete payload.previousCompany;
      delete payload.previousDesignation;
      delete payload.experienceYears;
      delete payload.lastSalary;
      delete payload.lastInHandSalary;
      delete payload.salarySlip;
      delete payload.currentlyWorking;
      delete payload.experienceLetter;
      delete payload.noticePeriod;
    }

    const { data } = await axios.post(
      "/api/candidates/create",
      payload
    );

    if (data.success) {
      toast.success(data.message);

      router.push("/dashboard/candidates");
    }

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8">
          Candidate Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Personal Details */}

          <div>
            <h3 className="text-xl font-semibold border-b pb-3 mb-6">
              Personal Details
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block mb-2 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Marital Status
                </label>

                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Mobile *
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block mb-2 font-medium">
                  Address
                </label>

                <textarea
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          {/* Education */}

          <div>
            <h3 className="text-xl font-semibold border-b pb-3 mb-6">
              Education
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block mb-2 font-medium">
                  Highest Qualification
                </label>

                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  University
                </label>

                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Passing Year
                </label>

                <input
                  type="text"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Percentage / CGPA
                </label>

                <input
                  type="text"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          {/* Software */}

        <div>
  <h3 className="text-xl font-semibold border-b pb-3 mb-6">
    Software Knowledge
  </h3>

  <div>
    <label className="block mb-2 font-medium">
      Software Skills
    </label>

    <textarea
      rows={4}
      name="softwareKnowledge"
      value={formData.softwareKnowledge}
      onChange={handleChange}
      placeholder="Example: MS Office, Excel, Tally, Photoshop, React, Node.js, MongoDB"
      className="w-full border rounded-lg p-3"
    />
  </div>
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

  {/* Experience Radio */}

  <div>
    <h3 className="text-xl font-semibold border-b pb-3 mb-6">
              Do you have Experience
            </h3>

    <div className="flex gap-6">

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="experience"
          value="Yes"
          checked={formData.experience === "Yes"}
          onChange={handleChange}
        />
        {/* Experienced */} Yes
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="experience"
          value="No"
          checked={formData.experience === "No"}
          onChange={handleChange}
        />
        Fresher
      </label>

    </div>
  </div>

</div>

{/* Employment */}
{
formData.experience === "Yes" && (

<div className=" mt-6">

          <div>
            <h3 className="text-xl font-semibold border-b pb-3 mb-6">
              Employment Details
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block mb-2 font-medium">
                  Previous Company
                </label>

                <input
                  type="text"
                  name="previousCompany"
                  value={formData.previousCompany}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Previous Designation
                </label>

                <input
                  type="text"
                  name="previousDesignation"
                  value={formData.previousDesignation}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* <div>
                <label className="block mb-2 font-medium">
                  Experience
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Other</option>
                </select>
              </div> */}

              <div>
                <label className="block mb-2 font-medium">
                  Experience (Years)
                </label>

                <input
                  type="text"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Last Salary (per month)
                </label>

                <input
                  type="text"
                  name="lastSalary"
                  value={formData.lastSalary}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Last In-Hand Salary (per month)
                </label>

                <input
                  type="text"
                  name="lastInHandSalary"
                  value={formData.lastInHandSalary}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Salary Slip Available
                </label>

                <select
                  name="salarySlip"
                  value={formData.salarySlip}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Currently Working
                </label>

                <select
                  name="currentlyWorking"
                  value={formData.currentlyWorking}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                 Do you have experience Letter
                </label>

                <select
                  name="experienceLetter"
                  value={formData.experienceLetter}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                 Are you on notice period
                </label>

                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              
            </div>
          </div>
</div>)}
{/* Joining date */}

              <div>
                <label className="block mb-2 font-medium">
                  When can you join
                </label>

                <input
                  type="date"
                  name="preferredJoiningDate"
                  value={formData.preferredJoiningDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>
              {/* criminal record */}
                  <div>
                <label className="block mb-2 font-medium">
                 Do you have any criminal record?
                </label>

                <select
                  name="criminalRecord"
                  value={formData.criminalRecord}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block mb-2 font-medium">
                  Reference
                </label>

                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Candidate
          </button>
        </form>
      </div>
    </div>
  );
}