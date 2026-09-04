"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RatingSelect from "@/components/RatingSelect";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Building2,
  BriefcaseBusiness,
  Laptop,
  IndianRupee,
  Users,
  BadgeCheck,
  PhoneCall,
  MessageCircle,
  CircleUserRound,
  Clock,
  Dock,
  LetterText,
  Clock1,
  PersonStanding,
  Workflow,
  WorkflowIcon,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function CandidateDetails({ params }) {
  const [id, setId] = useState(null);
  const router = useRouter();
  const [showRound, setShowRound] = useState(false);
  const [showRound2, setShowRound2] = useState(false);

  const [round1, setRound1] = useState({
    communication: "",
    confidence: "",
    technicalSkill: "",
    experience: "",
    presentation: "",
    remarks: "",
    recommendation: "",
  });

  const [round2, setRound2] = useState({
    communication: "",
    confidence: "",
    technicalSkill: "",
    experience: "",
    presentation: "",
    remarks: "",
    recommendation: "",
  });

  const [offeredJoiningDate, setofferedJoiningDate] = useState("");

  const [finalStatus, setFinalStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function getParams() {
      const data = await params;

      setId(data.id);
    }

    getParams();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const [candidate, setCandidate] = useState(null);

  // useEffect(() => {
  //   fetchCandidate();
  // }, []);

  const handleRound1Change = (e) => {
    const { name, value } = e.target;

    setRound1((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRound2Change = (e) => {
    const { name, value } = e.target;

    setRound2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitRound1 = async () => {
    try {
      await axios.put(`/api/candidates/${id}`, {
        round1,
      });

      toast.success("Round 1 Saved");

      setShowRound(false);

      fetchCandidate();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const submitRound2 = async () => {
    try {
      await axios.put(`/api/candidates/${id}`, {
        round2,
      });

      toast.success("Round 2 Saved");
      setShowRound2(false);

      fetchCandidate();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const fetchCandidate = async () => {
    try {
      const { data } = await axios.get(`/api/candidates/${id}`);

      setCandidate(data.candidate);

      if (data.candidate.finalStatus) {
        setFinalStatus(data.candidate.finalStatus);
      }

      if (data.candidate.notes) {
        setNotes(data.candidate.notes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FINAL STATUS

  const updateStatus = async () => {
    try {
      await axios.put(`/api/candidates/${id}`, {
        finalStatus,
        notes,
        offeredJoiningDate,
      });
      console.log({
        finalStatus,
        notes,
        offeredJoiningDate,
      });
      toast.success("Final Decision Saved");
      // alert("Final Decision Saved");

      fetchCandidate();

      router.push("/dashboard/candidates");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!candidate) {
    return <div className="p-10">Loading Candidate...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex  items-center gap-3">

  
       <Link
              href="/dashboard/candidates"
              className="mt-1 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600"
              />
            </Link>
      <h1 className="text-3xl font-bold">Candidate Details</h1>
    </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
        {/* Header */}

        <div className="border-b bg-gray-50 px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex items-center gap-6">
              <img
                src={
                  candidate.profileImage ||
                  `https://ui-avatars.com/api/?background=1d4ed8&color=fff&size=256&name=${candidate.fullName}`
                }
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
              />

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {candidate.fullName}
                </h1>

                <p className="text-gray-500 mt-1">
                  {candidate.previousDesignation}
                </p>

                <div className="flex items-center gap-5 mt-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    {candidate.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    {candidate.mobile}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 self-start">
              <a
                href={`tel:${candidate.mobile}`}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700"
              >
                <PhoneCall size={18} />
              </a>

              <a
                href={`https://wa.me/91${candidate.mobile}`}
                target="_blank"
                className="flex items-center gap-2 px-5 py-3 bg-[#F1963B] text-white rounded-lg hover:bg-[#C48912]"
              >
                <MessageCircle size={18} />
              </a>

              <a
  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.email}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
>
  <Mail size={18} />
</a>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 p-5">

  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
      Applied Position
    </p>

    <p className="text-lg font-bold text-gray-900 mt-1">
      {candidate.appliedPosition}
    </p>

  </div>


  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">

    <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
      Department
    </p>

    <p className="text-lg font-bold text-gray-900 mt-1">
      {candidate.department}
    </p>

  </div>

</div>

        {/* Body */}

       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

  <div className="flex items-center justify-between mb-8 border-b pb-5">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Candidate Profile
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Complete candidate information and employment details.
      </p>
    </div>

    <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
      {candidate.experience === "Yes" ? "Experienced" : "Fresher"}
    </div>
  </div>

  {/* PERSONAL DETAILS */}

  <section className="mb-10">

    <h3 className="text-lg font-semibold text-gray-800 mb-5">
      Personal Information
    </h3>

    <div className="flex flex-wrap gap-5">

      <InfoCard
        icon={<User size={18}/>}
        label="Full Name"
        value={candidate.fullName}
      />

      <InfoCard
        icon={<Users size={18}/>}
        label="Gender"
        value={candidate.gender}
      />

      <InfoCard
        icon={<CalendarDays size={18}/>}
        label="Date of Birth"
        value={
          candidate.dateOfBirth
            ? new Date(candidate.dateOfBirth).toLocaleDateString()
            : "-"
        }
      />

      <InfoCard
        icon={<BadgeCheck size={18}/>}
        label="Marital Status"
        value={candidate.maritalStatus}
      />

      <InfoCard
        icon={<MapPin size={18}/>}
        label="Address"
        value={candidate.address}
      />

    </div>

  </section>


  {/* EDUCATION */}

  <section className="mb-10">

    <h3 className="text-lg font-semibold text-gray-800 mb-5">
      Education
    </h3>

    <div className="flex flex-wrap gap-5">

      <InfoCard
        icon={<GraduationCap size={18}/>}
        label="Qualification"
        value={candidate.highestQualification}
      />

      <InfoCard
        icon={<CircleUserRound size={18}/>}
        label="University"
        value={candidate.university}
      />

      <InfoCard
        icon={<CalendarDays size={18}/>}
        label="Passing Year"
        value={candidate.passingYear}
      />

      <InfoCard
        icon={<BadgeCheck size={18}/>}
        label="Percentage"
        value={candidate.percentage}
      />

      <InfoCard
        icon={<Laptop size={18}/>}
        label="Software Skills"
        value={candidate.softwareKnowledge?.join(", ")}
      />

    </div>

  </section>


  {/* EMPLOYMENT */}

  <section className="mb-10">

    <h3 className="text-lg font-semibold text-gray-800 mb-5">
      Employment Details
    </h3>

    {candidate.experience === "Yes" ? (

      <div className="flex flex-wrap gap-5">

        <InfoCard
          icon={<WorkflowIcon size={18}/>}
          label="Experience"
          value="Experienced"
        />

        <InfoCard
          icon={<Users size={18}/>}
          label="Years"
          value={`${candidate.experienceYears} Years`}
        />

        <InfoCard
          icon={<Building2 size={18}/>}
          label="Company"
          value={candidate.previousCompany}
        />

        <InfoCard
          icon={<BriefcaseBusiness size={18}/>}
          label="Designation"
          value={candidate.previousDesignation}
        />

        <InfoCard
          icon={<IndianRupee size={18}/>}
          label="Last Salary"
          value={`₹ ${candidate.lastSalary}`}
        />

        <InfoCard
          icon={<IndianRupee size={18}/>}
          label="In-Hand Salary"
          value={`₹ ${candidate.lastInHandSalary}`}
        />

        <InfoCard
          icon={<Dock size={18}/>}
          label="Salary Slip"
          value={candidate.salarySlip}
        />

        <InfoCard
          icon={<LetterText size={18}/>}
          label="Experience Letter"
          value={candidate.experienceLetter}
        />

        <InfoCard
          icon={<Workflow size={18}/>}
          label="Currently Working"
          value={candidate.currentlyWorking}
        />

        <InfoCard
          icon={<Clock1 size={18}/>}
          label="Notice Period"
          value={candidate.noticePeriod}
        />

      </div>

    ) : (

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 flex items-center gap-4">

        <BriefcaseBusiness
          className="text-blue-600"
          size={32}
        />

        <div>

          <h4 className="font-semibold text-blue-900">
            Fresher Candidate
          </h4>

          <p className="text-sm text-blue-700 mt-1">
            No previous work experience available.
          </p>

        </div>

      </div>

    )}

  </section>


  {/* OTHER */}

  <section>

    <h3 className="text-lg font-semibold text-gray-800 mb-5">
      Additional Details
    </h3>

    <div className="flex flex-wrap gap-5">

      <InfoCard
        icon={<PersonStanding size={18}/>}
        label="Reference"
        value={candidate.reference}
      />

      <InfoCard
        icon={<ShieldCheck size={18}/>}
        label="Criminal Record"
        value={candidate.criminalRecord}
      />

    </div>

  </section>

</div>
      </div>

      {/* ================= ROUND 1 ================= */}

      {!candidate.round1 && !showRound && (
        <button
          onClick={() => setShowRound(true)}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Round 1 Interview
        </button>
      )}

      {showRound && (
        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-5">Round 1 Interview</h2>

          {[
            "communication",
            "confidence",
            "technicalSkill",
            "experience",
            "presentation",
          ].map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-2 font-medium capitalize">
                {field}
              </label>

              <RatingSelect
                value={round1[field]}
                editable={true}
                onChange={(value) =>
                  setRound1((prev) => ({
                    ...prev,
                    [field]: value,
                  }))
                }
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-2 font-medium">Recommendation</label>

            <select
              name="recommendation"
              value={round1.recommendation}
              onChange={handleRound1Change}
              className="border rounded-lg p-3 w-full"
            >
              <option value="">Select</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Can be Consider">Can be Consider</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Remarks</label>

            <textarea
              name="remarks"
              value={round1.remarks}
              onChange={handleRound1Change}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <button
            onClick={submitRound1}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Round 1
          </button>
        </div>
      )}

      {candidate.round1 && (
        <div className="mt-8 bg-green-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-5">Round 1 Result</h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Communication</p>
              <RatingSelect value={candidate.round1.communication} />
            </div>

            <div>
              <p className="font-medium">Confidence</p>
              <RatingSelect value={candidate.round1.confidence} />
            </div>

            <div>
              <p className="font-medium">Technical Skill</p>
              <RatingSelect value={candidate.round1.technicalSkill} />
            </div>

            <div>
              <p className="font-medium">Experience</p>
              <RatingSelect value={candidate.round1.experience} />
            </div>

            <div>
              <p className="font-medium">Presentation</p>
              <RatingSelect value={candidate.round1.presentation} />
            </div>

            <div className="flex gap-4">
              <p className="font-medium">Recommendation:</p>
              <p className="font-semibold">{candidate.round1.recommendation}</p>
            </div>

            <div className="flex gap-4">
              <p className="font-medium">Remarks:</p>
              <p className="font-semibold">{candidate.round1.remarks}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUND 2 ================= */}

      {candidate.round1 && !candidate.round2 && !showRound2 && (
        <button
          onClick={() => setShowRound2(true)}
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Start Round 2 Interview
        </button>
      )}

      {showRound2 && (
        <div className="mt-8 bg-purple-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-5">Round 2 Interview</h2>

          {[
            "communication",
            "confidence",
            "technicalSkill",
            "experience",
            "presentation",
          ].map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-2 font-medium capitalize">
                {field}
              </label>

              <RatingSelect
                value={round2[field]}
                editable={true}
                onChange={(value) =>
                  setRound2((prev) => ({
                    ...prev,
                    [field]: value,
                  }))
                }
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-2 font-medium">Recommendation</label>

            <select
              name="recommendation"
              value={round2.recommendation}
              onChange={handleRound2Change}
              className="border rounded-lg p-3 w-full"
            >
              <option value="">Select</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Can be Consider">Can be Consider</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Remarks</label>

            <textarea
              name="remarks"
              value={round2.remarks}
              onChange={handleRound2Change}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <button
            onClick={submitRound2}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Round 2
          </button>
        </div>
      )}

      {candidate.round2 && (
        <div className="mt-8 bg-purple-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-5">Round 2 Result</h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Communication</p>
              <RatingSelect value={candidate.round2.communication} />
            </div>

            <div>
              <p className="font-medium">Confidence</p>
              <RatingSelect value={candidate.round2.confidence} />
            </div>

            <div>
              <p className="font-medium">Technical Skill</p>
              <RatingSelect value={candidate.round2.technicalSkill} />
            </div>

            <div>
              <p className="font-medium">Experience</p>
              <RatingSelect value={candidate.round2.experience} />
            </div>

            <div>
              <p className="font-medium">Presentation</p>
              <RatingSelect value={candidate.round2.presentation} />
            </div>

            <div className="flex gap-4">
              <p className="font-medium">Recommendation:</p>
              <p className="font-semibold">{candidate.round2.recommendation}</p>
            </div>

            <div className="flex gap-4">
              <p className="font-medium">Remarks:</p>
              <p className="font-semibold">{candidate.round2.remarks}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= FINAL DECISION ================= */}

      {/* ================= FINAL DECISION ================= */}

      {candidate.round2 &&
        (candidate.finalStatus === "New" ||
          candidate.finalStatus === "On Hold") && (
          <div className="mt-8 bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-5">Final Decision</h2>

            <select
              value={finalStatus}
              onChange={(e) => setFinalStatus(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4"
            >
              <option value="">Select Status</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>

            {finalStatus === "Selected" && (
              <>
                <label className="block text-sm font-medium mb-2">
                  Offered Joining Date
                </label>

                <input
                  type="date"
                  value={offeredJoiningDate}
                  onChange={(e) => setofferedJoiningDate(e.target.value)}
                  className="w-full border rounded-lg p-3 mb-4"
                />
              </>
            )}

            <textarea
              placeholder="HR Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4"
            />

            <button
              onClick={updateStatus}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Save Final Decision
            </button>
          </div>
        )}
      {/* ================= FINAL DECISION RESULT ================= */}
      {candidate.finalStatus &&
        candidate.finalStatus !== "New" &&
        candidate.finalStatus !== "On Hold" && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Final Decision</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Status</p>

                <p className="font-semibold text-lg">{candidate.finalStatus}</p>
              </div>

              {candidate.finalStatus === "Selected" && (
                <div>
                  <p className="text-gray-500 text-sm">Offered Joining Date</p>

                  <p className="font-semibold text-lg">
                    {candidate.offeredJoiningDate
                      ? new Date(
                          candidate.offeredJoiningDate
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </p>
                </div>
              )}
              {candidate.finalStatus === "Selected" &&
 !candidate.convertedToEmployee && (
  <Link
  href={`/dashboard/employees/add?candidateId=${candidate._id}`}
  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
>
  Convert to Employee
</Link>
)}

              <div>
                <p className="text-gray-500 text-sm">HR Notes</p>

                <p className="font-semibold">{candidate.notes || "-"}</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
function InfoCard({ icon, label, value }) {
  return (
    <div className="w-[280px] rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 p-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

        <div className="flex-1">

          <p className="text-xs uppercase tracking-wide text-gray-500">
            {label}
          </p>

          <p className="mt-1 font-semibold text-gray-900 break-words">
            {value || "-"}
          </p>

        </div>

      </div>

    </div>
  );
}
