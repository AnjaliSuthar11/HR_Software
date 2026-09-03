// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { Phone, MessageCircle, Mail, Eye, UserPlus, LinkIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
//  import { useSearch } from "@/context/SearchContext";

// export default function CandidatesPage() {
//   const [candidates, setCandidates] = useState([]);


// const { search } = useSearch();
  
//  const filteredCandidates = candidates.filter((candidate) =>
//   candidate.fullName
//     ?.toLowerCase()
//     .includes(search.toLowerCase())
// );

// const router = useRouter()
//   useEffect(() => {
//     loadCandidates();
//   }, []);

//   const loadCandidates = async () => {
//     try {
//       const { data } = await axios.get("/api/candidates");

//       if (data.success) {
//         setCandidates(data.candidates);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Candidates</h1>
// <div className="flex gap-2">

//         {/* <Link
//           href="/dashboard/candidates/add"
//           className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
//         >
//           <UserPlus size={20} />
//           Add Candidate
//         </Link> */}
//       <Link
//   href="/dashboard/candidates/share-link"
//   className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
// >
//   <LinkIcon size={20} />
//   Share the Link
// </Link>

//     </div>
//       </div>

//       <div className="space-y-5">
//   {filteredCandidates.map((candidate) => (
//    <div
//   key={candidate._id}
//   onClick={() => router.push(`/dashboard/candidates/${candidate._id}`)}
//   className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer"
// >
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

//         {/* LEFT */}
//         <div className="flex gap-4">

//           <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shrink-0">
//             {candidate.fullName?.charAt(0)}
//           </div>

//           <div>

//             <h2 className="text-xl font-semibold text-gray-900">
//               {candidate.fullName}
//             </h2>

//             <p className="text-gray-500 text-sm mt-1">
//               {candidate.previousDesignation || "Candidate"}
//             </p>

//             <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-600">

//               <div className="flex items-center gap-2">
//                 <Phone size={15} />
//                 {candidate.mobile}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Mail size={15} />
//                 {candidate.email}
//               </div>

//             </div>

//           </div>

//         </div>

//         {/* RIGHT */}

//         <div className="flex flex-col items-end gap-5">

//           {/* Status */}

//           <span
//             className={`px-4 py-1.5 rounded-full text-sm font-medium
//             ${
//               candidate.finalStatus === "Selected"
//                 ? "bg-green-100 text-green-700"
//                 : candidate.finalStatus === "Rejected"
//                 ? "bg-red-100 text-red-700"
//                 : candidate.finalStatus === "On Hold"
//                 ? "bg-yellow-100 text-yellow-700"
//                 : candidate.finalStatus === "Joined"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {candidate.finalStatus !== "New"
//               ? candidate.finalStatus
//               : "In Progress"}
//           </span>

//           {/* Action Button */}

//           {!candidate.round1?.communication && (
//             <Link
//               href={`/dashboard/candidates/${candidate._id}`}
//               className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Start Round 1
//             </Link>
//           )}

//           {candidate.round1?.communication &&
//             !candidate.round2?.communication && (
//               <Link
//                 href={`/dashboard/candidates/${candidate._id}`}
//                 className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
//               >
//                 Start Round 2
//               </Link>
//             )}

//           {candidate.round2?.communication &&
//             (candidate.finalStatus === "New" ||
//               !candidate.finalStatus) && (
//               <Link
//                 href={`/dashboard/candidates/${candidate._id}`}
//                 className="bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600"
//               >
//                 Final Decision
//               </Link>
//             )}

//         </div>

//       </div>

//       {/* Timeline */}

//       <div className="mt-8">

//         <div className="flex items-center">

//           {/* Round 1 */}

//           <div className="flex flex-col items-center w-28">

//             <div
//               className={`w-5 h-5 rounded-full border-4
//               ${
//                 candidate.round1?.communication
//                   ? "bg-green-500 border-green-500"
//                   : "bg-white border-gray-300"
//               }`}
//             />

//             <span className="mt-2 text-sm font-medium">
//               Round 1
//             </span>

//             <span className="text-xs text-gray-500">
//               {candidate.round1?.communication
//                 ? "Completed"
//                 : "Pending"}
//             </span>

//           </div>

//           <div
//             className={`flex-1 h-[2px]
//             ${
//               candidate.round1?.communication
//                 ? "bg-green-400"
//                 : "bg-gray-300"
//             }`}
//           />

//           {/* Round 2 */}

//           <div className="flex flex-col items-center w-28">

//             <div
//               className={`w-5 h-5 rounded-full border-4
//               ${
//                 candidate.round2?.communication
//                   ? "bg-green-500 border-green-500"
//                   : "bg-white border-gray-300"
//               }`}
//             />

