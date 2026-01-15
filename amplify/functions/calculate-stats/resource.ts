import { defineFunction } from '@aws-amplify/backend';

/**
 * 統計情報を計算するLambda関数
 */
export const calculateStatsFunction = defineFunction({
  name: 'calculateStats',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});
