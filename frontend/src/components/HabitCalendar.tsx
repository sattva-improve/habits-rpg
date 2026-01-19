/**
 * 習慣カレンダーコンポーネント
 * 習慣の達成状況をカレンダー形式で可視化する
 */

import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Flame, Calendar as CalendarIcon, Target } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Habit, HabitRecord } from '@/types';

interface DayStatus {
  date: string;
  completedHabits: string[];
  totalHabits: number;
  records: HabitRecord[];
}

interface HabitCalendarProps {
  selectedHabitId?: string;
  onHabitSelect?: (habitId: string | undefined) => void;
}

// 曜日の表示名
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 月の表示名
const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export function HabitCalendar({ selectedHabitId, onHabitSelect }: HabitCalendarProps) {
  const { habits, habitRecords, userData } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 今日の日付をYYYY-MM-DD形式で取得
  const getTodayDate = useCallback(() => {
    const timezone = userData?.timezone ?? 'Asia/Tokyo';
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('sv-SE', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(now);
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, [userData?.timezone]);

  const today = getTodayDate();

  // 表示する習慣をフィルタ
  const filteredHabits = useMemo(() => {
    if (selectedHabitId) {
      return habits.filter(h => h.habitId === selectedHabitId);
    }
    return habits;
  }, [habits, selectedHabitId]);

  // 月のカレンダーデータを生成
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // カレンダーの開始日（月の最初の日が属する週の日曜日）
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // カレンダーの終了日（月の最後の日が属する週の土曜日）
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // 各日の達成状況を計算
  const dayStatusMap = useMemo(() => {
    const statusMap = new Map<string, DayStatus>();
    
    // 全習慣の記録を集計
    for (const [habitId, records] of habitRecords.entries()) {
      // 選択された習慣でフィルタ
      if (selectedHabitId && habitId !== selectedHabitId) continue;
      
      for (const record of records) {
        if (!record.completed || !record.completedDate) continue;
        
        const dateKey = record.completedDate;
        const existing = statusMap.get(dateKey) || {
          date: dateKey,
          completedHabits: [],
          totalHabits: filteredHabits.length,
          records: [],
        };
        
        if (!existing.completedHabits.includes(habitId)) {
          existing.completedHabits.push(habitId);
        }
        existing.records.push(record);
        statusMap.set(dateKey, existing);
      }
    }
    
    return statusMap;
  }, [habitRecords, selectedHabitId, filteredHabits.length]);

  // 達成状況に応じた色を取得
  const getStatusColor = (date: Date, isCurrentMonth: boolean): string => {
    if (!isCurrentMonth) return 'bg-slate-800/30';
    
    const dateStr = date.toISOString().split('T')[0];
    const status = dayStatusMap.get(dateStr);
    
    if (!status || status.completedHabits.length === 0) {
      // 未来の日付は灰色
      if (dateStr > today) return 'bg-slate-700/50';
      // 過去の日付で未達成
      return 'bg-slate-700/50';
    }
    
    const completionRate = status.completedHabits.length / filteredHabits.length;
    
    if (completionRate >= 1) {
      return 'bg-emerald-500/80 hover:bg-emerald-500'; // 全達成
    } else if (completionRate >= 0.5) {
      return 'bg-amber-500/80 hover:bg-amber-500'; // 半分以上達成
    } else {
      return 'bg-amber-700/60 hover:bg-amber-700'; // 一部達成
    }
  };

  // 連続達成日数を計算
  const currentStreak = useMemo(() => {
    if (filteredHabits.length === 0) return 0;
    
    let streak = 0;
    const checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const status = dayStatusMap.get(dateStr);
      
      // その日に全ての習慣を達成したかチェック
      if (status && status.completedHabits.length === filteredHabits.length) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr === today) {
        // 今日はまだ達成していないが、昨日からのストリークをチェック
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      
      // 無限ループ防止（最大365日）
      if (streak > 365) break;
    }
    
    return streak;
  }, [dayStatusMap, filteredHabits.length, today]);

  // 月間達成率を計算
  const monthlyStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let totalDays = 0;
    let completedDays = 0;
    let totalCompletions = 0;
    
    const current = new Date(firstDay);
    while (current <= lastDay) {
      const dateStr = current.toISOString().split('T')[0];
      
      // 未来の日付はスキップ
      if (dateStr <= today) {
        totalDays++;
        const status = dayStatusMap.get(dateStr);
        
        if (status && status.completedHabits.length === filteredHabits.length && filteredHabits.length > 0) {
          completedDays++;
        }
        
        if (status) {
          totalCompletions += status.completedHabits.length;
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    return { totalDays, completedDays, totalCompletions, rate };
  }, [currentDate, dayStatusMap, filteredHabits.length, today]);

  // 月を移動
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  // 日付をクリック
  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = dayStatusMap.get(dateStr) || {
      date: dateStr,
      completedHabits: [],
      totalHabits: filteredHabits.length,
      records: [],
    };
    setSelectedDay(status);
    setIsDialogOpen(true);
  };

  // 習慣名を取得
  const getHabitName = (habitId: string): string => {
    const habit = habits.find(h => h.habitId === habitId);
    return habit?.name ?? '不明な習慣';
  };

  // 習慣アイコンを取得
  const getHabitIcon = (habitId: string): string => {
    const habit = habits.find(h => h.habitId === habitId);
    return habit?.icon ?? '📝';
  };

  return (
    <section className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-amber-600/50 rounded-lg shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600/30 rounded-lg">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-amber-100">
            習慣カレンダー
          </h2>
        </div>

        {/* 習慣フィルタ */}
        <Select
          value={selectedHabitId ?? 'all'}
          onValueChange={(value) => onHabitSelect?.(value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-slate-700/50 border-amber-600/30 text-amber-100">
            <SelectValue placeholder="すべての習慣" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-amber-600/30">
            <SelectItem value="all" className="text-amber-100 hover:bg-slate-700">
              すべての習慣
            </SelectItem>
            {habits.map(habit => (
              <SelectItem
                key={habit.habitId}
                value={habit.habitId}
                className="text-amber-100 hover:bg-slate-700"
              >
                {habit.icon} {habit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {/* 連続達成日数 */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-amber-600/20">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-amber-200/70">連続達成</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-100">
            {currentStreak}<span className="text-sm ml-1">日</span>
          </p>
        </div>

        {/* 月間達成率 */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-amber-600/20">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-amber-200/70">月間達成率</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-100">
            {monthlyStats.rate}<span className="text-sm ml-1">%</span>
          </p>
        </div>

        {/* 月間完了数 */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-amber-600/20 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-amber-200/70">完全達成日</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-100">
            {monthlyStats.completedDays}<span className="text-sm ml-1">/ {monthlyStats.totalDays}日</span>
          </p>
        </div>
      </div>

      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth(-1)}
          className="text-amber-200 hover:text-amber-100 hover:bg-slate-700/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <h3 className="text-lg font-semibold text-amber-100">
          {currentDate.getFullYear()}年 {MONTHS[currentDate.getMonth()]}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth(1)}
          className="text-amber-200 hover:text-amber-100 hover:bg-slate-700/50"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日ヘッダー */}
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-amber-200/70'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 日付セル */}
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === today;
          const dayOfWeek = date.getDay();
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(date)}
              disabled={!isCurrentMonth}
              className={`
                aspect-square rounded-lg text-sm font-medium
                flex items-center justify-center
                transition-all duration-200
                ${getStatusColor(date, isCurrentMonth)}
                ${isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-800' : ''}
                ${!isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                ${isCurrentMonth && dayOfWeek === 0 ? 'text-red-300' : ''}
                ${isCurrentMonth && dayOfWeek === 6 ? 'text-blue-300' : ''}
                ${isCurrentMonth ? 'text-amber-100 hover:scale-105' : 'text-slate-500'}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-amber-600/20">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/80" />
          <span className="text-xs text-amber-200/70">全達成</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/80" />
          <span className="text-xs text-amber-200/70">半分以上</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-700/60" />
          <span className="text-xs text-amber-200/70">一部達成</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-700/50" />
          <span className="text-xs text-amber-200/70">未達成</span>
        </div>
      </div>

      {/* 日付詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-amber-600/50 text-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              {selectedDay?.date && new Date(selectedDay.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 達成状況サマリ */}
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-sm text-amber-200/70 mb-1">達成状況</p>
              <p className="text-lg font-semibold">
                {selectedDay?.completedHabits.length ?? 0} / {filteredHabits.length} 達成
              </p>
            </div>

            {/* 完了した習慣リスト */}
            {selectedDay && selectedDay.completedHabits.length > 0 && (
              <div>
                <p className="text-sm text-amber-200/70 mb-2">完了した習慣</p>
                <ul className="space-y-2">
                  {selectedDay.completedHabits.map(habitId => {
                    const record = selectedDay.records.find(r => r.habitId === habitId);
                    return (
                      <li
                        key={habitId}
                        className="flex items-center justify-between bg-emerald-900/30 rounded-lg p-2 border border-emerald-600/30"
                      >
                        <div className="flex items-center gap-2">
                          <span>{getHabitIcon(habitId)}</span>
                          <span className="text-sm">{getHabitName(habitId)}</span>
                        </div>
                        {record && (
                          <span className="text-xs text-emerald-400">
                            +{record.expEarned} EXP
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* 未完了の習慣リスト */}
            {selectedDay && (
              <div>
                <p className="text-sm text-amber-200/70 mb-2">未完了の習慣</p>
                {filteredHabits.filter(h => !selectedDay.completedHabits.includes(h.habitId)).length > 0 ? (
                  <ul className="space-y-2">
                    {filteredHabits
                      .filter(h => !selectedDay.completedHabits.includes(h.habitId))
                      .map(habit => (
                        <li
                          key={habit.habitId}
                          className="flex items-center gap-2 bg-slate-700/30 rounded-lg p-2 border border-slate-600/30"
                        >
                          <span>{habit.icon}</span>
                          <span className="text-sm text-slate-400">{habit.name}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-emerald-400">✨ 全ての習慣を達成！</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
