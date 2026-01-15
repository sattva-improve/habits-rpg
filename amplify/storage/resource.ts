import { defineStorage } from '@aws-amplify/backend';

/**
 * S3ストレージ設定
 * - キャラクタースプライト（ドット絵）の保存
 * - ユーザーアバターの保存
 */
export const storage = defineStorage({
  name: 'habitsRpgStorage',
  access: (allow) => ({
    // キャラクタースプライト（ドット絵）- 認証ユーザーが読み取り可能
    'sprites/*': [allow.authenticated.to(['read'])],

    // ユーザーアバター - 本人のみ読み書き可能、他ユーザーは読み取り可能
    'avatars/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],

    // アチーブメントアイコン
    'achievements/*': [allow.authenticated.to(['read'])],

    // ジョブアイコン
    'jobs/*': [allow.authenticated.to(['read'])],
  }),
});
