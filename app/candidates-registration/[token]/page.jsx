"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export default function CandidateForm() {
  const params = useParams();

  // Token from:
  // /candidate-form/abc123xyz
  const token = params?.token;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jobInfo, setJobInfo] =
  useState({
    department: "",
    appliedPosition: "",
  });

const [loadingJobInfo,setLoadingJobInfo] = useState(true);

useEffect(() => {
  if (!token) {
    return;
  }

  const loadJobInfo =
    async () => {
      try {
        setLoadingJobInfo(true);

        const { data } =
          await axios.get(
            `/api/candidates/registration-link/${token}`
          );

        if (!data.success) {
          toast.error(
            data.message ||
              "Invalid registration link"
          );

          return;
        }

        setJobInfo({
          department:
            data.department ||
            "",

          appliedPosition:
            data.appliedPosition ||
            "",
        });

      } catch (error) {
        console.error(
          error
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load job information"
        );
      } finally {
        setLoadingJobInfo(false);
      }
    };

  loadJobInfo();

}, [token]);
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
    noticePeriod: "",
    experienceLetter: "",

    preferredJoiningDate: "",
    criminalRecord: "",
    reference: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExperienceChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      experience: value,

      // If Fresher, clear all experience fields
      ...(value === "No"
        ? {
            previousCompany: "",
            previousDesignation: "",
            experienceYears: "",
            lastSalary: "",
            lastInHandSalary: "",
            salarySlip: "",
            currentlyWorking: "",
            experienceLetter: "",
            noticePeriod: "",
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid registration link.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,

        // Send unique registration token
        registrationToken: token,
        appliedPosition: jobInfo.appliedPosition,
         department:jobInfo.department,

        softwareKnowledge: formData.softwareKnowledge
          ? formData.softwareKnowledge
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      };

      // ------------------------------------
      // FRESHER
      // ------------------------------------

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

      // ------------------------------------
      // CREATE CANDIDATE
      // ------------------------------------

      const { data } = await axios.post(
        "/api/candidates/create",
        payload
      );

      if (data.success) {
        setSubmitted(true);

        toast.success("Registration submitted successfully!");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------
  // AFTER SUCCESSFUL SUBMISSION
  // ------------------------------------

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full p-10 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-6">
            Registration Submitted
          </h1>

          <p className="text-gray-500 mt-4 leading-relaxed">
            Thank you for submitting your details.
            Your information has been successfully
            received by the HR team.
          </p>

          <p className="text-sm text-gray-400 mt-6">
            You can now close this page.
          </p>

        </div>
      </div>
    );
  }

  // ------------------------------------
  // FORM
  // ------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Registration Form
          </h1>

          <p className="text-gray-500 mt-2">
            Please provide your details carefully. This
            information will be reviewed by our HR team.
          </p>

        </div>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">

  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
      Applied Position
    </p>

    <p className="text-lg font-bold text-gray-900 mt-1">
      {loadingJobInfo
        ? "Loading..."
        : jobInfo.appliedPosition ||
          "-"}
    </p>

  </div>


  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">

    <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
      Department
    </p>

    <p className="text-lg font-bold text-gray-900 mt-1">
      {loadingJobInfo
        ? "Loading..."
        : jobInfo.department ||
          "-"}
    </p>

  </div>

