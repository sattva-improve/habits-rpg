# Tests

テストディレクトリの構造:

```
tests/
├── e2e/          # E2E テスト (Playwright/Cypress)
├── integration/  # 統合テスト (API テストなど)
├── unit/         # ユニットテスト
└── fixtures/     # テストデータ・モック
```

## テストの実行

### API テスト (統合テスト)

```bash
# TypeScript版
npx ts-node tests/integration/api-test.ts

# curl版 (簡易テスト)
./tests/integration/curl-test.sh
```

### GraphQL Playground

ブラウザで `tests/integration/graphql-playground.html` を開いてください。

## テスト環境

本番環境のテストには、`.env.test` ファイルを設定してください:

```env
GRAPHQL_ENDPOINT=https://your-endpoint.appsync-api.region.amazonaws.com/graphql
API_KEY=your-api-key
```
