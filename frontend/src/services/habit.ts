/**
 * Habit関連のAPIサービス
 * 習慣の作成、記録、経験値・ステータス更新を管理
 */

import { client } from './graphql';
import type { Habit, HabitRecord, User } from '../types';

// ストリークボーナス閾値と倍率
const STREAK_BONUSES = [
  { threshold: 60, multiplier: 2.5 },
  { threshold: 30, multiplier: 2.0 },
  { threshold: 14, multiplier: 1.5 },
  { threshold: 7, multiplier: 1.25 },
  { threshold: 3, multiplier: 1.1 },
];

// ステータスタイプマッピング
const CATEGORY_TO_STAT: Record<string, string> = {
  exercise: 'VIT',
  sleep: 'VIT',
  health: 'VIT',
  reading: 'INT',
  study: 'INT',
  learning: 'INT',
  meditation: 'MND',
  journaling: 'MND',
  gratitude: 'MND',
  mindfulness: 'MND',
  music: 'DEX',
  art: 'DEX',
  craft: 'DEX',
  hobby: 'DEX',
  communication: 'CHA',
  social: 'CHA',
  grooming: 'CHA',
  workout: 'STR',
  sports: 'STR',
  fitness: 'STR',
  other: 'VIT',
};

// ステータスタイプをUserモデルのフィールド名に変換
const STAT_TO_FIELD: Record<string, { level: string; exp: string }> = {
  VIT: { level: 'vitality', exp: 'vitalityExp' },
  INT: { level: 'intelligence', exp: 'intelligenceExp' },
  MND: { level: 'mental', exp: 'mentalExp' },
  DEX: { level: 'dexterity', exp: 'dexterityExp' },
  CHA: { level: 'charisma', exp: 'charismaExp' },
  STR: { level: 'strength', exp: 'strengthExp' },
};

/**
 * ストリークボーナス倍率を計算
 */
function getStreakMultiplier(streak: number): number {
  for (const bonus of STREAK_BONUSES) {
    if (streak >= bonus.threshold) {
      return bonus.multiplier;
    }
  }
  return 1.0;
}

/**
 * 獲得経験値を計算（難易度は固定：normal相当）
 */
function calculateExp(streak: number): number {
  const baseExp = 15;
  const streakMultiplier = getStreakMultiplier(streak);
  return Math.floor(baseExp * streakMultiplier);
}

/**
 * レベルアップに必要な累計経験値を計算
 */
function getExpForLevel(level: number): number {
  const baseExp = 100;
  const growth = 1.5;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(baseExp * Math.pow(growth, i - 1));
  }
  return total;
}

/**
 * 経験値からレベルを計算
 */
function calculateLevelFromExp(totalExp: number): number {
  let level = 1;
  while (level < 99) {
    const nextLevelExp = getExpForLevel(level + 1);
    if (totalExp < nextLevelExp) break;
    level++;
  }
  return level;
}

/**
 * ステータスレベルを計算 (100 EXP per level)
 */
function calculateStatLevel(statExp: number): number {
  return Math.floor(statExp / 100) + 1;
}

/**
 * ユーザーのタイムゾーンを考慮して今日の日付を取得
 */
