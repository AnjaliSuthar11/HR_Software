// "use client";

// import { useState } from "react";

// export default function AddCandidate() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     address: "",
//     mobile: "",
//     email: "",
//     gender: "",
//     maritalStatus: "",
//     dateOfBirth: "",
//     highestQualification: "",
//     university: "",
//     passingYear: "",
//     percentage: "",
//     previousCompany: "",
//     previousDesignation: "",
//     experience: "",
//     experienceYears: "",
//     lastSalary: "",
//     lastInHandSalary: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("/api/candidates/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Candidate Added Successfully");

//       setFormData({
//         fullName: "",
//         address: "",
//         mobile: "",
//         email: "",
//         gender: "",
//         maritalStatus: "",
//         dateOfBirth: "",

//         highestQualification: "",
//         university: "",
//         passingYear: "",
//         percentage: "",

//         softwareKnowledge: "",

//         previousCompany: "",
//         previousDesignation: "",

//         experience: "",
//         experienceYears: "",

//         lastSalary: "",
//         lastInHandSalary: "",

//         salarySlip: "",
//         currentlyWorking: "",
//         joiningDate: "",
//         reference: "",

//         resume: null,

//         round1: {
//           communication: "",
//           confidence: "",
//           technicalSkill: "",
//           experienceRating: "",
//           presentation: "",
//           salaryExpectation: "",
//           comments: "",
//         },

//         round2: {
//           communication: "",
//           confidence: "",
//           technicalSkill: "",
//           experienceRating: "",
//           presentation: "",
//           salaryExpectation: "",
//           comments: "",
//         },
//       });
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

//   return (
//     <form onSubmit={handleSubmit}>
//     <div className="max-w-6xl mx-auto p-8">

//       <div className="bg-white rounded-xl shadow p-8">

//         <h1 className="text-3xl font-bold mb-8">
//           Add Candidate
//         </h1>

//         {/* Personal Details */}

//         <div className="mb-10">

//           <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//             Personal Details
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6">

//             <div>
//               <label className="block mb-2 font-medium">
//                 Full Name
//               </label>

//               <input
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium">
//                 Mobile Number
//               </label>

//               <input
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium">
//                 Date of Birth
//               </label>

//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium">
//                 Gender
//               </label>

//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select</option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium">
//                 Marital Status
//               </label>

//               <select
//                 name="maritalStatus"
//                 value={formData.maritalStatus}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select</option>
//                 <option>Single</option>
//                 <option>Married</option>
//                 <option>Divorced</option>
//                 <option>Other</option>
//               </select>
//             </div>

//           </div>

//           <div className="mt-6">

//             <label className="block mb-2 font-medium">
//               Address
//             </label>

//             <textarea
//               rows={4}
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-3"
//             />

//           </div>

//         </div>

//         {/* Education */}

//         <div className="mb-10">

//           <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//             Education Details
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6">

//             <div>

//               <label className="block mb-2 font-medium">
//                 Highest Qualification
//               </label>

//               <input
//                 name="highestQualification"
//                 value={formData.highestQualification}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 University
//               </label>

//               <input
//                 name="university"
//                 value={formData.university}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Passing Year
//               </label>

//               <input
//                 name="passingYear"
//                 value={formData.passingYear}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Percentage / CGPA
//               </label>

//               <input
//                 name="percentage"
//                 value={formData.percentage}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//           </div>

//         </div>

//         {/* Employment */}

//         <div>

//           <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//             Employment Details
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6">

//             <div>

//               <label className="block mb-2 font-medium">
//                 Previous Company
//               </label>

//               <input
//                 name="previousCompany"
//                 value={formData.previousCompany}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Previous Designation
//               </label>

//               <input
//                 name="previousDesignation"
//                 value={formData.previousDesignation}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Experience
//               </label>

//               <select
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select</option>
//                 <option>Yes</option>
//                 <option>No</option>
//                 <option>Other</option>
//               </select>

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Experience (Years)
//               </label>

//               <input
//                 name="experienceYears"
//                 value={formData.experienceYears}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Last Salary
//               </label>

//               <input
//                 name="lastSalary"
//                 value={formData.lastSalary}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//             <div>

//               <label className="block mb-2 font-medium">
//                 Last In-Hand Salary
//               </label>

//               <input
//                 name="lastInHandSalary"
//                 value={formData.lastInHandSalary}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//               />

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>

// {/* ================= Software Knowledge ================= */}

// <div className="mt-10">

//     <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//         Software Knowledge
//     </h2>

//     <div>

//         <label className="block mb-2 font-medium">
//             Software Knowledge
//         </label>

//         <textarea
//             rows={5}
//             name="softwareKnowledge"
//             value={formData.softwareKnowledge}
//             onChange={handleChange}
//             placeholder="React, Next.js, Node.js, MongoDB, MS Office..."
//             className="w-full border rounded-lg p-3"
//         />

//     </div>

// </div>

// {/* ================= Salary Slip ================= */}

// <div className="mt-10">

//     <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//         Salary Information
//     </h2>

//     <div className="grid md:grid-cols-2 gap-6">

//         <div>

//             <label className="block font-medium mb-3">
//                 Salary Slip Available
//             </label>

//             <div className="flex gap-5">

