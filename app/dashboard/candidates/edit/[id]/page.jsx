"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCandidate() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    mobile: "",
    email: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",

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
    joiningDate: "",
    reference: "",

    resume: "",

    finalStatus: "New",

    round1: {
      communication: "",
      confidence: "",
      technicalSkill: "",
      experience: "",
      presentation: "",
      salaryExpectation: "",
      comments: "",
    },

    round2: {
      communication: "",
      confidence: "",
      technicalSkill: "",
      experience: "",
      presentation: "",
      salaryExpectation: "",
      comments: "",
    },
  });

  useEffect(() => {
    getCandidate();
  }, []);

  async function getCandidate() {
    const res = await fetch(`/api/candidates/${id}`);
    const data = await res.json();

    if (data.success) {
      const c = data.candidate;

      setFormData({
        ...c,

        softwareKnowledge: Array.isArray(c.softwareKnowledge)
          ? c.softwareKnowledge.join(", ")
          : "",

        dateOfBirth: c.dateOfBirth
          ? c.dateOfBirth.substring(0, 10)
          : "",

        round1: {
          communication: c.round1?.communication || "",
          confidence: c.round1?.confidence || "",
          technicalSkill: c.round1?.technicalSkill || "",
          experience: c.round1?.experience || "",
          presentation: c.round1?.presentation || "",
          salaryExpectation: c.round1?.salaryExpectation || "",
          comments: c.round1?.comments || "",
        },

        round2: {
          communication: c.round2?.communication || "",
          confidence: c.round2?.confidence || "",
          technicalSkill: c.round2?.technicalSkill || "",
          experience: c.round2?.experience || "",
          presentation: c.round2?.presentation || "",
          salaryExpectation: c.round2?.salaryExpectation || "",
          comments: c.round2?.comments || "",
        },
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleRoundChange(round, field, value) {
    setFormData({
      ...formData,
      [round]: {
        ...formData[round],
        [field]: value,
      },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`/api/candidates/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...formData,
        softwareKnowledge: formData.softwareKnowledge
          .split(",")
          .map((item) => item.trim()),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Candidate Updated");

      router.push("/dashboard/candidates");
    } else {
      alert(data.message);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-8 space-y-8"
    >
      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Candidate
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />

          <Input
            label="Date Of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <Input
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
          />

        </div>

        <div className="mt-6">

          <label className="font-medium">
            Address
          </label>

          <textarea
            rows="4"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />

        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">
          Education
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Highest Qualification"
            name="highestQualification"
            value={formData.highestQualification}
            onChange={handleChange}
          />

          <Input
            label="University"
            name="university"
            value={formData.university}
            onChange={handleChange}
          />

          <Input
            label="Passing Year"
            name="passingYear"
            value={formData.passingYear}
            onChange={handleChange}
          />

          <Input
            label="Percentage"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
          />

        </div>

      </div>
      {/* ================= Employment Details ================= */}

<div className="bg-white rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-6">
        Employment Details
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

        <Input
            label="Previous Company"
            name="previousCompany"
            value={formData.previousCompany}
            onChange={handleChange}
        />

        <Input
            label="Previous Designation"
            name="previousDesignation"
            value={formData.previousDesignation}
            onChange={handleChange}
        />

        <Input
            label="Experience (Years)"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
        />

        <Input
            label="Last Salary"
            name="lastSalary"
            value={formData.lastSalary}
            onChange={handleChange}
        />

        <Input
            label="Last In Hand Salary"
            name="lastInHandSalary"
            value={formData.lastInHandSalary}
            onChange={handleChange}
        />

        <Input
            label="Reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
        />

    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-6">

        <div>

            <label className="font-medium">
                Experience
            </label>

            <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border rounded-lg mt-2 p-3"
            >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
                <option>Other</option>
            </select>

        </div>

        <div>

            <label className="font-medium">
                Salary Slip
            </label>

            <select
                name="salarySlip"
                value={formData.salarySlip}
                onChange={handleChange}
                className="w-full border rounded-lg mt-2 p-3"
            >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
                <option>Other</option>
            </select>

        </div>

        <div>

            <label className="font-medium">
                Currently Working
            </label>

            <select
                name="currentlyWorking"
                value={formData.currentlyWorking}
                onChange={handleChange}
                className="w-full border rounded-lg mt-2 p-3"
            >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
                <option>Other</option>
            </select>

        </div>

    </div>

    <div className="mt-6">

        <Input
            label="Joining Availability"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
        />

    </div>

</div>

{/* ================= Software Knowledge ================= */}

<div className="bg-white rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-6">
        Software Knowledge
    </h2>

    <textarea
        rows={5}
        name="softwareKnowledge"
        value={formData.softwareKnowledge}
        onChange={handleChange}
        className="w-full border rounded-lg p-4"
        placeholder="React, Next.js, MongoDB, Node.js..."
    />

</div>

{/* ================= Resume ================= */}

<div className="bg-white rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-6">
        Resume
    </h2>

    {
        formData.resume &&
        (
            <a
                href={formData.resume}
                target="_blank"
                className="text-blue-600 underline"
            >
                View Current Resume
            </a>
        )
    }

    <input
        type="file"
        className="w-full mt-5 border rounded-lg p-3"
    />

</div>

{/* ================= HR ROUND 1 ================= */}

<div className="bg-blue-50 rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-8">
        HR Round 1
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <RatingSelect
            label="Communication"
            value={formData.round1.communication}
            onChange={(value)=>
                handleRoundChange(
                    "round1",
                    "communication",
                    value
                )
            }
        />

        <RatingSelect
            label="Confidence"
            value={formData.round1.confidence}
            onChange={(value)=>
                handleRoundChange(
                    "round1",
                    "confidence",
                    value
                )
            }
        />

        <RatingSelect
            label="Technical Skill"
            value={formData.round1.technicalSkill}
            onChange={(value)=>
                handleRoundChange(
                    "round1",
                    "technicalSkill",
                    value
                )
            }
        />

        <RatingSelect
            label="Experience"
            value={formData.round1.experience}
            onChange={(value)=>
                handleRoundChange(
                    "round1",
                    "experience",
                    value
                )
            }
        />

        <RatingSelect
            label="Presentation"
            value={formData.round1.presentation}
            onChange={(value)=>
                handleRoundChange(
                    "round1",
                    "presentation",
                    value
                )
            }
        />

        <Input
            label="Salary Expectation"
            value={formData.round1.salaryExpectation}
            onChange={(e)=>
                handleRoundChange(
                    "round1",
                    "salaryExpectation",
                    e.target.value
                )
            }
        />

    </div>

    <div className="mt-6">

        <label className="font-medium">
            Comments
        </label>

        <textarea
            rows={5}
            value={formData.round1.comments}
            onChange={(e)=>
                handleRoundChange(
                    "round1",
                    "comments",
                    e.target.value
                )
            }
            className="w-full border rounded-lg mt-2 p-4"
        />

    </div>

</div>

{/* ================= HR ROUND 2 ================= */}

<div className="bg-green-50 rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-8">
        HR Round 2
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <RatingSelect
            label="Communication"
            value={formData.round2.communication}
            onChange={(value)=>
                handleRoundChange(
                    "round2",
                    "communication",
                    value
                )
            }
        />

        <RatingSelect
            label="Confidence"
            value={formData.round2.confidence}
            onChange={(value)=>
                handleRoundChange(
                    "round2",
                    "confidence",
                    value
                )
            }
        />

        <RatingSelect
            label="Technical Skill"
            value={formData.round2.technicalSkill}
            onChange={(value)=>
                handleRoundChange(
                    "round2",
                    "technicalSkill",
                    value
                )
            }
        />

        <RatingSelect
            label="Experience"
            value={formData.round2.experience}
            onChange={(value)=>
                handleRoundChange(
                    "round2",
                    "experience",
                    value
                )
            }
        />

        <RatingSelect
            label="Presentation"
            value={formData.round2.presentation}
            onChange={(value)=>
                handleRoundChange(
                    "round2",
                    "presentation",
                    value
                )
            }
        />

        <Input
            label="Salary Expectation"
            value={formData.round2.salaryExpectation}
            onChange={(e)=>
                handleRoundChange(
                    "round2",
                    "salaryExpectation",
                    e.target.value
                )
            }
        />

    </div>

    <div className="mt-6">

        <label className="font-medium">
            Comments
        </label>

        <textarea
            rows={5}
            value={formData.round2.comments}
            onChange={(e)=>
                handleRoundChange(
                    "round2",
                    "comments",
                    e.target.value
                )
            }
            className="w-full border rounded-lg mt-2 p-4"
        />

    </div>

</div>

{/* ================= FINAL STATUS ================= */}

<div className="bg-white rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold mb-6">
        Recruitment Status
    </h2>

    <select
        name="finalStatus"
        value={formData.finalStatus}
        onChange={handleChange}
        className="border rounded-lg p-3 w-full"
    >

        <option>New</option>
        <option>Round 1</option>
        <option>Round 2</option>
        <option>Selected</option>
        <option>Rejected</option>
        <option>On Hold</option>
        <option>Joined</option>

    </select>

</div>

<div className="flex justify-end">

    <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold"
    >
        Save Changes
    </button>

</div>

</form>
  )
}