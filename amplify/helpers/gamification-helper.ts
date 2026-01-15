/**
 * ゲーミフィケーション計算ヘルパー
 */

// ===== 定数 =====
const BASE_EXP = 15;

const DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  easy: 0.5,
  normal: 1.0,
  hard: 1.5,
  very_hard: 2.0,
};

const STREAK_BONUSES = [
  { threshold: 60, multiplier: 2.5 },
  { threshold: 30, multiplier: 2.0 },
  { threshold: 14, multiplier: 1.5 },
  { threshold: 7, multiplier: 1.25 },
  { threshold: 3, multiplier: 1.1 },
];

const STAT_EXP_BASE = 10;

// ===== 経験値計算 =====

/**
 * ストリークボーナス倍率を取得
 */
export function getStreakMultiplier(streak: number): number {
  for (const bonus of STREAK_BONUSES) {
    if (streak >= bonus.threshold) {
      return bonus.multiplier;
    }
  }
  return 1.0;
}

/**
 * 難易度ボーナス倍率を取得
 */
export function getDifficultyMultiplier(difficulty: string): number {
  return DIFFICULTY_MULTIPLIERS[difficulty.toLowerCase()] || 1.0;
}

/**
 * 習慣達成時の獲得経験値を計算
 */
export function calculateExpGain(difficulty: string, streak: number): number {
  const difficultyMultiplier = getDifficultyMultiplier(difficulty);
  const streakMultiplier = getStreakMultiplier(streak);
  return Math.floor(BASE_EXP * difficultyMultiplier * streakMultiplier);
}

// ===== レベル計算 =====

/**
 * 特定レベルに到達するのに必要な累計経験値を計算
 */
export function getTotalExpForLevel(level: number): number {
  let totalExp = 0;
  for (let i = 1; i < level; i++) {
    totalExp += getExpForNextLevel(i);
  }
  return totalExp;
}

/**
 * 現在レベルから次レベルに必要な経験値を計算
 */
export function getExpForNextLevel(level: number): number {
  return Math.floor(BASE_EXP * Math.pow(1.02, level - 1));
}

/**
 * 累計経験値からレベルを計算
 */
export function calculateLevelFromExp(totalExp: number): {
  level: number;
  currentLevelExp: number;
  expToNextLevel: number;
  progress: number;
} {
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

  const currentLevelExp = totalExp - accumulatedExp;
  const expToNextLevel = level < 99 ? getExpForNextLevel(level) : 0;
  const progress = level < 99 ? currentLevelExp / expToNextLevel : 1;

  return {
    level,
    currentLevelExp,
    expToNextLevel,
    progress,
  };
}

// ===== ステータス計算 =====

/**
 * ステータス経験値からステータスレベルを計算
 */
export function calculateStatLevel(statExp: number): {
  level: number;
  currentLevelExp: number;
  expToNextLevel: number;
  progress: number;
} {
  let level = 1;
  let accumulatedExp = 0;

  while (level < 99) {
    const expNeeded = Math.floor(STAT_EXP_BASE * Math.pow(1.03, level - 1));
    if (accumulatedExp + expNeeded > statExp) {
      break;
    }
    accumulatedExp += expNeeded;
    level++;
  }

  const currentLevelExp = statExp - accumulatedExp;
  const expToNextLevel = level < 99 ? Math.floor(STAT_EXP_BASE * Math.pow(1.03, level - 1)) : 0;
  const progress = level < 99 ? currentLevelExp / expToNextLevel : 1;

  return {
    level,
    currentLevelExp,
    expToNextLevel,
    progress,
  };
}

/**
 * カテゴリからステータスタイプを取得
 */
export function getStatTypeFromCategory(category: string): string {
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

  return categoryToStat[category.toLowerCase()] || 'VIT';
}

/**
 * ステータスタイプの日本語名を取得
 */
export function getStatTypeName(statType: string): string {
  const names: Record<string, string> = {
    VIT: '体力',
    INT: '知力',
    MND: '精神',
    DEX: '器用',
    CHA: '魅力',
    STR: '筋力',
  };
  return names[statType] || statType;
}

/**
 * ステータスタイプのフルネームを取得
 */
export function getStatTypeFullName(statType: string): string {
  const names: Record<string, string> = {
    VIT: 'Vitality',
    INT: 'Intelligence',
    MND: 'Mental',
    DEX: 'Dexterity',
    CHA: 'Charisma',
    STR: 'Strength',
  };
  return names[statType] || statType;
}

// ===== ストリーク計算 =====

/**
 * ストリークを計算（前回の記録日と今回の記録日から）
 */
export function calculateStreak(
  lastCompletedDate: string | null,
  newCompletedDate: string,
  currentStreak: number
): number {
  if (!lastCompletedDate) {
    return 1;
  }

  const last = new Date(lastCompletedDate);
  const current = new Date(newCompletedDate);

  // 日付の差を計算
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // 連続
    return currentStreak + 1;
  } else if (diffDays === 0) {
    // 同じ日（既に記録済み）
    return currentStreak;
  } else {
    // ストリーク切れ
    return 1;
  }
}

/**
 * ストリークが維持されているかチェック
 */
export function isStreakMaintained(
  lastCompletedDate: string | null,
  currentDate: string
): boolean {
  if (!lastCompletedDate) {
    return false;
  }

  const last = new Date(lastCompletedDate);
  const current = new Date(currentDate);

  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 1;
}

// ===== 達成率計算 =====

/**
 * 期間内の達成率を計算
 */
export function calculateCompletionRate(
  completedCount: number,
  totalDue: number
): number {
  if (totalDue === 0) return 0;
  return Math.round((completedCount / totalDue) * 100) / 100;
}

/**
 * 期間内の習慣達成数を計算（フィルタ済みデータ用）
 */
export function countCompletions(
  records: Array<{ completed: boolean }>
): number {
  return records.filter((r) => r.completed).length;
}

// ===== シミュレーション =====

/**
 * 目標レベルに到達するまでの日数を推定
 */
export function estimateDaysToLevel(
  currentTotalExp: number,
  targetLevel: number,
  dailyHabits: number = 3,
  difficulty: string = 'normal',
  averageStreak: number = 7
): number {
  const targetExp = getTotalExpForLevel(targetLevel);
  const remainingExp = targetExp - currentTotalExp;

  if (remainingExp <= 0) return 0;

  const dailyExp = dailyHabits * calculateExpGain(difficulty, averageStreak);
  return Math.ceil(remainingExp / dailyExp);
}

/**
 * カンスト（Lv.99）までの日数を推定
 */
export function estimateDaysToMax(
  currentTotalExp: number,
  dailyHabits: number = 3,
  difficulty: string = 'normal'
): number {
  return estimateDaysToLevel(currentTotalExp, 99, dailyHabits, difficulty, 30);
}

export default {
  getStreakMultiplier,
  getDifficultyMultiplier,
  calculateExpGain,
  getTotalExpForLevel,
  getExpForNextLevel,
  calculateLevelFromExp,
  calculateStatLevel,
  getStatTypeFromCategory,
  getStatTypeName,
  getStatTypeFullName,
  calculateStreak,
  isStreakMaintained,
  calculateCompletionRate,
  countCompletions,
  estimateDaysToLevel,
  estimateDaysToMax,
};
