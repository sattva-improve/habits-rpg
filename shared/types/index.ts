/**
 * Habits-RPG 共有型定義
 * バックエンドとフロントエンドで共有される型
 */

// ===== Enums =====

export type HabitCategory =
  | 'exercise'
  | 'sleep'
  | 'health'
  | 'reading'
  | 'study'
  | 'learning'
  | 'meditation'
  | 'journaling'
  | 'gratitude'
  | 'mindfulness'
  | 'music'
  | 'art'
  | 'craft'
  | 'hobby'
  | 'communication'
  | 'social'
  | 'grooming'
  | 'workout'
  | 'sports'
  | 'fitness'
  | 'other';

export type FrequencyType = 'daily' | 'weekly' | 'specific_days';

export type HabitDifficulty = 'easy' | 'normal' | 'hard' | 'very_hard';

export type StatType = 'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR';

export type AchievementType = 'streak' | 'total' | 'level' | 'stat' | 'special' | 'first';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type JobTier = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster';

// ===== Interfaces =====

export interface User {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  avatarKey?: string;
  bio?: string;
  timezone: string;
  // Stats
  vitality: number;
  vitalityExp: number;
  intelligence: number;
  intelligenceExp: number;
  mental: number;
  mentalExp: number;
  dexterity: number;
  dexterityExp: number;
  charisma: number;
  charismaExp: number;
  strength: number;
  strengthExp: number;
  // Level
  level: number;
  totalExp: number;
  currentJobId: string;
  // Streaks
  maxStreak: number;
  currentStreak: number;
}

export interface Habit {
  habitId: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category?: HabitCategory;
  statType?: StatType;
  frequencyType: FrequencyType;
  timesPerWeek?: number;
  specificDays?: number[];
  difficulty: HabitDifficulty;
  reminderEnabled: boolean;
  reminderTime?: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  isActive: boolean;
  isArchived: boolean;
  lastCompletedAt?: string;
  createdAt?: string;
}

export interface HabitRecord {
  recordId: string;
  habitId: string;
  userId: string;
  completedDate: string;
  completed: boolean;
  note?: string;
  expEarned: number;
  streakAtCompletion: number;
}

export interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  rarity: AchievementRarity;
  expReward: number;
  isHidden: boolean;
  targetValue: number;
  targetStatType?: StatType;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
}

export interface Job {
  jobId: string;
  name: string;
  description: string;
  icon: string;
  tier: JobTier;
  requirements?: Record<string, unknown>;
  statBonuses?: Record<StatType, number>;
  expBonus: number;
  requiredLevel: number;
}

export interface UserJob {
  id: string;
  userId: string;
  jobId: string;
  isUnlocked: boolean;
  isEquipped: boolean;
  unlockedAt?: string;
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}
