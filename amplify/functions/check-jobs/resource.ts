import { defineFunction } from '@aws-amplify/backend';

/**
 * ジョブ解放判定を行うLambda関数
 */
export const checkJobsFunction = defineFunction({
  name: 'checkJobs',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});
