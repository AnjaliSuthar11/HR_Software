export default function RecentCandidates() {
  return (
    <div className="bg-white rounded-2xl  p-6">

      <h2 className="font-bold text-lg mb-5">
        Recent Candidates
      </h2>

      {[
        "Sarah Wilson",
        "John Doe",
        "Rahul Sharma",
        "Emma Brown",
      ].map((item)=>(
        <div
          key={item}
          className="flex justify-between py-3 border-b last:border-none"
        >

          <div>

            <p className="font-medium">
              {item}
            </p>

            <p className="text-sm text-gray-500">
              Frontend Developer
            </p>

          </div>

          <span className="text-sm text-blue-600">
            View
          </span>

        </div>
      ))}

    </div>
  );
}