import { defineFunction } from '@aws-amplify/backend';

/**
 * アチーブメント判定を行うLambda関数
 */
export const checkAchievementsFunction = defineFunction({
  name: 'checkAchievements',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});