</div>

        {/* FORM */}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-12"
          >

            {/* ================================= */}
            {/* PERSONAL DETAILS */}
            {/* ================================= */}

            <div>

              <div className="border-b border-gray-200 pb-4 mb-7">

                <h2 className="text-xl font-bold text-gray-900">
                  Personal Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Basic information about you
                </p>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Full Name */}

                <div>
                  <label className="block mb-2 font-medium">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}

                <div>
                  <label className="block mb-2 font-medium">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* DOB */}

                <div>
                  <label className="block mb-2 font-medium">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />
                </div>

                {/* Marital */}

                <div>
                  <label className="block mb-2 font-medium">
                    Marital Status
                  </label>

                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                  >
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Mobile */}

                <div>
                  <label className="block mb-2 font-medium">
                    Mobile *
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="block mb-2 font-medium">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />
                </div>

                {/* Address */}

                <div className="md:col-span-2 lg:col-span-3">

                  <label className="block mb-2 font-medium">
                    Address
                  </label>

                  <textarea
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 resize-none"
                  />

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* EDUCATION */}
            {/* ================================= */}

            <div>

              <div className="border-b border-gray-200 pb-4 mb-7">

                <h2 className="text-xl font-bold">
                  Education
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your educational background
                </p>

              </div>

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
                    className="w-full border border-gray-300 rounded-xl p-3"
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
                    className="w-full border border-gray-300 rounded-xl p-3"
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
                    className="w-full border border-gray-300 rounded-xl p-3"
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
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />
                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* SOFTWARE */}
            {/* ================================= */}

            <div>

              <div className="border-b border-gray-200 pb-4 mb-7">

                <h2 className="text-xl font-bold">
                  Software Knowledge
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Mention the software and technologies you know
                </p>

              </div>

              <textarea
                rows={4}
                name="softwareKnowledge"
                value={formData.softwareKnowledge}
                onChange={handleChange}
                placeholder="Example: MS Office, Excel, Tally, Photoshop, React, Node.js, MongoDB"
                className="w-full border border-gray-300 rounded-xl p-3 resize-none"
              />

            </div>

            {/* ================================= */}
            {/* EXPERIENCE */}
            {/* ================================= */}

            <div>

              <div className="border-b border-gray-200 pb-4 mb-7">

                <h2 className="text-xl font-bold">
                  Work Experience
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tell us about your professional experience
                </p>

              </div>

              <div className="flex gap-8">

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="experience"
                    value="Yes"
                    checked={formData.experience === "Yes"}
                    onChange={handleExperienceChange}
                    className="w-4 h-4"
                  />

                  <span>
                    Experienced
                  </span>

                </label>

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="experience"
                    value="No"
                    checked={formData.experience === "No"}
                    onChange={handleExperienceChange}
                    className="w-4 h-4"
                  />

                  <span>
                    Fresher
                  </span>

                </label>

              </div>

            </div>

            {/* ================================= */}
            {/* EMPLOYMENT */}
            {/* ================================= */}

            {formData.experience === "Yes" && (

              <div>

                <div className="border-b border-gray-200 pb-4 mb-7">

                  <h2 className="text-xl font-bold">
                    Employment Details
                  </h2>

                </div>

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
                      className="w-full border border-gray-300 rounded-xl p-3"
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
                      className="w-full border border-gray-300 rounded-xl p-3"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Experience (Years)
                    </label>

                    <input
                      type="text"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3"
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
                      className="w-full border border-gray-300 rounded-xl p-3"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Last In-Hand Salary
                    </label>

                    <input
                      type="text"
                      name="lastInHandSalary"
                      value={formData.lastInHandSalary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3"
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
                      className="w-full border border-gray-300 rounded-xl p-3 bg-white"
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
                      className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Experience Letter
                    </label>

                    <select
                      name="experienceLetter"
                      value={formData.experienceLetter}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Notice Period
                    </label>

                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                </div>

              </div>

            )}

            {/* ================================= */}
            {/* OTHER INFORMATION */}
            {/* ================================= */}

            <div>

              <div className="border-b border-gray-200 pb-4 mb-7">

                <h2 className="text-xl font-bold">
                  Additional Information
                </h2>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 font-medium">
                    When can you join
                  </label>

                  <input
                    type="date"
                    name="preferredJoiningDate"
                    value={formData.preferredJoiningDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Do you have any criminal record?
                  </label>

                  <select
                    name="criminalRecord"
                    value={formData.criminalRecord}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                </div>

                <div className="md:col-span-2">

                  <label className="block mb-2 font-medium">
                    Reference
                  </label>

                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3"
                  />

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* SUBMIT */}
            {/* ================================= */}

            <div className="pt-6 border-t border-gray-200">

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-10 py-3.5 rounded-xl transition"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Registration"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}