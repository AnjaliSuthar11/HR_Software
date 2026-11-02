"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveManagement() {

  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      const res = await axios.get("/api/leave");

      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const updateLeave = async (id, status) => {

    let remarks = "";

    if (status === "Rejected") {
      remarks = prompt("Enter rejection reason:");

      if (!remarks) {
        alert("HR remarks are required");
        return;
      }
    }

    try {

      await axios.patch(`/api/leave/${id}`, {
        status,
        hrRemarks: remarks,
      });

      alert(`Leave ${status}`);

      loadLeaves();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Leave Management
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">
                Employee
              </th>

              <th className="p-4 text-left">
                Leave
              </th>

              <th className="p-4 text-left">
                Dates
              </th>

              <th className="p-4 text-left">
                Days
              </th>

              <th className="p-4 text-left">
                Reason
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {leaves.map((leave) => (

              <tr
                key={leave._id}
                className="border-t"
              >

                <td className="p-4">
                  {leave.employeeId?.employeeFullName ||
                    leave.employeeId}
                </td>

                <td className="p-4">
                  {leave.leaveType}
                </td>

                <td className="p-4">
                  {new Date(
                    leave.fromDate
                  ).toLocaleDateString()}
                  {" - "}
                  {new Date(
                    leave.toDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {leave.numberOfDays}
                </td>

                <td className="p-4">
                  {leave.reason}
                </td>

                <td className="p-4">
                  {leave.status}
                </td>

                <td className="p-4">

                  {leave.status === "Pending" && (
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          updateLeave(
                            leave._id,
                            "Approved"
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateLeave(
                            leave._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}