export default function DashboardCard({
  title,
  value,
  subTitle,
  icon: Icon,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-green-600 text-sm mt-3">
            {subTitle}
          </p>

        </div>

        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">

          <Icon
            size={26}
            className="text-blue-700"
          />

        </div>

      </div>

    </div>
  );
}