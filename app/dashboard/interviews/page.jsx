"use client";

const interviews = [
  {
    id: 1,
    candidate: "Aarav Sharma",
    position: "Frontend Developer",
    date: "22 Jul 2026",
    time: "10:00 AM",
    round: "HR Round",
    status: "Scheduled",
  },
  {
    id: 2,
    candidate: "Meera Patel",
    position: "UI Designer",
    date: "23 Jul 2026",
    time: "2:30 PM",
    round: "Technical",
    status: "Pending",
  },
];

export default function InterviewsPage() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Interviews
        </h1>

        <p className="text-gray-500">
          Manage scheduled interviews
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Candidate</th>

              <th className="text-left p-4">Position</th>

              <th className="text-left p-4">Date</th>

              <th className="text-left p-4">Time</th>

              <th className="text-left p-4">Round</th>

              <th className="text-left p-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {interviews.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">{item.candidate}</td>

                <td className="p-4">{item.position}</td>

                <td className="p-4">{item.date}</td>

                <td className="p-4">{item.time}</td>

                <td className="p-4">{item.round}</td>

                <td className="p-4">

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}