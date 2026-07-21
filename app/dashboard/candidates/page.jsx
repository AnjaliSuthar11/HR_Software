"use client";

import Link from "next/link";

const candidates = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@gmail.com",
    phone: "9876543210",
    position: "Frontend Developer",
    status: "Selected",
  },
  {
    id: 2,
    name: "Meera Patel",
    email: "meera@gmail.com",
    phone: "9123456780",
    position: "UI Designer",
    status: "HR Round",
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul@gmail.com",
    phone: "9988776655",
    position: "Backend Developer",
    status: "Screening",
  },
];
export default function CandidatesPage() {
  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Candidates
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all recruitment candidates
          </p>

        </div>

        <Link
          href="/dashboard/candidates/add"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + Add Candidate
        </Link>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Position</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Phone</th>

              <th className="text-left p-4">Status</th>

              <th className="text-center p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {candidates.map((candidate) => (

              <tr
                key={candidate.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {candidate.name}
                </td>

                <td className="p-4">
                  {candidate.position}
                </td>

                <td className="p-4">
                  {candidate.email}
                </td>

                <td className="p-4">
                  {candidate.phone}
                </td>

                <td className="p-4">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {candidate.status}
                  </span>

                </td>

                <td className="p-4 text-center">

                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    View
                  </button>

                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </button>

                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}