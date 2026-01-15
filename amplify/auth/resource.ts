import { defineAuth } from '@aws-amplify/backend';

/**
 * Cognito認証設定
 * OpenAPI仕様に基づく認証機能を提供
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // カスタム属性
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
