import { colorClasses } from "@/components/energy/tableDevide/types";

export default function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`${colorClasses[color].bg} p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-2xl font-bold ${colorClasses[color].text}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>{icon}</div>
      </div>
    </div>
  );
}