//             <span className="mt-2 text-sm font-medium">
//               Round 2
//             </span>

//             <span className="text-xs text-gray-500">
//               {candidate.round2?.communication
//                 ? "Completed"
//                 : "Pending"}
//             </span>

//           </div>

//           <div
//             className={`flex-1 h-[2px]
//             ${
//               candidate.finalStatus &&
//               candidate.finalStatus !== "New"
//                 ? "bg-green-400"
//                 : "bg-gray-300"
//             }`}
//           />

//           {/* Final */}

//           <div className="flex flex-col items-center w-36">

//             <div
//               className={`w-5 h-5 rounded-full border-4
//               ${
//                 candidate.finalStatus &&
//                 candidate.finalStatus !== "New"
//                   ? "bg-green-500 border-green-500"
//                   : "bg-white border-gray-300"
//               }`}
//             />

//             <span className="mt-2 text-sm font-medium">
//               Final Decision
//             </span>

//             <span className="text-xs text-gray-500">
//               {candidate.finalStatus &&
//               candidate.finalStatus !== "New"
//                 ? candidate.finalStatus
//                 : "Pending"}
//             </span>

//           </div>

//         </div>

//       </div>

//       {/* Bottom */}

//       <div className="mt-8 flex justify-end gap-3">
//         {/* <a
//           href={`tel:${candidate.mobile}`}
//           className="w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Phone size={18} />
//         </a>

//         <a
//           href={`https://wa.me/91${candidate.mobile}`}
//           target="_blank"
//           className="w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
//         >
//           <MessageCircle size={18} className="text-green-600" />
//         </a>

//         <a
//           href={`mailto:${candidate.email}`}
//           className="w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Mail size={18} className="text-blue-600" />
//         </a>

//         <Link
//           href={`/dashboard/candidates/${candidate._id}`}
//           className="w-11 h-11 rounded-xl bg-gray-900 hover:bg-black text-white flex items-center justify-center"
//         >
//           <Eye size={18} />
//         </Link> */}
//  <span className="ml-auto text-sm text-gray-500">
//     {new Date(candidate.createdAt).toLocaleString("en-IN")}
//   </span> 
//       </div>

//     </div>
//   ))}
// </div>
//     </div>
//   );
// }




