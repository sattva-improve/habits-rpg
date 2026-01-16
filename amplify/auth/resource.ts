import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Cognito認証設定
 * OpenAPI仕様に基づく認証機能を提供
 * - メール認証
 * - Google SSO
 * - パスワードリセット機能
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid'],
        attributeMapping: {
          email: 'email',
          preferredUsername: 'name',
          fullname: 'name',
        },
      },
      callbackUrls: [
        'http://localhost:5173/',
        'http://localhost:5173/auth',
        'https://habit-rpg.sattva-improve.com/',
        'https://habit-rpg.sattva-improve.com/auth',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://habit-rpg.sattva-improve.com/',
      ],
    },
  },
  userAttributes: {
    // カスタム属性
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
