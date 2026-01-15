# 🧪 Habits RPG API テスト

## 概要

Amplify Gen2で構築されたGraphQL APIをテストするためのツールです。

## テスト方法

### 1. GraphQL Playground (ブラウザ)

HTMLファイルを開いてブラウザでGraphQL APIをインタラクティブにテストできます。

```bash
# ブラウザで開く
open test/graphql-playground.html
# または
xdg-open test/graphql-playground.html  # Linux
```

### 2. curlテスト

```bash
# 実行権限を付与
chmod +x test/curl-test.sh

# テスト実行
./test/curl-test.sh
```

### 3. TypeScriptテストスクリプト

```bash
# 特定のテストを実行
npx ts-node test/api-test.ts listAchievements

# 全テスト実行
npx ts-node test/api-test.ts all

# 利用可能なテスト一覧
npx ts-node test/api-test.ts
```

## API情報

| 項目 | 値 |
|------|-----|
| **GraphQL Endpoint** | `https://c44kjstsh5d7rbhlw2yy7wthcu.appsync-api.us-east-1.amazonaws.com/graphql` |
| **API Key** | `da2-4gyvtrzdjjaf5ero4jeb3mrcvq` |
| **Region** | `us-east-1` |

## 認証について

### API Key認証 (公開データ)

以下のマスターデータはAPI Keyでアクセス可能です：
- `Achievement` - アチーブメント
- `Job` - ジョブ
- `CharacterSprite` - キャラクタースプライト

### Cognito認証 (ユーザーデータ)

以下のデータはCognito認証が必要です：
- `User` - ユーザー
- `Habit` - 習慣
- `HabitRecord` - 習慣記録
- `UserAchievement` - ユーザーアチーブメント
- `UserJob` - ユーザージョブ
- `UserSprite` - ユーザースプライト

## サンプルクエリ

### アチーブメント一覧取得

```graphql
query ListAchievements {
  listAchievements {
    items {
      achievementId
      name
      description
      type
      rarity
      expReward
    }
  }
}
```

### ジョブ一覧取得

```graphql
query ListJobs {
  listJobs {
    items {
      jobId
      name
      description
      tier
      expBonus
    }
  }
}
```

### キャラクタースプライト一覧取得

```graphql
query ListCharacterSprites {
  listCharacterSprites {
    items {
      spriteId
      name
      category
      isDefault
      width
      height
    }
  }
}
```

## curlでのテスト例

```bash
# スキーマイントロスペクション
curl -s -X POST \
  "https://c44kjstsh5d7rbhlw2yy7wthcu.appsync-api.us-east-1.amazonaws.com/graphql" \
  -H "Content-Type: application/json" \
  -H "x-api-key: da2-4gyvtrzdjjaf5ero4jeb3mrcvq" \
  -d '{"query": "{ __schema { types { name } } }"}' | jq .

# アチーブメント一覧
curl -s -X POST \
  "https://c44kjstsh5d7rbhlw2yy7wthcu.appsync-api.us-east-1.amazonaws.com/graphql" \
  -H "Content-Type: application/json" \
  -H "x-api-key: da2-4gyvtrzdjjaf5ero4jeb3mrcvq" \
  -d '{"query": "query { listAchievements { items { achievementId name description type rarity } } }"}' | jq .
```

## トラブルシューティング

### `Not Authorized` エラー

- マスターデータ以外のデータにAPI Keyでアクセスしようとしている
- Cognito認証が必要なデータはフロントエンドから認証済みユーザーでアクセスしてください

### `FieldUndefined` エラー

- クエリ内のフィールド名が間違っている
- スキーマイントロスペクションでフィールド名を確認してください：
  ```graphql
  query {
    __type(name: "Achievement") {
      fields {
        name
        type { name }
      }
    }
  }
  ```
