import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scroll, PlusCircle, Loader2 } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { useUser } from '@/contexts/UserContext';
import { DIFFICULTY_CONFIG } from '@/constants/game';
import type { Habit } from '@/types';

export function QuestsSection() {
  const { habits, isLoading, completeHabit, isHabitCompletedToday } = useUser();
  const [completingHabit, setCompletingHabit] = useState<string | null>(null);

  // 習慣を完了/未完了に切り替え
  const handleToggle = async (habitId: string) => {
    const isCompleted = isHabitCompletedToday(habitId);
    
    if (!isCompleted && !completingHabit) {
      setCompletingHabit(habitId);
      try {
        // 完了として記録（経験値・ステータス更新も含む）
        await completeHabit(habitId);
      } finally {
        setCompletingHabit(null);
      }
    }
    // 注: 一度完了した習慣の取り消しは今回は未実装
  };

  // 難易度からEXP報酬を計算
  const getExpReward = (difficulty: string): number => {
    const config = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG];
    if (!config) return 15;
    return Math.floor(15 * config.expMultiplier);
  };

  // 習慣のステータスを取得
  const getHabitStatus = (habit: Habit): string => {
    if (isHabitCompletedToday(habit.habitId)) {
      return 'たっせい！';
    }
    return 'みたっせい';
  };

  // アイコンを取得
  const getCategoryIcon = (category?: string) => {
    // デフォルトのアイコンマッピング
    const iconMap: Record<string, string> = {
      exercise: '🏃',
      health: '❤️',
      reading: '📚',
      study: '📖',
      learning: '🎓',
      meditation: '🧘',
      sleep: '😴',
      workout: '💪',
      sports: '⚽',
      fitness: '🏋️',
      other: '📝',
    };
    return iconMap[category ?? 'other'] ?? '📝';
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </section>
    );
  }

  // 習慣データを表示用に変換
  const displayHabits = habits.map(habit => ({
    id: habit.habitId,
    name: habit.name,
    category: habit.category ?? 'other',
    categoryIcon: getCategoryIcon(habit.category),
    expReward: getExpReward(habit.difficulty),
    status: getHabitStatus(habit),
    completed: isHabitCompletedToday(habit.habitId),
    isLoading: completingHabit === habit.habitId,
    streak: habit.currentStreak,
    icon: habit.icon,
    color: habit.color,
  }));

  const completedCount = displayHabits.filter(h => h.completed).length;
  const totalExpAvailable = displayHabits
    .filter(h => !h.completed)
    .reduce((sum, h) => sum + h.expReward, 0);

  return (
    <section className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Scroll className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-300">きょうのクエスト</h2>
        </div>
        <Link
          to="/create-quest"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg border-2 border-amber-500 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden md:inline">あたらしいクエスト</span>
        </Link>
      </div>
      
      {displayHabits.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-amber-200/70 mb-4">まだクエストがありません</p>
          <Link
            to="/create-quest"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg border-2 border-amber-500 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            最初のクエストを作成
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={() => handleToggle(habit.id)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-amber-800/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-200">
                たっせい: {completedCount} / {displayHabits.length}
              </span>
              <span className="font-bold text-amber-400">
                のこりけいけんち: {totalExpAvailable}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
