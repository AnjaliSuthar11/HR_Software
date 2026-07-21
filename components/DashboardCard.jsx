import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  color,
  icon: Icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-white" size={22} />
        </div>

      </div>

      <div className="flex items-center mt-5 text-green-600">

        <ArrowUpRight size={18} />

        <span className="text-sm ml-2">
          Updated Today
        </span>

      </div>

    </div>
  );
}