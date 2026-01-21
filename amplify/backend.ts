import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Habits RPG Backend
 * 
 * 習慣管理システム（RPG要素付き）のAmplify Gen2バックエンド
 * 
 * Components:
 * - auth: Cognito認証
 * - data: DynamoDB + AppSync
 * - storage: S3ストレージ（キャラクタースプライト、アバター）
 * 
 * Note: 習慣記録、アチーブメント判定、ジョブ解放判定、統計計算は
 * すべてフロントエンドで直接GraphQL APIを使用して実行されます。
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

export default backend;
