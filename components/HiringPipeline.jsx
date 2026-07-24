export default function HiringPipeline() {
  return (
    <div className="bg-white rounded-2xl  p-6">

      <h2 className="font-bold text-lg mb-6">
        Hiring Pipeline
      </h2>

      {[
        ["Applied",120],
        ["Round 1",78],
        ["Round 2",43],
        ["Selected",21],
      ].map(([name,count])=>(
        <div key={name} className="mb-5">

          <div className="flex justify-between text-sm mb-2">

            <span>{name}</span>

            <span>{count}</span>

          </div>

          <div className="h-2 rounded-full bg-gray-100">

            <div
              style={{width:`${count/1.2}%`}}
              className="h-full rounded-full bg-blue-600"
            />

          </div>

        </div>
      ))}

    </div>
  );
}