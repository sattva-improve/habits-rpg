/**
 * GraphQL API サービス
 * AWS Amplify Gen 2 Data Client を使用
 */

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

// 型安全なAmplifyクライアント（遅延初期化）
let _client: ReturnType<typeof generateClient<Schema>> | null = null;

export function getClient() {
  if (!_client) {
    _client = generateClient<Schema>();
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

