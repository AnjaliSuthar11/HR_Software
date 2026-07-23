"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RatingSelect from "@/components/RatingSelect";
import { toast } from "react-toastify";
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

  useEffect(() => {
    fetchCandidate();
  }, []);

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
      <h1 className="text-3xl font-bold">Candidate Details</h1>

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
                  {candidate.highestQualification}
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
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Candidate Information
          </h2>

          <div className="grid lg:grid-cols-2 gap-5">
            <InfoCard
              icon={<User size={18} />}
              label="Full Name"
              value={candidate.fullName}
            />

            <InfoCard
              icon={<Users size={18} />}
              label="Gender"
              value={candidate.gender}
            />

            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Date of Birth"
              value={
                candidate.dateOfBirth
                  ? new Date(candidate.dateOfBirth).toLocaleDateString()
                  : "-"
              }
            />

            <InfoCard
              icon={<BadgeCheck size={18} />}
              label="Marital Status"
              value={candidate.maritalStatus}
            />

            <InfoCard
              icon={<MapPin size={18} />}
              label="Address"
              value={candidate.address}
            />

            <InfoCard
              icon={<GraduationCap size={18} />}
              label="Qualification"
              value={candidate.highestQualification}
            />

            <InfoCard
              icon={<CircleUserRound size={18} />}
              label="University"
              value={candidate.university}
            />

            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Passing Year"
              value={candidate.passingYear}
            />

            <InfoCard
              icon={<BadgeCheck size={18} />}
              label="Percentage"
              value={candidate.percentage}
            />

            <InfoCard
              icon={<Laptop size={18} />}
              label="Software Skills"
              value={candidate.softwareKnowledge?.join(", ")}
            />

            <InfoCard
              icon={<Building2 size={18} />}
              label="Previous Company"
              value={candidate.previousCompany}
            />

            <InfoCard
              icon={<BriefcaseBusiness size={18} />}
              label="Designation"
              value={candidate.previousDesignation}
            />

            <InfoCard
              icon={<Clock size={18} />}
              label="Can Join On"
              value={
                candidate.preferredJoiningDate
                  ? new Date(candidate.preferredJoiningDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Not Assigned"
              }
            />

            <InfoCard
              icon={<Users size={18} />}
              label="Experience"
              value={candidate.experienceYears + " Years"}
            />

            <InfoCard
              icon={<IndianRupee size={18} />}
              label="Last Salary"
              value={`₹ ${candidate.lastSalary}`}
            />
          </div>
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

      {candidate.round2 && (
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
            <option value="Joined">Joined</option>
          </select>

          <label className="block text-sm font-medium mb-2">Joining Date</label>

          <input
            type="date"
            value={offeredJoiningDate}
            onChange={(e) => setofferedJoiningDate(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

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
    </div>
  );
}
function InfoCard({ icon, label, value }) {
  return (
    <div className="border rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 text-blue-600 mb-3">
        {icon}
        <span className="font-medium text-gray-700">{label}</span>
      </div>

      <p className="text-gray-900 font-semibold break-words">{value || "-"}</p>
    </div>
  );
}
