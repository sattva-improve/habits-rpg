/**
 * ゲーム関連の定数
 */

import type { StatType, HabitDifficulty, AchievementRarity } from '../types';

// ステータスの色とラベル
export const STAT_CONFIG: Record<
  StatType,
  { color: string; label: string; description: string }
> = {
  VIT: {
    color: '#ef4444', // red-500
    label: '体力',
    description: '健康・運動・睡眠に関連',
  },
  INT: {
    color: '#3b82f6', // blue-500
    label: '知力',
    description: '学習・読書・勉強に関連',
  },
  MND: {
    color: '#8b5cf6', // violet-500
    label: '精神',
    description: '瞑想・マインドフルネスに関連',
  },
  DEX: {
    color: '#22c55e', // green-500
    label: '器用',
    description: 'スキル・趣味・クラフトに関連',
  },
  CHA: {
    color: '#f59e0b', // amber-500
    label: '魅力',
    description: 'コミュニケーション・社交に関連',
  },
  STR: {
    color: '#f97316', // orange-500
    label: '筋力',
    description: 'ワークアウト・スポーツに関連',
  },
};

// 難易度の設定
export const DIFFICULTY_CONFIG: Record<
  HabitDifficulty,
  { label: string; expMultiplier: number; color: string }
> = {
  easy: { label: 'かんたん', expMultiplier: 0.5, color: '#22c55e' },
  normal: { label: 'ふつう', expMultiplier: 1.0, color: '#3b82f6' },
  hard: { label: 'むずかしい', expMultiplier: 1.5, color: '#f59e0b' },
  very_hard: { label: '超むずかしい', expMultiplier: 2.0, color: '#ef4444' },
};

// レアリティの設定
export const RARITY_CONFIG: Record<
  AchievementRarity,
  { label: string; color: string; bgColor: string }
> = {
  common: { label: 'コモン', color: '#9ca3af', bgColor: '#374151' },
  uncommon: { label: 'アンコモン', color: '#22c55e', bgColor: '#14532d' },
  rare: { label: 'レア', color: '#3b82f6', bgColor: '#1e3a8a' },
  epic: { label: 'エピック', color: '#8b5cf6', bgColor: '#4c1d95' },
  legendary: { label: 'レジェンダリー', color: '#f59e0b', bgColor: '#78350f' },
};

// 経験値計算
export const EXP_CONFIG = {
  BASE_EXP_PER_COMPLETION: 10,
  STREAK_BONUS_MULTIPLIER: 0.1, // 10% per streak day
  MAX_STREAK_BONUS: 2.0, // 最大2倍
  LEVEL_UP_BASE: 100,
  LEVEL_UP_GROWTH: 1.5, // レベルが上がるごとに必要経験値が1.5倍
};

// レベルアップに必要な累計経験値（レベル1〜100まで）
export const LEVEL_THRESHOLDS: number[] = (() => {
  const thresholds: number[] = [0]; // レベル1は0EXP
  for (let i = 1; i <= 100; i++) {
    const required = Math.floor(EXP_CONFIG.LEVEL_UP_BASE * Math.pow(EXP_CONFIG.LEVEL_UP_GROWTH, i - 1));
    thresholds.push(thresholds[i - 1] + required);
  }
  return thresholds;
})();
