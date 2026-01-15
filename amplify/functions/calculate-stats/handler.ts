import type { Handler } from 'aws-lambda';

/**
 * 統計計算用の入力型
 */
interface CalculateStatsInput {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date?: string; // YYYY-MM-DD format
  weekStart?: string; // YYYY-MM-DD format (weekly用)
  year?: number; // monthly用
  month?: number; // monthly用
  // 習慣と記録のデータ（DBから取得済みを想定）
  habits: Array<{
    habitId: string;
    name: string;
    frequencyType: string;
    specificDays?: number[];
    isActive: boolean;
  }>;
  records: Array<{
    habitId: string;
    completedDate: string;
    completed: boolean;
    expEarned: number;
  }>;
}

interface DailyStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  totalExpEarned: number;
  habitCompletions: Array<{
    habitId: string;
    habitName: string;
    completed: boolean;
    expEarned: number;
  }>;
}

interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  totalExpEarned: number;
  dailyStats: DailyStats[];
}

interface MonthlyStats {
  year: number;
  month: number;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  totalExpEarned: number;
  weeklyStats: WeeklyStats[];
}

type CalculateStatsOutput = DailyStats | WeeklyStats | MonthlyStats;

/**
 * 特定日に習慣が予定されているかを判定
 */
function isHabitDueOnDate(habit: CalculateStatsInput['habits'][0], date: Date): boolean {
  if (!habit.isActive) return false;

  switch (habit.frequencyType) {
    case 'daily':
      return true;
    case 'specific_days':
      return habit.specificDays?.includes(date.getDay()) ?? false;
    case 'weekly':
      // 週1回の場合は任意の1日でOK
      return true;
    default:
      return true;
  }
}

/**
 * 日付文字列をDate型に変換
 */
function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00Z');
}

/**
 * 日付をYYYY-MM-DD形式に変換
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 週の開始日を計算（月曜始まり）
 */
function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

/**
 * 週の終了日を計算
 */
function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return end;
}

/**
 * 日次統計を計算
 */
function calculateDailyStats(habits: CalculateStatsInput['habits'], records: CalculateStatsInput['records'], date: string): DailyStats {
  const dateObj = parseDate(date);
  const dueHabits = habits.filter((h) => isHabitDueOnDate(h, dateObj));

  const dateRecords = records.filter((r) => r.completedDate === date);
  const completedRecords = dateRecords.filter((r) => r.completed);

  const habitCompletions = dueHabits.map((habit) => {
    const record = dateRecords.find((r) => r.habitId === habit.habitId);
    return {
      habitId: habit.habitId,
      habitName: habit.name,
      completed: record?.completed ?? false,
      expEarned: record?.expEarned ?? 0,
    };
  });

  const totalExpEarned = completedRecords.reduce((sum, r) => sum + r.expEarned, 0);

  return {
    date,
    totalHabits: dueHabits.length,
    completedHabits: completedRecords.length,
    completionRate: dueHabits.length > 0 ? completedRecords.length / dueHabits.length : 0,
    totalExpEarned,
    habitCompletions,
  };
}

/**
 * 週次統計を計算
 */
function calculateWeeklyStats(habits: CalculateStatsInput['habits'], records: CalculateStatsInput['records'], weekStart: string): WeeklyStats {
  const startDate = parseDate(weekStart);
  const endDate = getWeekEnd(new Date(startDate));

  const dailyStats: DailyStats[] = [];
  let totalHabits = 0;
  let completedHabits = 0;
  let totalExpEarned = 0;

  // 7日分の統計を計算
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);

    const daily = calculateDailyStats(habits, records, dateStr);
    dailyStats.push(daily);

    totalHabits += daily.totalHabits;
    completedHabits += daily.completedHabits;
    totalExpEarned += daily.totalExpEarned;
  }

  return {
    weekStart,
    weekEnd: formatDate(endDate),
    totalHabits,
    completedHabits,
    completionRate: totalHabits > 0 ? completedHabits / totalHabits : 0,
    totalExpEarned,
    dailyStats,
  };
}

/**
 * 月次統計を計算
 */
function calculateMonthlyStats(habits: CalculateStatsInput['habits'], records: CalculateStatsInput['records'], year: number, month: number): MonthlyStats {
  // 月初から月末までの日付を取得
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const weeklyStats: WeeklyStats[] = [];
  let totalHabits = 0;
  let completedHabits = 0;
  let totalExpEarned = 0;

  // 週ごとに計算
  let currentWeekStart = getWeekStart(new Date(firstDay));

  while (currentWeekStart <= lastDay) {
    const weekStartStr = formatDate(currentWeekStart);
    const weekly = calculateWeeklyStats(habits, records, weekStartStr);
    weeklyStats.push(weekly);

    totalHabits += weekly.totalHabits;
    completedHabits += weekly.completedHabits;
    totalExpEarned += weekly.totalExpEarned;

    // 次の週へ
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  return {
    year,
    month,
    totalHabits,
    completedHabits,
    completionRate: totalHabits > 0 ? completedHabits / totalHabits : 0,
    totalExpEarned,
    weeklyStats,
  };
}

/**
 * Lambda Handler
 */
export const handler: Handler<CalculateStatsInput, CalculateStatsOutput> = async (event) => {
  const { period, habits, records } = event;

  switch (period) {
    case 'daily':
      if (!event.date) {
        throw new Error('date is required for daily stats');
      }
      return calculateDailyStats(habits, records, event.date);

    case 'weekly':
      if (!event.weekStart) {
        throw new Error('weekStart is required for weekly stats');
      }
      return calculateWeeklyStats(habits, records, event.weekStart);

    case 'monthly':
      if (!event.year || !event.month) {
        throw new Error('year and month are required for monthly stats');
      }
      return calculateMonthlyStats(habits, records, event.year, event.month);

    default:
      throw new Error(`Unknown period: ${period}`);
  }
};
