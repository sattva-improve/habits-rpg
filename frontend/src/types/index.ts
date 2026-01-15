/**
 * フロントエンド型定義
 * 共有型を再エクスポート + フロントエンド固有の型
 */

// 共有型を再エクスポート
export type {
  HabitCategory,
  FrequencyType,
  HabitDifficulty,
  StatType,
  AchievementType,
  AchievementRarity,
  JobTier,
  User,
  Habit,
  HabitRecord,
  Achievement,
  UserAchievement,
  Job,
  UserJob,
  ApiResponse,
  PaginatedResponse,
} from '../../../shared/types';

// フロントエンド固有の型
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface StatDisplayData {
  type: string;
  value: number;
  exp: number;
  color: string;
  label: string;
}

export interface QuestDisplayData {
  id: string;
  name: string;
  icon: string;
  streak: number;
  isCompleted: boolean;
}

// Amplify Schema型のエクスポート
export type { Schema } from '../../../amplify/data/resource';

