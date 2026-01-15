import { defineFunction } from '@aws-amplify/backend';

/**
 * 習慣記録を作成し、経験値とストリークを計算するLambda関数
 */
export const recordHabitFunction = defineFunction({
  name: 'recordHabit',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  environment: {
    // 基本経験値
    BASE_EXP: '15',
    // 難易度ボーナス倍率
    DIFFICULTY_EASY: '0.5',
    DIFFICULTY_NORMAL: '1.0',
    DIFFICULTY_HARD: '1.5',
    DIFFICULTY_VERY_HARD: '2.0',
    // ストリークボーナス倍率
    STREAK_3_BONUS: '1.1',
    STREAK_7_BONUS: '1.25',
    STREAK_14_BONUS: '1.5',
    STREAK_30_BONUS: '2.0',
    STREAK_60_BONUS: '2.5',
  },
});
