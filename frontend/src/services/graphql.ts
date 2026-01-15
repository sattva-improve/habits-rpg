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

// 汎用GraphQLリクエスト関数（カスタムクエリ用）
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  // Amplify clientのカスタムクエリ実行
  // 基本的にはclientの型安全なメソッドを使用することを推奨
  const response = await fetch(
    (await import('../../../amplify_outputs.json')).default.data.url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': (await import('../../../amplify_outputs.json')).default.data.api_key,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  return response.json();
}

export const graphqlService = {
  getClient,
  client,
  request: graphqlRequest,
};

export default graphqlService;