function getTodayDate(timezone: string = 'Asia/Tokyo'): string {
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
    // タイムゾーンが無効な場合はUTCを使用
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * 2つの日付が連続しているかチェック（前日かどうか）
 */
function isConsecutiveDay(previousDate: string, currentDate: string): boolean {
  const prev = new Date(previousDate);
  const curr = new Date(currentDate);
  
  // 時間をリセットして日付のみで比較
  prev.setHours(0, 0, 0, 0);
  curr.setHours(0, 0, 0, 0);
  
  const diffTime = curr.getTime() - prev.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays === 1;
}

/**
 * 習慣の最新の完了日を取得
 */
async function getLastCompletionDate(habitId: string): Promise<string | null> {
  const { data, errors } = await client.models.HabitRecord.list({
    filter: { 
      habitId: { eq: habitId },
      completed: { eq: true }
    },
  });

  if (errors || !data || data.length === 0) {
    return null;
  }

  // 最新の完了日を取得
  type RecordWithDate = { completedDate?: string | null };
  const sortedRecords = (data as RecordWithDate[])
    .filter((r): r is { completedDate: string } => typeof r.completedDate === 'string')
    .sort((a, b) => b.completedDate.localeCompare(a.completedDate));

  return sortedRecords[0]?.completedDate ?? null;
}

export const habitService = {
  /**
   * ユーザーの習慣一覧を取得
   */
  async getHabits(userId: string): Promise<Habit[]> {
    const { data, errors } = await client.models.Habit.list({
      filter: { userId: { eq: userId } },
    });

    if (errors) {
      console.error('Failed to fetch habits:', errors);
      return [];
    }

    return (data ?? []) as unknown as Habit[];
  },

  /**
   * 習慣を作成
   */
  async createHabit(habit: Partial<Habit>): Promise<Habit | null> {
    const { data, errors } = await client.models.Habit.create({
      habitId: crypto.randomUUID(),
      userId: habit.userId!,
      name: habit.name!,
      description: habit.description,
      icon: habit.icon ?? '📝',
      color: habit.color ?? '#4CAF50',
      category: habit.category,
      statType: habit.statType,
      frequencyType: habit.frequencyType ?? 'daily',
      difficulty: habit.difficulty ?? 'normal',
      reminderEnabled: habit.reminderEnabled ?? false,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      isActive: true,
      isArchived: false,
    });

    if (errors) {
      console.error('Failed to create habit:', errors);
      return null;
    }

    return data as unknown as Habit;
  },

  /**
   * 習慣を更新
   */
  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
    const { data, errors } = await client.models.Habit.update({
      habitId,
      ...updates,
    });

    if (errors) {
      console.error('Failed to update habit:', errors);
      return null;
    }

    return data as unknown as Habit;
  },

  /**
   * 習慣の記録一覧を取得
   */
  async getHabitRecords(habitId: string): Promise<HabitRecord[]> {
    const { data, errors } = await client.models.HabitRecord.list({
      filter: { habitId: { eq: habitId } },
    });

    if (errors) {
      console.error('Failed to fetch habit records:', errors);
      return [];
    }

    return (data ?? []) as unknown as HabitRecord[];
  },

  /**
   * ユーザー全体の習慣記録を取得（日付フィルタリング用）
   */
  async getUserRecordsForDate(userId: string, date: string): Promise<HabitRecord[]> {
    const { data, errors } = await client.models.HabitRecord.list({
      filter: { 
        userId: { eq: userId },
        completedDate: { eq: date }
      },
    });

    if (errors) {
      console.error('Failed to fetch user records:', errors);
      return [];
    }

    return (data ?? []) as unknown as HabitRecord[];
  },

  /**
   * 習慣を完了として記録し、経験値とステータスを更新
   */
  async recordCompletion(
    habitId: string,
    userId: string,
    date: string,
    note?: string
  ): Promise<{ record: HabitRecord | null; expGained: number; levelUp: boolean }> {
    try {
      // 1. 習慣情報を取得
      const { data: habitData } = await client.models.Habit.get({ habitId });
      if (!habitData) {
        console.error('Habit not found:', habitId);
        return { record: null, expGained: 0, levelUp: false };
      }
      const habit = habitData as unknown as Habit;

      // 2. 現在のユーザー情報を取得
      const { data: userData } = await client.models.User.get({ userId });
      if (!userData) {
        console.error('User not found:', userId);
        return { record: null, expGained: 0, levelUp: false };
      }
      const user = userData as unknown as User;

      // 3. 前回の完了日を取得してストリーク計算
      const lastCompletionDate = await getLastCompletionDate(habitId);
      let newStreak: number;
      
      if (lastCompletionDate === null) {
        // 初めての完了
        newStreak = 1;
      } else if (lastCompletionDate === date) {
        // 同じ日に既に完了している（重複防止）
        console.log('Already completed today');
        return { record: null, expGained: 0, levelUp: false };
      } else if (isConsecutiveDay(lastCompletionDate, date)) {
        // 前日に完了している → ストリーク継続
        newStreak = habit.currentStreak + 1;
      } else {
        // 連続していない → ストリークリセット
        newStreak = 1;
        console.log(`Streak reset: last completion was ${lastCompletionDate}, recording for ${date}`);
      }
      
      const newBestStreak = Math.max(newStreak, habit.bestStreak);

      // 4. 経験値計算（難易度は固定: normal相当）
      const expGained = calculateExp(newStreak);

      // 5. 記録を作成
      const { data: recordData, errors: recordErrors } = await client.models.HabitRecord.create({
        recordId: crypto.randomUUID(),
        habitId,
        userId,
        completedDate: date,
        completed: true,
        note,
        expEarned: expGained,
        streakAtCompletion: newStreak,
      });

      if (recordErrors) {
        console.error('Failed to create habit record:', recordErrors);
        return { record: null, expGained: 0, levelUp: false };
      }

      // 6. 習慣のストリークと完了数を更新
      await client.models.Habit.update({
        habitId,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        totalCompletions: habit.totalCompletions + 1,
        lastCompletedAt: new Date().toISOString(),
      });

      // 7. ユーザーの経験値とステータスを更新
      const newTotalExp = user.totalExp + expGained;
      const oldLevel = user.level;
      const newLevel = calculateLevelFromExp(newTotalExp);
      const levelUp = newLevel > oldLevel;

      // 対象ステータスを決定
      const statType = habit.statType || CATEGORY_TO_STAT[habit.category ?? 'other'] || 'VIT';
      
      // ステータス経験値更新用のオブジェクトを構築
      const statFieldNames = STAT_TO_FIELD[statType] || STAT_TO_FIELD.VIT;
      const statExpKey = statFieldNames.exp as keyof User;
      const statLevelKey = statFieldNames.level as keyof User;
      
      const currentStatExp = (user[statExpKey] as number) || 0;
      const newStatExp = currentStatExp + expGained;
      const newStatLevel = calculateStatLevel(newStatExp);

      // ユーザーストリーク計算（全習慣の最大ストリーク）
      const allHabits = await this.getHabits(userId);
      const maxCurrentStreak = Math.max(newStreak, ...allHabits.map(h => h.habitId === habitId ? newStreak : h.currentStreak));
      const maxBestStreak = Math.max(user.maxStreak, maxCurrentStreak);

      // ユーザー更新
      const userUpdate: Record<string, unknown> = {
        userId,
        totalExp: newTotalExp,
        level: newLevel,
        currentStreak: maxCurrentStreak,
        maxStreak: maxBestStreak,
      };

      // ステータス更新を追加
      userUpdate[statExpKey] = newStatExp;
      userUpdate[statLevelKey] = newStatLevel;

      await client.models.User.update(userUpdate as any);

      console.log(`Habit completed! +${expGained} EXP, Streak: ${newStreak}, ${statType} Lv: ${newStatLevel}`);

      return {
        record: recordData as unknown as HabitRecord,
        expGained,
        levelUp,
      };
    } catch (error) {
      console.error('Error recording habit completion:', error);
      return { record: null, expGained: 0, levelUp: false };
    }
  },

  /**
   * 連続ストリークをリセット（日を跨いで未完了の場合）
   */
  async resetStreakIfNeeded(habitId: string, lastCompletedDate: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(lastCompletedDate);
    const todayDate = new Date(today);
    
    // 1日以上経過していたらストリークをリセット
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      await client.models.Habit.update({
        habitId,
        currentStreak: 0,
      });
    }
  },

  /**
   * 習慣を削除（アーカイブ）
   * 注: 経験値やステータスはそのまま維持される
   */
  async deleteHabit(habitId: string): Promise<boolean> {
    try {
      // 論理削除（isArchived=true）
      const { errors } = await client.models.Habit.update({
        habitId,
        isArchived: true,
        isActive: false,
      });

      if (errors) {
        console.error('Failed to delete habit:', errors);
        return false;
      }

      console.log(`🗑️ Habit archived: ${habitId}`);
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  },
};

export default habitService;

