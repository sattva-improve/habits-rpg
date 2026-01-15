import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  level: number;
  color: string;
  bgColor: string;
}

export function StatusCard({ icon: Icon, label, level, color, bgColor }: StatusCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className={`${bgColor} rounded-lg p-3 mb-3 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">Lv {level}</p>
    </div>
  );
}
