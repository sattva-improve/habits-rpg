import type { AppSyncResolverHandler } from 'aws-lambda';

/**
 * 経験値・レベルシステム
 * - 基本経験値: 15 EXP
 * - 難易度ボーナス: Easy(0.5x), Normal(1.0x), Hard(1.5x), VeryHard(2.0x)
 * - ストリークボーナス: 3日(1.1x), 7日(1.25x), 14日(1.5x), 30日(2.0x), 60日(2.5x)
 * - レベルアップ計算: 必要EXP = 15 × (1.02 ^ (level - 1))
 * - カンスト目安: 1日3習慣(Normal)で59日目にLv.99到達
 */

interface RecordHabitInput {
  habitId: string;
  userId: string;
  completedDate: string;
  completed: boolean;
  note?: string;
}

interface RecordHabitResult {
  record: {
    recordId: string;
    habitId: string;
    userId: string;
    completedDate: string;
    completed: boolean;
    note?: string;
    expEarned: number;
    streakAtCompletion: number;
  };
  expGained: number;
  newStreak: number;
  levelUp: boolean;
  newLevel?: number;
  statLevelUp: boolean;
  newStatLevel?: number;
  statType: string;
  newAchievements: any[];
  newJobs: any[];
}

// 難易度ボーナス倍率
const DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  easy: parseFloat(process.env.DIFFICULTY_EASY || '0.5'),
  normal: parseFloat(process.env.DIFFICULTY_NORMAL || '1.0'),
  hard: parseFloat(process.env.DIFFICULTY_HARD || '1.5'),
  very_hard: parseFloat(process.env.DIFFICULTY_VERY_HARD || '2.0'),
};

// ストリークボーナス閾値と倍率
const STREAK_BONUSES = [
  { threshold: 60, multiplier: parseFloat(process.env.STREAK_60_BONUS || '2.5') },
  { threshold: 30, multiplier: parseFloat(process.env.STREAK_30_BONUS || '2.0') },
  { threshold: 14, multiplier: parseFloat(process.env.STREAK_14_BONUS || '1.5') },
  { threshold: 7, multiplier: parseFloat(process.env.STREAK_7_BONUS || '1.25') },
  { threshold: 3, multiplier: parseFloat(process.env.STREAK_3_BONUS || '1.1') },
];

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
 * 獲得経験値を計算
 */
function calculateExp(difficulty: string, streak: number): number {
  const baseExp = parseInt(process.env.BASE_EXP || '15');
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const streakMultiplier = getStreakMultiplier(streak);

  return Math.floor(baseExp * difficultyMultiplier * streakMultiplier);
}

/**
 * レベルアップに必要な経験値を計算
 */
function getExpForNextLevel(level: number): number {
  const baseExp = 15;
  return Math.floor(baseExp * Math.pow(1.02, level - 1));
}

/**
 * 現在の経験値からレベルを計算
 */
function calculateLevel(totalExp: number): { level: number; expToNextLevel: number } {
  let level = 1;
  let accumulatedExp = 0;

  while (level < 99) {
    const expNeeded = getExpForNextLevel(level);
    if (accumulatedExp + expNeeded > totalExp) {
      break;
    }
    accumulatedExp += expNeeded;
    level++;
  }

  const expToNextLevel = level < 99 ? getExpForNextLevel(level) - (totalExp - accumulatedExp) : 0;

  return { level, expToNextLevel };
}

/**
 * ステータスタイプを習慣カテゴリから決定
 */
function getStatTypeFromCategory(category: string): string {
  const categoryToStat: Record<string, string> = {
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

  return categoryToStat[category] || 'VIT';
}

/**
 * ULIDを生成（簡易版）
 */
function generateUlid(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Array.from({ length: 16 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
  return (timestamp + random).substring(0, 26);
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
 * Lambda Handler
 */
export const handler: AppSyncResolverHandler<RecordHabitInput, RecordHabitResult> = async (event) => {
  const { habitId, userId, completedDate, completed, note } = event.arguments;

  // この部分は実際にはDynamoDBから習慣情報を取得
  // サンプルとして仮のデータを使用
  const habit = {
    habitId,
    userId,
    category: 'exercise',
    difficulty: 'normal',
    currentStreak: 7,
    statType: 'VIT',
    lastCompletedDate: null as string | null, // 実際にはDBから取得
  };

  // ストリーク計算（連続日かどうかをチェック）
  let newStreak: number;
  if (!completed) {
    newStreak = 0;
  } else if (habit.lastCompletedDate === null) {
    // 初めての完了
    newStreak = 1;
  } else if (habit.lastCompletedDate === completedDate) {
    // 同じ日に既に完了している（重複防止）
    newStreak = habit.currentStreak;
  } else if (isConsecutiveDay(habit.lastCompletedDate, completedDate)) {
    // 前日に完了している → ストリーク継続
    newStreak = habit.currentStreak + 1;
  } else {
    // 連続していない → ストリークリセット
    newStreak = 1;
  }

  // 経験値計算
  const expEarned = completed ? calculateExp(habit.difficulty, newStreak) : 0;

  // 現在のユーザー経験値を取得（実際にはDBから）
  const currentTotalExp = 1000; // サンプル値
  const newTotalExp = currentTotalExp + expEarned;

  // レベルアップ判定
  const { level: currentLevel } = calculateLevel(currentTotalExp);
  const { level: newLevel, expToNextLevel } = calculateLevel(newTotalExp);
  const levelUp = newLevel > currentLevel;

  // ステータスレベルアップ判定（簡略化）
  const statLevelUp = levelUp;
  const newStatLevel = statLevelUp ? Math.floor(newLevel / 10) + 1 : undefined;

  // 記録を作成
  const record = {
    recordId: generateUlid(),
    habitId,
    userId,
    completedDate,
    completed,
    note,
    expEarned,
    streakAtCompletion: newStreak,
  };

  // 結果を返す
  return {
    record,
    expGained: expEarned,
    newStreak,
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
    statLevelUp,
    newStatLevel,
    statType: habit.statType,
    newAchievements: [], // アチーブメント判定は別途実装
    newJobs: [], // ジョブ解放判定は別途実装
  };
};