//                 {
//                     ["Yes","No","Other"].map((item)=>(
//                         <label
//                         key={item}
//                         className="flex items-center gap-2"
//                         >

//                             <input
//                             type="radio"
//                             name="salarySlip"
//                             value={item}
//                             checked={formData.salarySlip===item}
//                             onChange={handleChange}
//                             />

//                             {item}

//                         </label>
//                     ))
//                 }

//             </div>

//         </div>

//         <div>

//             <label className="block font-medium mb-3">
//                 Currently Working
//             </label>

//             <div className="flex gap-5">

//                 {
//                     ["Yes","No","Other"].map((item)=>(
//                         <label
//                         key={item}
//                         className="flex items-center gap-2"
//                         >

//                             <input
//                             type="radio"
//                             name="currentlyWorking"
//                             value={item}
//                             checked={formData.currentlyWorking===item}
//                             onChange={handleChange}
//                             />

//                             {item}

//                         </label>
//                     ))
//                 }

//             </div>

//         </div>

//         <div>

//             <label className="block mb-2 font-medium">
//                 When Can You Join
//             </label>

//             <input
//             name="joiningDate"
//             value={formData.joiningDate}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-3"
//             placeholder="Immediate / 15 Days / 30 Days"
//             />

//         </div>

//         <div>

//             <label className="block mb-2 font-medium">
//                 Reference
//             </label>

//             <input
//             name="reference"
//             value={formData.reference}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-3"
//             placeholder="Reference Name"
//             />

//         </div>

//     </div>

// </div>

// {/* ================= Resume ================= */}

// <div className="mt-10">

//     <h2 className="text-xl font-semibold border-b pb-2 mb-6">
//         Resume Upload
//     </h2>

//     <input
//     type="file"
//     name="resume"
//     accept=".pdf,.doc,.docx"
//     onChange={(e)=>
//         setFormData({
//             ...formData,
//             resume:e.target.files[0]
//         })
//     }
//     className="border p-3 rounded-lg w-full"
//     />

// </div>

// {/* ================= HR Round 1 ================= */}

// <div className="mt-12 bg-blue-50 rounded-xl p-6">

// <h2 className="text-2xl font-bold mb-6">
// HR Round 1 Evaluation
// </h2>

// <div className="grid md:grid-cols-2 gap-6">

// {
// [
// "communication",
// "confidence",
// "technicalSkill",
// "experienceRating",
// "presentation"
// ].map((field)=>(
// <div key={field}>

// <label className="block mb-2 capitalize font-medium">
// {field}
// </label>

// <select
// name={`round1.${field}`}
// className="w-full border rounded-lg p-3"
// >

// <option value="">Select Rating</option>

// <option value="1">1</option>

// <option value="2">2</option>

// <option value="3">3</option>

// <option value="4">4</option>

// <option value="5">5</option>

// </select>

// </div>
// ))
// }

// <div>

// <label className="block mb-2">
// Salary Expectation
// </label>

// <input
// name="round1Salary"
// className="w-full border rounded-lg p-3"
// />

// </div>

// </div>

// <div className="mt-6">

// <label className="block mb-2">
// Comments
// </label>

// <textarea
// rows={5}
// name="round1Comments"
// className="w-full border rounded-lg p-3"
// />

// </div>

// </div>

// {/* ================= HR Round 2 ================= */}

// <div className="mt-12 bg-green-50 rounded-xl p-6">

// <h2 className="text-2xl font-bold mb-6">
// HR Round 2 Evaluation
// </h2>

// <div className="grid md:grid-cols-2 gap-6">

// {
// [
// "communication",
// "confidence",
// "technicalSkill",
// "experienceRating",
// "presentation"
// ].map((field)=>(
// <div key={field}>

// <label className="block mb-2 capitalize font-medium">
// {field}
// </label>

// <select
// name={`round2.${field}`}
// className="w-full border rounded-lg p-3"
// >

// <option value="">Select Rating</option>

// <option value="1">1</option>

// <option value="2">2</option>

// <option value="3">3</option>

// <option value="4">4</option>

// <option value="5">5</option>

// </select>

// </div>
// ))
// }

// <div>

// <label className="block mb-2">
// Salary Expectation
// </label>

// <input
// name="round2Salary"
// className="w-full border rounded-lg p-3"
// />

// </div>

// </div>

// <div className="mt-6">

// <label className="block mb-2">
// Comments
// </label>

// <textarea
// rows={5}
// name="round2Comments"
// className="w-full border rounded-lg p-3"
// />

// </div>

// </div>

// {/* ================= Submit ================= */}

// <div className="mt-10 flex justify-end">

// <button
// type="submit"
// className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
// >
// Save Candidate
// </button>

// </div>
// </form>
//   );
// }





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
    joiningDate: "",
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

  console.log("HANDLE SUBMIT CALLED");

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

    const { data } = await axios.post("/api/candidates/create", payload);

    console.log(data);

    if (data.success) {
      toast.success(data.message);

      setFormData({
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
        joiningDate: "",
        reference: "",
      });
    }
    router.push("/dashboard/candidates")
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Something went wrong"
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

          {/* Employment */}

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

              <div>
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
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Last Salary
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
                  Last In-Hand Salary
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
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
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
            </div>
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