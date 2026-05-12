interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'indigo' | 'green' | 'yellow' | 'red' | 'blue' | 'purple';
  subtitle?: string;
}

const colorClasses = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-600', text: 'text-yellow-600' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
};

export default function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  const c = colorClasses[color];
  return (
    <div className={`${c.bg} rounded-xl p-5 border border-white shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${c.icon} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
