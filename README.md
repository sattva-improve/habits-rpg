# Habits RPG - Amplify Gen2 Backend

習慣管理システム（RPG要素付き）のバックエンド実装

## プロジェクト構造

```
amplify/
├── backend.ts              # メインバックエンド定義
├── auth/
│   └── resource.ts         # Cognito認証設定
├── data/
│   ├── resource.ts         # DynamoDB + AppSyncスキーマ
│   └── seed-data.ts        # 初期データ
├── storage/
│   └── resource.ts         # S3ストレージ設定
└── functions/
    ├── record-habit/       # 習慣記録・経験値計算
    ├── check-achievements/ # アチーブメント判定
    ├── check-jobs/         # ジョブ解放判定
    └── calculate-stats/    # 統計計算
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. AWS認証情報の設定

```bash
# AWS CLIが設定済みであることを確認
aws configure
```

### 3. ローカル開発（Sandbox）

```bash
npm run dev
# または
npx ampx sandbox
```

### 4. デプロイ

```bash
npx ampx pipeline-deploy --branch main
```

## 機能一覧

### 認証（Auth）
- メールアドレス/パスワードによる認証
- Cognito User Pools使用
- JWT トークン認証

### データモデル

| モデル | 説明 |
|--------|------|
| User | ユーザー情報、ステータス、レベル |
| Habit | 習慣定義 |
| HabitRecord | 習慣達成記録 |
| Achievement | アチーブメント定義 |
| UserAchievement | ユーザーのアチーブメント進捗 |
| Job | ジョブ（称号）定義 |
| UserJob | ユーザーのジョブ解放状態 |
| CharacterSprite | キャラクタースプライト（ドット絵）定義 |
| UserSprite | ユーザーのスプライト所有・装備状態 |

### ストレージ（S3）

```
habitsRpgStorage/
├── sprites/           # キャラクタードット絵（全ユーザー読み取り可能）
│   ├── base/          # 基本キャラクター
│   ├── outfit/        # 衣装
│   ├── accessory/     # アクセサリー
│   ├── effect/        # エフェクト
│   └── thumbnails/    # サムネイル
├── avatars/{userId}/  # ユーザーアバター（本人のみ書き込み可能）
├── user-sprites/{userId}/  # ユーザーカスタムスプライト
├── achievements/      # アチーブメントアイコン
└── jobs/              # ジョブアイコン
```

### 経験値・レベルシステム

- **基本経験値**: 15 EXP
- **難易度ボーナス**:
  - Easy: 0.5x
  - Normal: 1.0x
  - Hard: 1.5x
  - Very Hard: 2.0x
- **ストリークボーナス**:
  - 3日: 1.1x
  - 7日: 1.25x
  - 14日: 1.5x
  - 30日: 2.0x
  - 60日: 2.5x
- **レベル計算**: 必要EXP = 15 × (1.02 ^ (level - 1))
- **カンスト**: Lv.99（約59日で到達可能）

### ステータスシステム

| ステータス | 略称 | 関連カテゴリ |
|-----------|------|--------------|
| 体力 (Vitality) | VIT | 運動、睡眠、健康 |
| 知力 (Intelligence) | INT | 読書、勉強、学習 |
| 精神 (Mental) | MND | 瞑想、日記、感謝、マインドフルネス |
| 器用 (Dexterity) | DEX | 音楽、アート、クラフト、趣味 |
| 魅力 (Charisma) | CHA | コミュニケーション、社交、身だしなみ |
| 筋力 (Strength) | STR | 筋トレ、スポーツ、フィットネス |

## フロントエンドでの利用

### Amplify クライアントの設定

```typescript
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);
```

### キャラクタードット絵の表示

```typescript
import { getUrl } from 'aws-amplify/storage';

// スプライト画像のURLを取得
async function getSpriteUrl(spriteKey: string): Promise<string> {
  const result = await getUrl({
    path: spriteKey,
  });
  return result.url.toString();
}

// 使用例
const spriteUrl = await getSpriteUrl('sprites/base/default.png');
```

### キャラクター表示コンポーネント例

```tsx
// React コンポーネント例
interface CharacterDisplayProps {
  baseSprite: string;
  outfitSprite?: string;
  accessorySprite?: string;
  effectSprite?: string;
  animationFrame: number;
}

function CharacterDisplay({ 
  baseSprite, 
  outfitSprite, 
  accessorySprite,
  effectSprite,
  animationFrame 
}: CharacterDisplayProps) {
  // スプライトシートからフレームを切り出して表示
  // Canvas APIまたはCSS sprite技術を使用
  return (
    <div className="character-container">
      <SpriteLayer src={effectSprite} frame={animationFrame} layer="effect" />
      <SpriteLayer src={baseSprite} frame={animationFrame} layer="base" />
      <SpriteLayer src={outfitSprite} frame={animationFrame} layer="outfit" />
      <SpriteLayer src={accessorySprite} frame={animationFrame} layer="accessory" />
    </div>
  );
}
```

## API エンドポイント（GraphQL）

Amplify Gen2では、AppSync GraphQL APIが自動生成されます。

### クエリ例

```graphql
# ユーザー情報取得
query GetUser($userId: ID!) {
  getUser(userId: $userId) {
    userId
    displayName
    level
    totalExp
    vitality
    intelligence
    mental
    dexterity
    charisma
    strength
    currentJobId
  }
}

# 習慣一覧取得
query ListHabits($userId: ID!) {
  listHabitsByUser(userId: $userId) {
    items {
      habitId
      name
      category
      currentStreak
      isActive
    }
  }
}
```

### ミューテーション例

```graphql
# 習慣作成
mutation CreateHabit($input: CreateHabitInput!) {
  createHabit(input: $input) {
    habitId
    name
    category
  }
}

# 習慣記録
mutation CreateHabitRecord($input: CreateHabitRecordInput!) {
  createHabitRecord(input: $input) {
    recordId
    completed
    expEarned
  }
}
```

## 開発ノート

### スプライト画像の仕様

- **フォーマット**: PNG（透過対応）
- **基本サイズ**: 32x32 ピクセル
- **特殊サイズ**: 48x48（masterクラス、エフェクト）
- **アニメーション**: スプライトシート形式（横並び）
- **フレーム数**: 1〜16フレーム

### スプライトシート例

```
[Frame1][Frame2][Frame3][Frame4]
|  32  ||  32  ||  32  ||  32  |
```

### 推奨画像ツール

- Aseprite
- Piskel（無料）
- GraphicsGale

## ライセンス

MIT License
