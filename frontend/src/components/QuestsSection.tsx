import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Scroll, PlusCircle, Loader2 } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { useUser } from '@/contexts/UserContext';
import { useSound } from '@/hooks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Habit } from '@/types';

interface HabitDisplayData {
  id: string;
  name: string;
  category: string;
  groupCategory: string;
  categoryIcon: string;
  expReward: number;
  status: string;
  completed: boolean;
  isLoading?: boolean;
  streak: number;
  icon?: string;
  color?: string;
}

export function QuestsSection() {
  const { habits, isLoading, completeHabit, deleteHabit, isHabitCompletedToday } = useUser();
  const { playSound } = useSound();
  const [completingHabit, setCompletingHabit] = useState<string | null>(null);

  // 習慣を完了/未完了に切り替え
  const handleToggle = async (habitId: string) => {
    const isCompleted = isHabitCompletedToday(habitId);
    
    if (!isCompleted && !completingHabit) {
      setCompletingHabit(habitId);
      try {
        // 完了として記録（経験値・ステータス更新も含む）
        const result = await completeHabit(habitId);
        // 完了成功時にサウンドを再生
        if (result) {
          playSound('complete');
        }
      } finally {
        setCompletingHabit(null);
      }
    }
    // 注: 一度完了した習慣の取り消しは今回は未実装
  };

  // 習慣を削除
  const handleDelete = async (habitId: string) => {
    await deleteHabit(habitId);
  };

  // EXP報酬を取得（難易度は固定: normal相当）
  const BASE_EXP = 15;

  // 習慣のステータスを取得
  const getHabitStatus = (habit: Habit): string => {
    if (isHabitCompletedToday(habit.habitId)) {
      return '';
    }
    return '';
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
  const displayHabits: HabitDisplayData[] = useMemo(() => 
    habits.map(habit => ({
      id: habit.habitId,
      name: habit.name,
      category: habit.category ?? 'other',
      groupCategory: habit.groupCategory ?? '未分類',
      categoryIcon: getCategoryIcon(habit.category),
      expReward: BASE_EXP,
      status: getHabitStatus(habit),
      completed: isHabitCompletedToday(habit.habitId),
      isLoading: completingHabit === habit.habitId,
      streak: habit.currentStreak,
      icon: habit.icon,
      color: habit.color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })), [habits, completingHabit]);

  // グループカテゴリ別に習慣をグループ化
  const groupedHabits = useMemo(() => {
    const groups = new Map<string, HabitDisplayData[]>();
    
    for (const habit of displayHabits) {
      const groupName = habit.groupCategory;
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(habit);
    }
    
    // カテゴリ名でソート（「未分類」は常に最後）
    const sortedEntries = [...groups.entries()].sort(([a], [b]) => {
      if (a === '未分類') return 1;
      if (b === '未分類') return -1;
      return a.localeCompare(b, 'ja');
    });
    
    return sortedEntries;
  }, [displayHabits]);

  // 全カテゴリのキーを取得（デフォルトで全展開）
  const allCategoryKeys = useMemo(() => 
    groupedHabits.map(([name]) => name), 
    [groupedHabits]
  );

  const completedCount = displayHabits.filter(h => h.completed).length;
  const totalExpAvailable = displayHabits
    .filter(h => !h.completed)
    .reduce((sum, h) => sum + h.expReward, 0);

  return (
    <section className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Scroll className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-300">きょうの習慣</h2>
        </div>
        <Link
          to="/create-quest"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg border-2 border-amber-500 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden md:inline">あたらしい習慣</span>
        </Link>
      </div>
      
      {displayHabits.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-amber-200/70 mb-4">まだ習慣がありません</p>
          <Link
            to="/create-quest"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg border-2 border-amber-500 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            最初の習慣を作成
          </Link>
        </div>
      ) : (
        <>
          <Accordion 
            type="multiple" 
            defaultValue={allCategoryKeys}
            className="space-y-3"
          >
            {groupedHabits.map(([groupName, groupHabits]) => {
              const groupCompletedCount = groupHabits.filter(h => h.completed).length;
              const groupTotalCount = groupHabits.length;
              const isAllCompleted = groupCompletedCount === groupTotalCount;
              
              return (
                <AccordionItem 
                  key={groupName} 
                  value={groupName}
                  className="border border-amber-800/30 rounded-lg bg-slate-900/30 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">📁</span>
                      <span className={`font-bold ${isAllCompleted ? 'text-green-400' : 'text-amber-200'}`}>
                        {groupName}
                      </span>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        isAllCompleted 
                          ? 'bg-green-900/50 text-green-300' 
                          : 'bg-amber-900/50 text-amber-300'
                      }`}>
                        {groupCompletedCount}/{groupTotalCount}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {groupHabits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onToggle={() => handleToggle(habit.id)}
                          onDelete={() => handleDelete(habit.id)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-amber-800/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-200">
                {completedCount} / {displayHabits.length}
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
