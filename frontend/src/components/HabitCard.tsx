import { Check, Flame, Loader2, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { getExpBreakdown } from '@/services/habit';

interface HabitDisplayData {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  expReward: number;
  status: string;
  completed: boolean;
  isLoading?: boolean;
  streak: number;
  icon?: string;
  color?: string;
}

interface HabitCardProps {
  habit: HabitDisplayData;
  onToggle: () => void;
  onDelete?: () => Promise<void>;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const breakdown = getExpBreakdown(habit.streak);
  const expDisplay = breakdown.streakBonus > 0
    ? `+${breakdown.totalExp} EXP (基本${breakdown.baseExp} + ストリーク${breakdown.streakBonus})`
    : `+${breakdown.totalExp} EXP`;
  
  const statusColors = {
    'みたっせい': 'bg-red-900/40 text-red-300 border-red-700/50',
    'しんこうちゅう': 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    'たっせい！': 'bg-green-900/40 text-green-300 border-green-700/50',
  };

  const statusColor = statusColors[habit.status as keyof typeof statusColors] || 'bg-slate-900/40 text-slate-300 border-slate-700/50';

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    navigate(`${ROUTES.EDIT_QUEST}/${habit.id}`);
  };

  return (
    <div className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${ 
      habit.completed 
        ? 'bg-green-950/30 border-green-700/50' 
        : habit.isLoading
        ? 'bg-amber-950/30 border-amber-600/50'
        : 'bg-slate-900/40 border-amber-800/30 hover:border-amber-600/60 hover:shadow-lg hover:shadow-amber-900/20'
    }`}>
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-slate-900/95 rounded-lg flex items-center justify-center gap-4 z-10">
          <span className="text-amber-200 text-sm">この習慣を削除しますか？</span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded border border-red-500 transition-all flex items-center gap-1"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                削除
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-200 text-sm font-bold rounded border border-slate-600 transition-all"
          >
            やめる
          </button>
        </div>
      )}

      {/* Left: Checkbox */}
      <button
        onClick={onToggle}
        disabled={habit.completed || habit.isLoading}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${ 
          habit.completed
            ? 'bg-green-600 border-green-500 cursor-default'
            : habit.isLoading
            ? 'bg-amber-600 border-amber-500 cursor-wait'
            : 'border-amber-700/50 hover:border-amber-500 hover:bg-amber-950/30 cursor-pointer'
        }`}
      >
        {habit.isLoading ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : habit.completed ? (
          <Check className="w-4 h-4 text-white" />
        ) : null}
      </button>

      {/* Icon */}
      <div 
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: habit.color ? `${habit.color}20` : '#f59e0b20' }}
      >
        {habit.icon ?? habit.categoryIcon}
      </div>

      {/* Middle: Habit Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-semibold ${habit.completed ? 'line-through text-amber-200/50' : 'text-amber-100'}`}>
            {habit.name}
          </h3>
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold">{habit.streak}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300/70">{habit.category}</span>
          <span className="text-xs font-bold text-yellow-400">
            {expDisplay}
          </span>
          {habit.isLoading && (
            <span className="text-xs text-amber-400 animate-pulse">処理中...</span>
          )}
        </div>
      </div>

      {/* Right: Status Badge */}
      <div className={`flex-shrink-0 px-3 py-1 rounded border text-xs font-medium ${statusColor}`}>
        {habit.completed ? 'たっせい！' : habit.isLoading ? 'しょりちゅう...' : habit.status}
      </div>

      {/* Edit Button */}
      {!habit.completed && !habit.isLoading && (
        <button
          onClick={handleEdit}
          className="flex-shrink-0 p-2 text-amber-400/60 hover:text-amber-400 hover:bg-amber-950/30 rounded transition-all"
          title="習慣を編集"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* Delete Button */}
      {onDelete && !habit.completed && !habit.isLoading && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex-shrink-0 p-2 text-red-400/60 hover:text-red-400 hover:bg-red-950/30 rounded transition-all"
          title="習慣を削除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
