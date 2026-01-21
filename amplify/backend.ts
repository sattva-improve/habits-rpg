import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { recordHabitFunction } from './functions/record-habit/resource';
import { checkAchievementsFunction } from './functions/check-achievements/resource';
import { checkJobsFunction } from './functions/check-jobs/resource';
import { calculateStatsFunction } from './functions/calculate-stats/resource';

/**
 * Habits RPG Backend
 * 
 * 習慣管理システム（RPG要素付き）のAmplify Gen2バックエンド
 * 
 * Components:
 * - auth: Cognito認証
 * - data: DynamoDB + AppSync
 * - storage: S3ストレージ（キャラクタースプライト、アバター）
 * - functions: Lambda関数
 *   - recordHabit: 習慣記録・経験値計算
 *   - checkAchievements: アチーブメント判定
 *   - checkJobs: ジョブ解放判定
 *   - calculateStats: 統計計算
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  recordHabitFunction,
  checkAchievementsFunction,
  checkJobsFunction,
  calculateStatsFunction,
});

// recordHabitFunctionにcheckJobsFunctionを呼び出す権限を付与
backend.recordHabitFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [backend.checkJobsFunction.resources.lambda.functionArn],
  })
);

// recordHabitFunctionにcheckJobsFunction名を環境変数として設定
const recordHabitLambda = backend.recordHabitFunction.resources.lambda as LambdaFunction;
recordHabitLambda.addEnvironment(
  'CHECK_JOBS_FUNCTION_NAME',
  backend.checkJobsFunction.resources.lambda.functionName
);

// カスタムリソースの追加（必要に応じて）
// const { cfnUserPool } = backend.auth.resources.cfnResources;

export default backend;