// 3rd candidate with filter
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  Eye,
  UserPlus,
  LinkIcon,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { search } = useSearch();
  const router = useRouter();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const { data } = await axios.get("/api/candidates");

      if (data.success) {
        setCandidates(data.candidates);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // FILTER OPTIONS
  // =========================

  const departments = [
    ...new Set(
      candidates
        .map((candidate) => candidate.department)
        .filter(Boolean)
    ),
  ];

  const positions = [
    ...new Set(
      candidates
        .map((candidate) => candidate.appliedPosition)
        .filter(Boolean)
    ),
  ];

  const statuses = [
    ...new Set(
      candidates
        .map((candidate) => candidate.finalStatus || "New")
        .filter(Boolean)
    ),
  ];

  // =========================
  // FILTER CANDIDATES
  // =========================

  const filteredCandidates = candidates.filter((candidate) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      candidate.fullName?.toLowerCase().includes(searchText) ||
      candidate.email?.toLowerCase().includes(searchText) ||
      candidate.mobile?.toLowerCase().includes(searchText);

    const matchesDepartment =
      departmentFilter === "All" ||
      candidate.department === departmentFilter;

    const matchesPosition =
      positionFilter === "All" ||
      candidate.appliedPosition === positionFilter;

    const candidateStatus = candidate.finalStatus || "New";

    const matchesStatus =
      statusFilter === "All" ||
      candidateStatus === statusFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesPosition &&
      matchesStatus
    );
  });

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setDepartmentFilter("All");
    setPositionFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="p-8">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Candidates
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track all candidates
          </p>
        </div>

        <div className="flex gap-2">

          <Link
            href="/dashboard/candidates/share-link"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <LinkIcon size={19} />
            Share the Link
          </Link>

        </div>

      </div>
{/* <div className=" flex gap-2 py-2">
    <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm ">
      view candidate
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm ">
      view candidate
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm ">
      view candidate
    </div>
</div> */}
      {/* ================= FILTERS ================= */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="font-semibold text-gray-800">
              Filter Candidates
            </h2>

            <p className="text-sm text-gray-400">
              Narrow candidates by department, position or status
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <RotateCcw size={15} />
            Clear Filters
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {/* Department */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Department
            </label>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

          {/* Position */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Applied Position
            </label>

            <select
              value={positionFilter}
              onChange={(e) =>
                setPositionFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Positions
              </option>

              {positions.map((position) => (
                <option
                  key={position}
                  value={position}
                >
                  {position}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status === "New"
                    ? "In Progress"
                    : status}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* ================= RESULT COUNT ================= */}

      <div className="mb-5 flex justify-between items-center">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredCandidates.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {candidates.length}
          </span>{" "}
          candidates
        </p>

      </div>

      {/* ================= CANDIDATES ================= */}

      <div className="space-y-5">

        {filteredCandidates.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-gray-400 text-4xl mb-3">
              🔍
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              No candidates found
            </h2>

            <p className="text-gray-400 mt-1">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          filteredCandidates.map((candidate) => (

            <div
              key={candidate._id}
              onClick={() =>
                router.push(
                  `/dashboard/candidates/${candidate._id}`
                )
              }
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shrink-0">
                    {candidate.fullName?.charAt(0)}
                  </div>

                  <div>

                    <h2 className="text-xl font-semibold text-gray-900">
                      {candidate.fullName}
                    </h2>

                    <p className="text-blue-600 font-medium text-sm mt-1">
                      {candidate.appliedPosition ||
                        candidate.previousDesignation ||
                        "Candidate"}
                    </p>

                    {candidate.department && (
                      <p className="text-gray-500 text-sm mt-1">
                        Department: {candidate.department}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-600">

                      <div className="flex items-center gap-2">
                        <Phone size={15} />
                        {candidate.mobile}
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail size={15} />
                        {candidate.email}
                      </div>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-end gap-5">

                  {/* Status */}

                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium
                    ${
                      candidate.finalStatus === "Selected"
                        ? "bg-green-100 text-green-700"
                        : candidate.finalStatus === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : candidate.finalStatus === "On Hold"
                        ? "bg-yellow-100 text-yellow-700"
                        : candidate.finalStatus === "Joined"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {candidate.finalStatus !== "New"
                      ? candidate.finalStatus
                      : "In Progress"}
                  </span>

                  {/* Action Button */}

                  {!candidate.round1?.communication && (
                    <Link
                      href={`/dashboard/candidates/${candidate._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Start Round 1
                    </Link>
                  )}

                  {candidate.round1?.communication &&
                    !candidate.round2?.communication && (
                      <Link
                        href={`/dashboard/candidates/${candidate._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Start Round 2
                      </Link>
                    )}

                  {candidate.round2?.communication &&
                    (candidate.finalStatus === "New" ||
                      !candidate.finalStatus) && (
                      <Link
                        href={`/dashboard/candidates/${candidate._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600"
                      >
                        Final Decision
                      </Link>
                    )}

                </div>

              </div>

              {/* Timeline */}

              <div className="mt-8">

                <div className="flex items-center">

                  {/* Round 1 */}

                  <div className="flex flex-col items-center w-28">

                    <div
                      className={`w-5 h-5 rounded-full border-4
                      ${
                        candidate.round1?.communication
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                    />

                    <span className="mt-2 text-sm font-medium">
                      Round 1
                    </span>

                    <span className="text-xs text-gray-500">
                      {candidate.round1?.communication
                        ? "Completed"
                        : "Pending"}
                    </span>

                  </div>

                  <div
                    className={`flex-1 h-[2px]
                    ${
                      candidate.round1?.communication
                        ? "bg-green-400"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Round 2 */}

                  <div className="flex flex-col items-center w-28">

                    <div
                      className={`w-5 h-5 rounded-full border-4
                      ${
                        candidate.round2?.communication
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                    />

                    <span className="mt-2 text-sm font-medium">
                      Round 2
                    </span>

                    <span className="text-xs text-gray-500">
                      {candidate.round2?.communication
                        ? "Completed"
                        : "Pending"}
                    </span>

                  </div>

                  <div
                    className={`flex-1 h-[2px]
                    ${
                      candidate.finalStatus &&
                      candidate.finalStatus !== "New"
                        ? "bg-green-400"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Final */}

                  <div className="flex flex-col items-center w-36">

                    <div
                      className={`w-5 h-5 rounded-full border-4
                      ${
                        candidate.finalStatus &&
                        candidate.finalStatus !== "New"
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                    />

                    <span className="mt-2 text-sm font-medium">
                      Final Decision
                    </span>

                    <span className="text-xs text-gray-500">
                      {candidate.finalStatus &&
                      candidate.finalStatus !== "New"
                        ? candidate.finalStatus
                        : "Pending"}
                    </span>

                  </div>

                </div>

              </div>

              {/* Bottom */}

              <div className="mt-8 flex justify-end gap-3">

                <span className="ml-auto text-sm text-gray-500">
                  {new Date(candidate.createdAt).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}