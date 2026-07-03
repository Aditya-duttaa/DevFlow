export default function DashboardCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className={`rounded-xl shadow p-6 text-white ${color}`}
    >
      <p className="text-sm opacity-90">{title}</p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}