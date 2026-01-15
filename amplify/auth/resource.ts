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
    // Google SSO設定 - シークレットが設定されていないため一時的に無効化
    // 使用するには、以下のコマンドでシークレットを設定してください:
    // npx ampx sandbox secret set GOOGLE_CLIENT_ID
    // npx ampx sandbox secret set GOOGLE_CLIENT_SECRET
    // externalProviders: {
    //   google: {
    //     clientId: secret('GOOGLE_CLIENT_ID'),
    //     clientSecret: secret('GOOGLE_CLIENT_SECRET'),
    //     scopes: ['email', 'profile', 'openid'],
    //     attributeMapping: {
    //       email: 'email',
    //       preferredUsername: 'name',
    //       fullname: 'name',
    //     },
    //   },
    //   callbackUrls: [
    //     'http://localhost:5173/',
    //     'http://localhost:5173/auth',
    //   ],
    //   logoutUrls: [
    //     'http://localhost:5173/',
    //   ],
    // },
  },
  userAttributes: {
    // カスタム属性
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
