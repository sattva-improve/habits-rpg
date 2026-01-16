/**
 * GraphQL API サービス
 * AWS Amplify Gen 2 Data Client を使用
 */

import { generateClient } from 'aws-amplify/data';

// Amplifyクライアント（遅延初期化）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;

export function getClient() {
  if (!_client) {
    _client = generateClient();
  }
  return _client;
}

// 後方互換性のためのエクスポート（既存コードが動作するように）
export const client = {
  get models() {
    return getClient().models;
  },
  get graphql() {
    return getClient().graphql;
  },
};

export const graphqlService = {
  getClient,
  client,
};

export default graphqlService;

